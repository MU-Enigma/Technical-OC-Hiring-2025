import ttkbootstrap as tb
from ttkbootstrap.constants import *
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog
import os
import hashlib
import json
import base64
import random
import re
import math
import hmac
import time
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.asymmetric import rsa, padding as asym_padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.exceptions import InvalidSignature

# --- INTERACTIVE FLOATING PARTICLES ANIMATION ---
class FloatingParticles:
    def __init__(self, canvas, num_particles=50, color="#00FF41"):
        self.canvas = canvas
        self.width = canvas.winfo_width()
        self.height = canvas.winfo_height()
        self.num_particles = num_particles
        self.color = color
        self.particles = []
        self.interaction_radius = 150
        self.init_particles()

    def init_particles(self):
        for _ in range(self.num_particles):
            x = random.uniform(0, self.width)
            y = random.uniform(0, self.height)
            vx = random.uniform(-0.5, 0.5)
            vy = random.uniform(-0.5, 0.5)
            radius = random.uniform(1, 3)
            particle_id = self.canvas.create_oval(x-radius, y-radius, x+radius, y+radius, fill=self.color, outline="", tags='particle')
            self.particles.append({'id': particle_id, 'x': x, 'y': y, 'vx': vx, 'vy': vy, 'radius': radius})

    def update(self):
        for p in self.particles:
            p['x'] += p['vx']
            p['y'] += p['vy']
            if p['x'] - p['radius'] < 0 or p['x'] + p['radius'] > self.width:
                p['vx'] *= -1
            if p['y'] - p['radius'] < 0 or p['y'] + p['radius'] > self.height:
                p['vy'] *= -1
            self.canvas.coords(p['id'], p['x']-p['radius'], p['y']-p['radius'], p['x']+p['radius'], p['y']+p['radius'])

    def interact(self, mouse_x, mouse_y):
        for p in self.particles:
            dist_x = p['x'] - mouse_x
            dist_y = p['y'] - mouse_y
            dist = math.sqrt(dist_x**2 + dist_y**2)
            if dist < self.interaction_radius:
                force = (1 - (dist / self.interaction_radius)) * 0.5
                p['vx'] += (dist_x / dist) * force
                p['vy'] += (dist_y / dist) * force

    def explode(self, click_x, click_y):
        for p in self.particles:
            dist_x = p['x'] - click_x
            dist_y = p['y'] - click_y
            dist = math.sqrt(dist_x**2 + dist_y**2)
            if dist < self.interaction_radius / 2:
                angle = math.atan2(dist_y, dist_x)
                force = (1 - (dist / (self.interaction_radius / 2))) * 5
                p['vx'] += math.cos(angle) * force
                p['vy'] += math.sin(angle) * force

# --- CRYPTOGRAPHIC PRIMITIVES ---
class SHA256:
    def hash(self, data: bytes) -> bytes:
        return hashlib.sha256(data).digest()

class PBKDF2:
    def hash(self, password: str, salt: bytes, iterations: int = 100000) -> bytes:
        return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)

class AES:
    def encrypt(self, key: bytes, plaintext: bytes) -> bytes:
        iv = os.urandom(16)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(plaintext) + padder.finalize()
        return iv + encryptor.update(padded_data) + encryptor.finalize()

    def decrypt(self, key: bytes, ciphertext: bytes) -> bytes:
        iv = ciphertext[:16]
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_plaintext = decryptor.update(ciphertext[16:]) + decryptor.finalize()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        return unpadder.update(padded_plaintext) + unpadder.finalize()

