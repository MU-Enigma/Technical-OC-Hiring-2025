import numpy as np

from .optimizer import Optimizer

class SGD(Optimizer):
    """Simple SGD, no momentum, and all those fancy things."""
    def __init__(self,
                 params: list,
                 lr: float):
        super().__init__(params)
        self._lr = lr

    def step(self):
        for group in self.param_groups:
            for param in group["params"]:
                if param.grad is not None:
                    param.data -= self.lr * param.grad
    
    @property
    def lr(self):
        return self._lr