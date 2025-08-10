# Neural Network from Scratch with NumPy & Pandas

## Project Overview
This project demonstrates how to **design, implement, and train a neural network from scratch** using only NumPy and Pandas — without relying on frameworks like PyTorch or TensorFlow.

It was developed in three stages:
1. **Core Script** – Single-file feedforward neural network for classification.
2. **OOP Library** – Modular, PyTorch-like API with reusable components.
3. **Real-World Application** – Applied the library to datasets like Breast Cancer and MNIST.

The aim was to gain a **deep understanding of the internal workings of neural networks** — forward/backward propagation, gradient descent, activation functions, and more.

---

## Features
- Fully vectorized operations with NumPy
- Multiple activation functions (Sigmoid, ReLU, Softmax)
- Customizable network architecture
- Cross-Entropy and MSE loss functions
- Mini-batch training support
- Regularization options (Dropout, L2)

---


---

## Results – Breast Cancer Dataset
| Metric    | Class 0 | Class 1 | Macro Avg | Weighted Avg |
|-----------|---------|---------|-----------|--------------|
| Precision | 0.97    | 0.95    | 0.96      | 0.96         |
| Recall    | 0.91    | 0.99    | 0.95      | 0.96         |
| F1-Score  | 0.94    | 0.97    | 0.95      | 0.96         |
| Support   | 43      | 71      | —         | —            |

**Overall Accuracy:** 96%  
**Observation:** Model detects Class 1 slightly better than Class 0.  
**Improvement Ideas:** Adjust class weights or thresholds to balance recall.

---

## MNIST Dataset
- Input: 784 neurons (28×28 image flattened)
- Hidden Layers: 1–2 layers with ReLU activation
- Output: 10 neurons (Softmax for 0–9 digit classification)

_Replace with your MNIST accuracy & loss graphs here._

---

## How to Run
1. **Clone this repository:**
   ```bash
   git clone https://github.com/your-username/neural-network-from-scratch.git
   cd neural-network-from-scratch
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
3. **Run the Breast Cancer example:**
   ```bash
   python core_nn.py
4. **Run MNIST training:**
  ```bash
   python train_mnist.py

---

## Confusion matrix
<img width="501" height="393" alt="image" src="https://github.com/user-attachments/assets/cb9111f0-ff8f-4a7b-b564-652f14651d45" />