class RSA:
    def generate_key_pair(self):
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048, backend=default_backend())
        return private_key, private_key.public_key()

    def encrypt(self, public_key, plaintext: bytes) -> bytes:
        return public_key.encrypt(plaintext, asym_padding.OAEP(mgf=asym_padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None))

    def decrypt(self, private_key, ciphertext: bytes) -> bytes:
        return private_key.decrypt(ciphertext, asym_padding.OAEP(mgf=asym_padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None))

    def sign(self, private_key, data: bytes) -> bytes:
        return private_key.sign(data, asym_padding.PSS(mgf=asym_padding.MGF1(hashes.SHA256()), salt_length=asym_padding.PSS.MAX_LENGTH), hashes.SHA256())

    def verify(self, public_key, signature: bytes, data: bytes) -> bool:
        try:
            public_key.verify(signature, data, asym_padding.PSS(mgf=asym_padding.MGF1(hashes.SHA256()), salt_length=asym_padding.PSS.MAX_LENGTH), hashes.SHA256())
            return True
        except InvalidSignature:
            return False

    def serialize_public_key(self, public_key) -> bytes:
        return public_key.public_bytes(encoding=serialization.Encoding.PEM, format=serialization.PublicFormat.SubjectPublicKeyInfo)

    def deserialize_public_key(self, key_data: bytes):
        return serialization.load_pem_public_key(key_data, backend=default_backend())

    def serialize_private_key(self, private_key, password: str) -> bytes:
        return private_key.private_bytes(encoding=serialization.Encoding.PEM, format=serialization.PrivateFormat.PKCS8, encryption_algorithm=serialization.BestAvailableEncryption(password.encode('utf-8')))

    def deserialize_private_key(self, key_data: bytes, password: str):
        return serialization.load_pem_private_key(key_data, password=password.encode('utf-8'), backend=default_backend())

# --- USER & FILE MANAGEMENT ---
class UserManager:
    def __init__(self, db_file="users.db.json"):
        self.db_file = db_file
        self._users = {}
        self.pbkdf2 = PBKDF2()
        self.rsa = RSA()
        self.load_users()

    def load_users(self):
        try:
            if os.path.exists(self.db_file):
                with open(self.db_file, 'r') as f:
                    content = f.read()
                    if not content:
                        self._users = {}
                        return
                    b64_users = json.loads(content)
                    for username, data in b64_users.items():
                        self._users[username] = {
                            'salt': base64.b64decode(data['salt']),
                            'hashed_password': base64.b64decode(data['hashed_password']),
                            'public_key': base64.b64decode(data['public_key'])
                        }
        except (IOError, json.JSONDecodeError) as e:
            print(f"Warning: Could not load user database: {e}")
            self._users = {}

    def save_users(self):
        b64_users = {}
        for username, data in self._users.items():
            b64_users[username] = {
                'salt': base64.b64encode(data['salt']).decode('utf-8'),
                'hashed_password': base64.b64encode(data['hashed_password']).decode('utf-8'),
                'public_key': base64.b64encode(data['public_key']).decode('utf-8')
            }
        with open(self.db_file, 'w') as f:
            json.dump(b64_users, f, indent=4)

    def register(self, username, password):
        if username in self._users: return None
        salt = os.urandom(16)
        hashed_password = self.pbkdf2.hash(password, salt)
        private_key, public_key = self.rsa.generate_key_pair()
        self._users[username] = {'salt': salt, 'hashed_password': hashed_password, 'public_key': self.rsa.serialize_public_key(public_key)}
        self.save_users()
        return private_key

    def login(self, username, password):
        user_data = self._users.get(username)
        if not user_data: return False, None
        if self.pbkdf2.hash(password, user_data['salt']) == user_data['hashed_password']:
            # On successful login, also derive the database key
            db_key = self.pbkdf2.hash(password, user_data['salt'], 1) # Use 1 iteration for speed
            return True, db_key
        return False, None

    def get_public_key(self, username):
        user_data = self._users.get(username)
        if user_data: return self.rsa.deserialize_public_key(user_data['public_key'])
        return None

    def delete_user(self, username):
        if username in self._users:
            del self._users[username]
            self.save_users()
            return True
        return False

