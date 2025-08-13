from ..tensor import Tensor

class Sequential:
    def __init__(self, *layers):
        self.layers = list(layers)

    def add(self, *layers):
        self.layers.extend(layers)

    def forward(self, x: Tensor):
        for layer in self.layers:
            x = layer.forward(x)
        return x
    
    def parameters(self):
        for layer in self.layers:
            yield from layer.parameters()
        
    def __call__(self, x):
        return self.forward(x)