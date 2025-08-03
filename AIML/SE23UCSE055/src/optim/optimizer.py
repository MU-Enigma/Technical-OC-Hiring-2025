from ..tensor import Tensor

from abc import abstractmethod

class Optimizer:
    """Base optimizer class"""
    def __init__(self, params):
        if not isinstance(params, (tuple, list)) and not hasattr(params, "__iter__"):
            raise TypeError(f"Parameters must be an iterable with Tensors, got: {params.__class__.__name__}")
        self.param_groups: list[dict[str, Tensor]] = []
        
        # Torch inspired optimizer setup (see torch's implementation for better understanding)
        param_groups = list(params)
        if not param_groups or len(param_groups) == 0:
            raise ValueError(f"No parameters provided")
        if not isinstance(param_groups[0], dict):
            param_groups = [{"params": param_groups}]
        self.param_groups = param_groups

    def zero_grad(self, none: bool = False):
        for group in self.param_groups:
            for param in group["params"]:
                if param.grad is not None:
                    if none:
                        param.grad = None
                    else:
                        param.zero_grad()
    
    @abstractmethod
    def step(self):
        raise NotImplementedError(f"This is a base class, please use SGD or similar from optim")
