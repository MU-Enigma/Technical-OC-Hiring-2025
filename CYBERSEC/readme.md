<pre>
  _____ _ _      ____                _   
 |  ___| (_) ___|  _ \ ___  __ _ ___| |_ 
 | |_  | | |/ __| |_) / _ \/ _` / __| __|
 |  _| | | | (__|  _ <  __/ (_| \__ \ |_ 
 |_|   |_|_|\___|_| \_\___|\__,_|___/\__|
                                        
</pre>

[![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-project_complete-success.svg)]()

> A secure, local-first file encryption utility with a case study on vulnerability analysis and patching.

FileCrypt is a desktop application that provides secure, end-to-end encrypted file storage. All cryptographic operations happen locally on the user's machine, ensuring that sensitive data and private keys are never exposed.

---

### ✨ Features

* 🔐 **Secure User Authentication:** Passwords are never stored directly. The system uses PBKDF2 with a unique salt for each user to securely hash credentials.
* 🛡️ **End-to-End Encryption:** Files are encrypted using a robust hybrid encryption scheme (AES-256 for file content, RSA-2048 for key management).
* 💾 **Persistent Storage:** User accounts and encrypted files are saved locally and persist between application sessions.
* 🔑 **User-Controlled Keys:** Users are the sole custodians of their private keys, which are required to decrypt files and are themselves protected by a user-defined password.
* 💻 **Modern UI:** A clean, modern user interface built with `ttkbootstrap`, featuring an animated "digital rain" background for a distinct aesthetic.

---

### 🛠️ Installation

To run FileCrypt, you need Python 3 and a few external libraries.

1.  **Install Python:** If you don't have it, download and install Python from [python.org](https://python.org/).

2.  **Install Required Libraries:** Open your terminal or command prompt and run the following command:
    ```bash
    pip install ttkbootstrap cryptography
    ```

---

### 🚀 Usage

1.  Save the application code as a Python file (e.g., `filecrypt.py`).
2.  Open your terminal or command prompt and navigate to the folder where you saved the file.
3.  Run the application with the following command:
    ```bash
    python filecrypt.py
    ```
    The application window will open, and you can register a new user or log in.

---

### 🔬 Project Demonstration: Vulnerability & Patch

This project demonstrates a critical security flaw and its solution, forming a complete secure development lifecycle.

#### The Vulnerability: Data Availability Attack

> The initial version of the application stored its file index in an unencrypted, unverified JSON file (`files.db.json`). This created a significant vulnerability.

* **The Exploit:** A separate tool, `FileStealer`, was created to demonstrate the flaw. This tool could directly open and modify the `files.db.json` file. By reading the contents, it could identify all files belonging to a specific user and simply delete those entries from the database.

* **The Impact:** This resulted in a **Denial of Service (DoS)** attack. When the victim logged back into FileCrypt, their files were gone from the list, making them permanently inaccessible through the application.

#### The Proposed Fix: Digital Signatures

> To make the application invulnerable to this type of metadata tampering, a robust cryptographic control must be implemented: **Digital Signatures**.

* **The Solution:** The patched version of the application would require a user to load their private key to upload a file. It would then use this key to create a unique digital signature for the file's metadata (its owner and a unique ID). When the user logs in, the application would use their public key to verify the signature of every file. If a signature is invalid (meaning the database has been tampered with), the file is ignored. This securely binds each file to its owner and makes the database tamper-proof.

---

### 📦 Creating a Standalone Application

To package FileCrypt as a double-clickable `.exe` file for easy distribution, you can use `PyInstaller`.

1.  **Install PyInstaller:**
    ```bash
    pip install pyinstaller
    ```
2.  **Build the Executable:**
    ```bash
    pyinstaller --onefile --windowed filecrypt.py
    ```
    You will find the final application in the `dist` folder.

---

### License

This project is licensed under the MIT License.