class FileManager:
    def __init__(self, user_manager, username, db_key):
        self.db_file = f"{username}_files.db.enc"
        self.username = username
        self.db_key = db_key
        self._file_store = {}
        self.user_manager = user_manager
        self.aes = AES()
        self.rsa = RSA()
        self.sha256 = SHA256()
        self.load_files()

    def load_files(self):
        try:
            if os.path.exists(self.db_file):
                with open(self.db_file, 'rb') as f:
                    encrypted_content = f.read()
                if not encrypted_content:
                    self._file_store = {}
                    return
                
                decrypted_json = self.aes.decrypt(self.db_key, encrypted_content)
                b64_files = json.loads(decrypted_json.decode('utf-8'))
                
                for file_id, data in b64_files.items():
                    self._file_store[file_id] = {
                        'owner': data['owner'],
                        'encrypted_content': base64.b64decode(data['encrypted_content']),
                        'encrypted_aes_key': base64.b64decode(data['encrypted_aes_key']),
                        'integrity_hmac': base64.b64decode(data.get('integrity_hmac', '')),
                        'signature': base64.b64decode(data.get('signature', ''))
                    }
        except Exception as e:
            print(f"Warning: Could not load or decrypt file database: {e}. It may be corrupt or the password is wrong.")
            self._file_store = {}
    
    def save_files(self):
        b64_files = {}
        for file_id, data in self._file_store.items():
            b64_files[file_id] = {
                'owner': data['owner'],
                'encrypted_content': base64.b64encode(data['encrypted_content']).decode('utf-8'),
                'encrypted_aes_key': base64.b64encode(data['encrypted_aes_key']).decode('utf-8'),
                'integrity_hmac': base64.b64encode(data['integrity_hmac']).decode('utf-8'),
                'signature': base64.b64encode(data['signature']).decode('utf-8')
            }
        
        json_string = json.dumps(b64_files, indent=4)
        encrypted_data = self.aes.encrypt(self.db_key, json_string.encode('utf-8'))
        
        with open(self.db_file, 'wb') as f:
            f.write(encrypted_data)

    def upload_file(self, username, filename, file_content, private_key):
        public_key = self.user_manager.get_public_key(username)
        if not public_key: return False
        
        file_id = f"{username}_{os.path.basename(filename)}_{int(time.time())}"
        
        metadata_to_sign = f"{username}:{file_id}".encode('utf-8')
        signature = self.rsa.sign(private_key, metadata_to_sign)

        aes_key = os.urandom(32)
        encrypted_content = self.aes.encrypt(aes_key, file_content)
        encrypted_aes_key = self.rsa.encrypt(public_key, aes_key)
        
        integrity_hmac = hmac.new(aes_key, encrypted_content, hashlib.sha256).digest()
        
        self._file_store[file_id] = {
            'owner': username, 
            'encrypted_content': encrypted_content, 
            'encrypted_aes_key': encrypted_aes_key, 
            'integrity_hmac': integrity_hmac,
            'signature': signature
        }
        self.save_files()
        return True

    def download_file(self, file_id, private_key):
        file_data = self._file_store.get(file_id)
        if not file_data: raise ValueError("File not found.")
        
        decrypted_aes_key = self.rsa.decrypt(private_key, file_data['encrypted_aes_key'])
        
        stored_hmac = file_data['integrity_hmac']
        encrypted_content = file_data['encrypted_content']
        calculated_hmac = hmac.new(decrypted_aes_key, encrypted_content, hashlib.sha256).digest()

        if not hmac.compare_digest(stored_hmac, calculated_hmac):
            raise ValueError("File integrity check failed! File may be tampered with.")

        decrypted_content = self.aes.decrypt(decrypted_aes_key, encrypted_content)
        return decrypted_content

    def get_user_files(self, username):
        user_files = {}
        public_key = self.user_manager.get_public_key(username)
        if not public_key: return {}

        for file_id, data in self._file_store.items():
            if data['owner'] == username:
                metadata_to_verify = f"{username}:{file_id}".encode('utf-8')
                if self.rsa.verify(public_key, data['signature'], metadata_to_verify):
                    user_files[file_id] = f"{os.path.basename(file_id.split('_', 1)[1])}"
        return user_files

    def delete_user_files(self):
        if os.path.exists(self.db_file):
            os.remove(self.db_file)

