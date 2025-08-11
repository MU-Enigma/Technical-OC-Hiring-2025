⁠ `markdown
# NumPy Neural Network from Scratch — Breast Cancer & MNIST

This repository contains a **pure NumPy implementation** of a small neural network framework and end-to-end demos on:

- **Breast Cancer Wisconsin Dataset** (binary classification)
- **MNIST Handwritten Digit Dataset** (multi-class classification, softmax output)
- **Custom Learning Rate Decay Scheduler**
- Training/Validation/Test splits without data leakage
- Optional **visualizations**: loss curves, confusion matrix, per-class metrics

## Features

- **From-scratch neural network library** (no TensorFlow/PyTorch)
- Modular `Sequential` + `Dense` layers
- Activation functions: ReLU, Sigmoid, Softmax
- Loss functions: Binary Cross-Entropy, Categorical Cross-Entropy
- Optimizers: SGD, SGD with Weight Decay & Learning Rate Decay
- Early stopping support
- Data preprocessing helpers (standardization, one-hot encoding, flattening)
- Works entirely in **Google Colab** or any Python 3 environment

---


## Getting Started

### Clone the repo

 ⁠bash
git clone https://github.com/yourusername/numpy-nn-breast-mnist.git
cd numpy-nn-breast-mnist


⁠ ### install dependencies

This project only uses:

 ⁠bash
pip install numpy pandas scikit-learn matplotlib tensorflow


> **Note:** TensorFlow is only used for loading MNIST data — the model itself is pure NumPy.

### Run in Google Colab

* Upload `notebook.ipynb` to Colab
* Run cells **in order** (Cells 1 → 6)
* For MNIST: The merged training cell automatically handles validation split and LR decay.

---

## Datasets

### Breast Cancer (binary classification)

* 30 features (real-valued)
* Labels: Malignant (0) / Benign (1)
* Standardized using **train split mean/std** (no leakage)

### MNIST (multi-class)

* 28×28 grayscale images
* Flattened to vectors of length 784
* Pixel values scaled to **\[0,1]**

---

## Example Results

**Breast Cancer**


Test Accuracy: ~97%


**MNIST**


Test Accuracy: ~96% (with LR decay)


---

## Visualizations

This repo can generate:

* **Loss curves** (train vs. validation)
* **Learning rate schedule**
* **Confusion matrix** (counts & normalized)
* **Per-class metrics** (precision, recall, F1)
* **Misclassified examples** preview

Example (MNIST Loss Curve):

![Loss Curve](images/mnist_loss_curve.png)

---

## How It Works

* **Forward pass**: Compute layer activations
* **Loss computation**: Compare predictions with ground truth
* **Backward pass**: Compute gradients via chain rule
* **Optimizer step**: Update parameters (optionally with weight decay / LR schedule)

---

## Documentation

A **full beginner-friendly explanation** of every line of code is available here:
[📄 numpy\_nn\_breast\_mnist\_documentation.md](numpy_nn_breast_mnist_documentation.md)

---

## Future Improvements

* Add convolutional layers
* Implement Adam optimizer
* Add dropout & batch normalization
* Support custom dataset loading

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.


---

```
