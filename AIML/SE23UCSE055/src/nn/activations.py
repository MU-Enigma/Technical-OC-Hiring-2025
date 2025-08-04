from ..tensor import Tensor

class ReLU:
    def forward(self, x: Tensor):
        return x.relu()

    def __call__(self, x: Tensor):
        return self.forward(x)
    
    def parameters(self):
        return []
