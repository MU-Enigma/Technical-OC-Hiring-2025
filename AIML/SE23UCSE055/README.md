# Neural Network library using NumPy!

![Made with NumPy](https://img.shields.io/badge/Made%20with-NumPy-013243?logo=numpy&logoColor=white)
![Build](https://img.shields.io/badge/build-stable-brightgreen)
![Demo](https://img.shields.io/badge/demo-available-blueviolet)
![Platform](https://img.shields.io/badge/platform-jupyter-orange)

A minimal deep learning library inspired by PyTorch, written entirely from scratch using **NumPy**.\
It supports dynamic compute graph construction and basic neural network modules — no autograd libraries, no PyTorch backend, just raw NumPy.

---

## Quick Start

- Run the main demo: [`demos/demo.ipynb`](./demos/demo.ipynb)
- Watch the video walkthrough: [`demos/demo_video.ipynb`](./demos/demo_video.ipynb)

> **Note**: You’ll need to install *Jupyter* and *Matplotlib* manually — it’s not included in the `requirements.txt`.

> `requirements.txt`: This file is generated for `src/`, not for `demos/`

---

## Dataset

The dataset is placed in `./demos/data/` and includes:
- `train.csv`
- `test.csv`\
Each CSV contains **flattened MNIST images** (no external loading libraries like `pandas` used — just pure NumPy).

---

## Core Framework

All source code lives in the `src/` directory.

- `tensor.py`: Core `Tensor` class — handles all tensor ops and compute graph tracking
- `nn/`: Neural network layers and activations (`Linear`, `Sequential`, `ReLU`, etc.)
- `optim/`: Basic optimizer implementation (`SGD`)

The architecture mirrors PyTorch (in spirit), but simplified.

---

## Demo Video

[![Watch on YouTube](https://img.youtube.com/vi/ZfOjHAf6IfA/hqdefault.jpg)](https://youtu.be/ZfOjHAf6IfA)

Small 5min video going over the project, its a good starting point if you want to understand the overall structure of the project and some of its inner-workings.

---

## Inspiration

This repo is inspired by [PureTorch](https://github.com/Dristro/PureTorch), a minimal NN framework I previously built.\
This project builds upon those ideas with improvements in code structure, optimization, and readability.

---

## Contributing

If you’re interested in experimenting or building on top of it, feel free to reach out.

---
