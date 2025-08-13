# Neural Network from Scratch using NumPy

### **Submission for the AI/ML Head Role**

This project is a demonstration of fundamental machine learning principles, building a complete, object-oriented neural network from the ground up using only Python and NumPy. The goal was to replicate the functionality of modern deep learning libraries like Keras or PyTorch to prove a deep understanding of the underlying mechanics.

The project successfully solves the MNIST handwritten digit classification task, achieving **95% accuracy** on the test set.

---

## Project Showcase Video

[![Project Showcase Video](https://img.youtube.com/vi/rgGrTdumuVs/0.jpg)](https://www.youtube.com/watch?v=rgGrTdumuVs)
---

## Success Criterion Checklist

This project was built to meet the four key success criteria outlined in the job description.

### ✅ 1. Build the Core Network (Single Script)

The initial phase involved creating a simple, single-script neural network to solve the classic XOR problem. This script established the core logic for forward and backward propagation and demonstrated the ability to solve a non-linear classification problem using only NumPy. This initial script can be provided upon request.

### ✅ 2. Create a Reusable Library

The core logic from the initial script was refactored into a clean, reusable, and object-oriented library named `pynnet.py`. This library mimics the structure of popular frameworks and includes:

* **`Sequential` Class:** A container to manage the model and its layers.
* **`DenseLayer` & `ActivationLayer`:** Modular, reusable building blocks for the network.
* **`.add()`, `.compile()`, and `.fit()` Methods:** A high-level API for building, configuring, and training the model, making the process intuitive and clean.

### ✅ 3. Demonstrate with a Real-World Problem

The `pynnet` library was used to build and train a neural network to classify handwritten digits from the famous **MNIST dataset**.

* **Problem:** Multi-class classification of 28x28 grayscale images into one of ten digit classes (0-9).
* **Architecture:** The model uses a `DenseLayer` with 128 neurons and a `Sigmoid` activation, followed by a final `DenseLayer` with 10 output neurons and a `Softmax` activation to produce a probability distribution.
* **Result:** The model successfully learns the patterns in the data and achieves **~95% accuracy** on unseen test images, proving the library's effectiveness and scalability.

### ✅ 4. Create a Project Showcase Video

A short (<\5 min) video was produced to explain the project. The video covers:
* The necessary learning path for building a neural network from scratch.
* A live demonstration of the `pynnet` library classifying MNIST digits.
* A discussion of potential future enhancements, such as adding new optimizers and layer types.

---

## How to Run This Project

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/twiswiz/numpy-neural-network
    cd numpy-neural-network
    ```

2.  **Prerequisites:**
    * Python 3.x
    * NumPy

3.  **File Structure:**
    * `main.ipynb`: A Jupyter Notebook containing the main script to load data, build, train, and evaluate the model.
    * `pynnet.py`: The core neural network library.
    * `*.ubyte` files: The MNIST dataset files.

4.  **Execute the Project:**
    * Open `main.ipynb` in a Jupyter Notebook environment.
    * Run all the cells in order. The notebook will create the library file, load the data, train the model, and print the final accuracy and predictions.

---

## Contact

Thank you for considering my application. I am eager to discuss my skills and this project further.

* **Sai Sushan Govardhanam**
* **se23ucse073@mhindrauniversity.edu.in**
