import numpy as np

from ..tensor import Tensor

class Linear:
    def __init__(self,
                 in_features: int,
                 out_features: int,
                 bias: bool = False):
        self._in_features = in_features
        self._out_features = out_features

        # Init the weights and bias (both normalized using np)
        _weights = np.random.randn(in_features, out_features) * (1 / np.sqrt(in_features))
        _bias = np.random.randn(out_features) * 0.01 if bias else None
        
        self.weights = Tensor(data=_weights, requires_grad=True)
        self.bias = Tensor(data=_bias, requires_grad=True) if _bias is not None else None

    def forward(self, x: Tensor):
        assert x.shape[-1] == self._in_features, (
            f"Shape mismatch. Got x: {x.shape}, "
            f"x.shape[-1] = {x.shape[-1]}, but expected {self._in_features}"
        )
        out = x @ self.weights
        out = out + self.bias if self.bias is not None else out
        return out
    
    def parameters(self):
        yield self.weights
        if self.bias is not None:
            yield self.bias
        
    def __call__(self, x: Tensor):
        return self.forward(x)