# --- MODERN UI APPLICATION ---
class App(tb.Window):
    def __init__(self):
        super().__init__(themename="cyborg")
        self.title("FileCrypt")
        self.geometry("900x650")
        self.current_user = None
        self.user_private_key = None
        self.user_manager = UserManager()
        self.file_manager = None # Will be instantiated on login
        self.rsa = RSA()
        
        self.BG_COLOR = "#000000"
        self.FG_COLOR = "#00FF41"

        self.canvas = tk.Canvas(self, bg=self.BG_COLOR, highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)
        
        self.particles = None
        self.animation_job = None

        self.canvas.bind('<Motion>', self.on_mouse_move)
        self.canvas.bind('<Button-1>', self.on_mouse_click)

        style = tb.Style.get_instance()
        style.configure('black.TFrame', background=self.BG_COLOR)
        style.configure('black.TLabelframe', background=self.BG_COLOR, bordercolor=self.FG_COLOR)
        style.configure('black.TLabelframe.Label', foreground=self.FG_COLOR, background=self.BG_COLOR, font=("Consolas", 11))
        
        self.frames = {}
        self.frame_windows = {}
        for F in (LoginFrame, RegisterFrame, AppFrame):
            frame = F(parent=self, controller=self)
            self.frames[F.__name__] = frame
            self.frame_windows[F.__name__] = self.canvas.create_window(0, 0, window=frame, anchor="center", state='hidden')
        
        self.bind("<Configure>", self.on_resize)
        self.show_frame("LoginFrame")
        self.update_idletasks()
        self.on_resize(None)

    def start_animation(self):
        if self.animation_job:
            self.after_cancel(self.animation_job)
        self.animate_particles()

    def animate_particles(self):
        if self.particles:
            self.particles.update()
        self.animation_job = self.after(16, self.animate_particles)

    def on_resize(self, event):
        width = self.winfo_width()
        height = self.winfo_height()
        if width < 10 or height < 10: return

        for fw_id in self.frame_windows.values():
            self.canvas.coords(fw_id, width // 2, height // 2)
        
        self.canvas.delete('particle') 
        self.particles = FloatingParticles(self.canvas, num_particles=75, color=self.FG_COLOR)
        self.start_animation()

    def on_mouse_move(self, event):
        if self.particles:
            self.particles.interact(event.x, event.y)

    def on_mouse_click(self, event):
        if self.particles:
            self.particles.explode(event.x, event.y)

    def show_frame(self, page_name):
        for name, fw_id in self.frame_windows.items():
            state = 'normal' if name == page_name else 'hidden'
            self.canvas.itemconfig(fw_id, state=state)
        
        frame = self.frames[page_name]
        if page_name == "AppFrame":
            frame.on_show()

class LoginFrame(tb.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, style='black.TFrame')
        self.controller = controller
        
        center_frame = tb.Frame(self, style='black.TFrame')
        center_frame.pack(padx=30, pady=30)

        header = tb.Frame(center_frame, style='black.TFrame')
        header.pack(fill="x", pady=(0, 20))
        tb.Label(header, text="FileCrypt", font=("Consolas", 32, "bold"), 
                 bootstyle=(INVERSE)).pack()

        form = tb.Frame(center_frame, padding=20, style='black.TFrame')
        form.pack(fill="x")

        tb.Label(form, text="Username", font=("Consolas", 12), bootstyle=(INVERSE)).pack(anchor="w", pady=(10, 5))
        self.username_entry = tb.Entry(form, width=40, font=("Consolas", 12), bootstyle=SUCCESS)
        self.username_entry.pack(fill="x", pady=(0, 20))

        tb.Label(form, text="Password", font=("Consolas", 12), bootstyle=(INVERSE)).pack(anchor="w", pady=(10, 5))
        self.password_entry = tb.Entry(form, show="*", width=40, font=("Consolas", 12), bootstyle=SUCCESS)
        self.password_entry.pack(fill="x", pady=(0, 20))

        tb.Button(form, text="Login", command=self.login, bootstyle=SUCCESS).pack(fill='x', pady=20)
        
        tb.Button(form, text="Don't have an account? Sign Up", 
                  command=lambda: self.controller.show_frame("RegisterFrame"), 
                  bootstyle=(LINK, SUCCESS)).pack()

    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if not username or not password:
            messagebox.showerror("Error", "Username and password cannot be empty.")
            return
        
        is_valid, db_key = self.controller.user_manager.login(username, password)
        if is_valid:
            self.controller.current_user = username
            self.controller.user_private_key = None
            # Instantiate the file manager for this user with their specific key
            self.controller.file_manager = FileManager(self.controller.user_manager, username, db_key)
            
            self.username_entry.delete(0, tk.END)
            self.password_entry.delete(0, tk.END)
            self.controller.show_frame("AppFrame")
        else:
            messagebox.showerror("Error", "Invalid username or password.")

class RegisterFrame(tb.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, style='black.TFrame')
        self.controller = controller

        center_frame = tb.Frame(self, style='black.TFrame')
        center_frame.pack(padx=30, pady=30)

        header = tb.Frame(center_frame, style='black.TFrame')
        header.pack(fill="x", pady=(0, 20))
        tb.Label(header, text="Create Account", font=("Consolas", 32, "bold"), bootstyle=(INVERSE)).pack()

        form = tb.Frame(center_frame, padding=20, style='black.TFrame')
        form.pack(fill="x")

        tb.Label(form, text="Username", font=("Consolas", 12), bootstyle=(INVERSE)).pack(anchor="w", pady=(10, 5))
        self.username_entry = tb.Entry(form, width=40, font=("Consolas", 12), bootstyle=SUCCESS)
        self.username_entry.pack(fill="x", pady=(0, 20))

        tb.Label(form, text="Password", font=("Consolas", 12), bootstyle=(INVERSE)).pack(anchor="w", pady=(10, 5))
        self.password_entry = tb.Entry(form, show="*", width=40, font=("Consolas", 12), bootstyle=SUCCESS)
        self.password_entry.pack(fill="x", pady=(0, 20))

        tb.Button(form, text="Register", command=self.register, bootstyle=(SUCCESS, OUTLINE)).pack(fill='x', pady=20)
        tb.Button(form, text="Already have an account? Login", 
                  command=lambda: self.controller.show_frame("LoginFrame"), 
                  bootstyle=(LINK, INFO)).pack()

    def is_password_strong(self, password):
        """Checks if the password meets the strength requirements."""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long."
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter."
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter."
        if not re.search(r"[0-9]", password):
            return False, "Password must contain at least one number."
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
            return False, "Password must contain at least one special character."
        return True, ""

    def register(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if not username or not password:
            messagebox.showerror("Error", "Username and password cannot be empty.")
            return

        is_strong, message = self.is_password_strong(password)
        if not is_strong:
            error_title = "Weak Password"
            error_message = (
                f"{message}\n\n"
                "Password must contain all of the following:\n"
                "  • At least 8 characters\n"
                "  • At least one uppercase letter (A-Z)\n"
                "  • At least one lowercase letter (a-z)\n"
                "  • At least one number (0-9)\n"
                "  • At least one special character (!@#$...)"
            )
            messagebox.showerror(error_title, error_message)
            return

        private_key = self.controller.user_manager.register(username, password)
        if private_key:
            messagebox.showinfo("Registration Successful", f"User '{username}' created.")
            self.username_entry.delete(0, tk.END)
            self.password_entry.delete(0, tk.END)
            self.prompt_save_private_key(private_key, username)
            self.controller.show_frame("LoginFrame")
        else:
            messagebox.showerror("Error", "Username already exists. Please choose another.")

    def prompt_save_private_key(self, private_key, username):
        messagebox.showinfo("Save Private Key", "IMPORTANT: You must now save your private key. It is required to decrypt your files and CANNOT be recovered if lost.")
        key_password = simpledialog.askstring("Create Key Password", "Enter a strong password to encrypt your private key file:", show='*')
        if not key_password:
            messagebox.showwarning("Warning", "Private key not saved. You will NOT be able to download and decrypt your files.")
            return
        try:
            serialized_key = self.controller.rsa.serialize_private_key(private_key, key_password)
            filepath = filedialog.asksaveasfilename(
                title="Save Your Private Key",
                initialfile=f"{username}_private_key.pem",
                defaultextension=".pem",
                filetypes=[("PEM files", "*.pem"), ("All files", "*.*")]
            )
            if filepath:
                with open(filepath, "wb") as f: f.write(serialized_key)
                messagebox.showinfo("Success", f"Private key saved to {filepath}. Keep it safe and do not lose it!")
        except Exception as e:
            messagebox.showerror("Error", f"Could not save private key: {e}")

class AppFrame(tb.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, style='black.TFrame')
        self.controller = controller
        self.user_files_map = {}
        
        self.columnconfigure(0, weight=1)
        self.rowconfigure(1, weight=1)

        # Header
        header_frame = tb.Frame(self, padding=(15, 20), style='black.TFrame')
        header_frame.grid(row=0, column=0, sticky="ew")
        self.welcome_label = tb.Label(header_frame, text="", font=("Consolas", 14), bootstyle=(INVERSE))
        self.welcome_label.pack(side="left", expand=True, anchor="w")
        
        tb.Button(header_frame, text="Logout", command=self.logout, bootstyle=(WARNING, OUTLINE), padding=8).pack(side="right")
        tb.Button(header_frame, text="Delete Account", command=self.delete_account, bootstyle=(DANGER, OUTLINE), padding=8).pack(side="right", padx=(0, 5))
        
        # File list
        list_frame = tb.LabelFrame(self, text="Your Encrypted Files", padding="20", style='black.TLabelframe')
        list_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=10)
        list_frame.rowconfigure(0, weight=1)
        list_frame.columnconfigure(0, weight=1)
        
        self.file_listbox = tk.Listbox(list_frame, font=("Consolas", 11), borderwidth=0, relief="solid",
                                       bg=controller.BG_COLOR, fg=controller.FG_COLOR,
                                       selectbackground=controller.FG_COLOR, selectforeground=controller.BG_COLOR,
                                       highlightthickness=0)
        self.file_listbox.grid(row=0, column=0, sticky="nsew")
        
        # Action buttons
        btn_frame = tb.Frame(self, padding=(0, 20, 20, 20), style='black.TFrame')
        btn_frame.grid(row=2, column=0, sticky="ew")
        btn_frame.columnconfigure((0, 1), weight=1)
        tb.Button(btn_frame, text="Upload File", command=self.upload, bootstyle=SUCCESS).grid(row=0, column=0, sticky="ew", padx=(0, 5))
        tb.Button(btn_frame, text="Download Selected File", command=self.download, bootstyle=INFO).grid(row=0, column=1, sticky="ew", padx=(5, 0))

    def on_show(self):
        self.welcome_label.config(text=f"Welcome, {self.controller.current_user}")
        self.refresh_file_list()

    def refresh_file_list(self):
        self.file_listbox.delete(0, tk.END)
        if self.controller.file_manager:
            self.user_files_map = self.controller.file_manager.get_user_files(self.controller.current_user)
            for file_id, display_name in self.user_files_map.items():
                self.file_listbox.insert(tk.END, display_name)

    def logout(self):
        self.controller.current_user = None
        self.controller.user_private_key = None
        self.controller.file_manager = None # Clear the file manager
        self.controller.show_frame("LoginFrame")

    def upload(self):
        if not self.controller.user_private_key:
            messagebox.showinfo("Private Key Required", "For security, you must load your private key to sign and upload a new file.")
            self.load_private_key()
            if not self.controller.user_private_key: return

        filepath = filedialog.askopenfilename(title="Select a file to encrypt and upload")
        if not filepath: return
        try:
            with open(filepath, "rb") as f:
                content = f.read()
            success = self.controller.file_manager.upload_file(self.controller.current_user, os.path.basename(filepath), content, self.controller.user_private_key)
            if success:
                messagebox.showinfo("Success", f"'{os.path.basename(filepath)}' was successfully encrypted and uploaded.")
                self.refresh_file_list()
            else:
                messagebox.showerror("Error", "File upload failed.")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred during upload: {e}")

    def download(self):
        if not self.file_listbox.curselection():
            messagebox.showwarning("Warning", "Please select a file to download.")
            return
        
        selected_display_name = self.file_listbox.get(self.file_listbox.curselection()[0])
        file_id_to_download = None
        for file_id, display_name in self.user_files_map.items():
            if display_name == selected_display_name:
                file_id_to_download = file_id
                break
        
        if not file_id_to_download:
             messagebox.showerror("Error", "Could not find the selected file.")
             return

        if not self.controller.user_private_key:
            self.load_private_key()
        
        if self.controller.user_private_key:
            try:
                decrypted_content = self.controller.file_manager.download_file(file_id_to_download, self.controller.user_private_key)
                save_path = filedialog.asksaveasfilename(title="Save decrypted file", initialfile=os.path.basename(selected_display_name))
                if save_path:
                    with open(save_path, "wb") as f: f.write(decrypted_content)
                    messagebox.showinfo("Success", f"File downloaded and decrypted to:\n{save_path}")
            except Exception as e:
                messagebox.showerror("Download Failed", f"Decryption failed: {e}\n\nThis may be due to an incorrect private key or the wrong password for the key.")
                self.controller.user_private_key = None

    def load_private_key(self):
        filepath = filedialog.askopenfilename(title="Select your private key file (.pem)", filetypes=[("PEM files", "*.pem")])
        if not filepath: return
        key_password = simpledialog.askstring("Private Key Password", "Enter the password for your private key file:", show='*')
        if not key_password: return
        try:
            with open(filepath, "rb") as f:
                key_data = f.read()
            private_key = self.controller.rsa.deserialize_private_key(key_data, key_password)
            self.controller.user_private_key = private_key
            messagebox.showinfo("Success", "Private key loaded successfully for this session.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load private key: {e}\n\nPlease ensure you selected the correct key and entered the correct password.")
            self.controller.user_private_key = None

    def delete_account(self):
        username = self.controller.current_user
        
        password = simpledialog.askstring("Confirm Deletion", f"This action is irreversible and will delete all your encrypted files.\n\nPlease enter your password for '{username}' to proceed:", show='*')
        
        if not password:
            messagebox.showinfo("Cancelled", "Account deletion cancelled.")
            return

        is_valid, _ = self.controller.user_manager.login(username, password)
        if not is_valid:
            messagebox.showerror("Error", "Incorrect password. Account deletion cancelled.")
            return

        confirm = messagebox.askyesno("ARE YOU SURE?", f"FINAL WARNING: All data for user '{username}' will be permanently deleted. This includes all your uploaded files.\n\nDo you wish to proceed?")

        if confirm:
            try:
                if self.controller.file_manager:
                    self.controller.file_manager.delete_user_files()
                self.controller.user_manager.delete_user(username)
                messagebox.showinfo("Success", "Account and all associated files have been permanently deleted.")
                self.logout()
            except Exception as e:
                messagebox.showerror("Error", f"An error occurred during account deletion: {e}")
        else:
            messagebox.showinfo("Cancelled", "Account deletion cancelled.")


if __name__ == "__main__":
    app = App()
    app.mainloop()
