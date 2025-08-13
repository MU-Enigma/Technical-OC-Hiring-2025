<pre>
  
  ______ _ _         _____                  _   
 |  ____(_) |       / ____|                | |  
 | |__   _| | ___  | |     _ __ _   _ _ __ | |_ 
 |  __| | | |/ _ \ | |    | '__| | | | '_ \| __|
 | |    | | |  __/ | |____| |  | |_| | |_) | |_ 
 |_|    |_|_|\___|  \_____|_|   \__, | .__/ \__|
                                 __/ | |        
                                |___/|_|        

                                                                                                                      
                                                                                                                      
                                        
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

### 🚀 Usage

1.  Navigate to the **Releases** page of this repository.
2.  Download the latest `FileCrypt.exe` file.
3.  Double-click the downloaded file to run the application. No installation is required.

---


### 🎥 Video Demo

Watch a full demonstration of the application, including the vulnerability exploit and an explanation of the security patch.

[![Watch the video](https://img.shields.io/badge/Watch-Video_Demo-red.svg)](https://youtu.be/h_ROTfXwC3M)

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

### 🛠️ Building from Source

If you want to run or modify the source code directly, you'll need to set up a Python environment.

1.  **Install Python:** If you don't have it, download and install Python from [python.org](https://www.python.org/).

2.  **Install Required Libraries:** Open your terminal or command prompt and run the following command:
    ```bash
    pip install ttkbootstrap cryptography
    ```
3.  **Run the Script:**
    ```bash
    python filecrypt.py
    ```

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
