import numpy as np
from typing import Union

class Tensor:
    def __init__(self,
                 data: Union[int, float, list, np.ndarray, "Tensor"],
                 requires_grad: bool = False,
                 _operand: str = "",
                 _children: tuple = ()):
        """
        Args:
            data: data in tensor instance
            requires_grad: grad-tracking true/false
            _operand: internal, used for tracking operations that lead to tensor (for compute-graph)
            _children: internal, used for creating compute-graph (for gradient operations, like: backward)
        """
        self.data = data.data if isinstance(data, Tensor) else np.array(data)
        self._prev = set(_children)
        self._operand = _operand
        self.requires_grad = requires_grad
        self.grad = np.zeros_like(self.data, dtype=float)
        self._backward = lambda: None

    # Math functions (for all tensor operations)

    def __add__(self, other: Union[int, float, list, np.ndarray, "Tensor"]):
        other = other if isinstance(other, Tensor) else Tensor(data=other)
        out = Tensor(
            data = self.data + other.data,
            requires_grad=self.requires_grad or other.requires_grad,
            _operand = "+",
            _children = (self, other),
        )
        
        def _backward():
            grad = out.grad
            if self.requires_grad:
                grad_self = grad
                while grad_self.ndim > self.data.ndim:
                    grad_self = grad_self.sum(axis=0)
                for i, (s1, s2) in enumerate(zip(grad_self.shape, self.data.shape)):
                    if s1 != s2:
                        grad_self = grad_self.sum(axis=i, keepdims=True)
                self.grad += grad_self

            if other.requires_grad:
                grad_other = grad
                while grad_other.ndim > other.data.ndim:
                    grad_other = grad_other.sum(axis=0)
                for i, (s1, s2) in enumerate(zip(grad_other.shape, other.data.shape)):
                    if s1 != s2:
                        grad_other = grad_other.sum(axis=i, keepdims=True)
                other.grad += grad_other

        out._backward = _backward
        return out
    
    def __radd__(self, other):
        return self + other

    def __mul__(self, other: Union[int, float, list, np.ndarray, "Tensor"]):
        other = other if isinstance(other, Tensor) else Tensor(data=other)
        out = Tensor(
            data=self.data * other.data,
            requires_grad=self.requires_grad or other.requires_grad,
            _operand="*",
            _children=(self, other)
        )
        
        def _backward():
            if self.requires_grad:
                self.grad += out.grad * other.data
            if other.requires_grad:
                other.grad += out.grad * self.data
        
        out._backward = _backward
        return out
    
    def __rmul__(self, other):
        return self * other
    
    def __matmul__(self, other: Union[int, float, list, np.ndarray, "Tensor"]):
        other = other if isinstance(other, Tensor) else Tensor(data=other)
        #print(f"[DEBUG @ tensor.__matmul__] self.shape: {self.shape} | other.shape: {other.shape}")
        out = Tensor(
            data=self.data @ other.data,
            requires_grad=self.requires_grad or other.requires_grad,
            _operand="@",
            _children=(self, other),
        )

        # IGNORE, deriving the logic (remove when working)
        # say, self: [T, C] | other: [C, T']
        # then, self @ other = [T, T'] | out.grad: [T, T']
        # so self.grad -> out.grad[T, T'], other.data[C, T'].transpose
        # so other.grad -> self.data[T, C].transpose, out.grad[T, T']
        
        def _backward():
            if self.requires_grad:
                self.grad += out.grad @ other.data.T
            if other.requires_grad:
                other.grad += self.data.T @ out.grad
        
        out._backward = _backward
        return out
    
    def exp(self):
        out = Tensor(
            data=np.exp(self.data),
            requires_grad=self.requires_grad,
            _children=(self,),
            _operand="exp",
        )

        def _backward():
            if self.requires_grad:
                self.grad += np.exp(self.data) * out.grad

        out._backward = _backward
        return out
    
    def __pow__(self, other: int | float):
        base = self.data.astype(float) if np.issubdtype(self.data.dtype, np.integer) else self.data
        out = Tensor(
            data=base ** (other),
            _children=(self,),
            _operand=f"**{other}",
            requires_grad=self.requires_grad,
        )

        def _backward():
            if self.requires_grad:
                self.grad += (other * base ** (other - 1)) * out.grad
            else:
                self.grad += out.grad

        out._backward = _backward
        return out

    def __truediv__(self, other):
        other_tensor = other if isinstance(other, Tensor) else Tensor(other)
        out = Tensor(
            data=self.data / other_tensor.data,
            requires_grad=self.requires_grad or other_tensor.requires_grad,
            _children=(self, other_tensor),
            _operand="/",
        )

        def _backward():
            if self.requires_grad:
                self.grad += out.grad / other_tensor.data

            if other_tensor.requires_grad:
                grad_other = -self.data / (other_tensor.data ** 2) * out.grad
                
                while grad_other.ndim > other_tensor.data.ndim:
                    grad_other = grad_other.sum(axis=0)
                for i, (s1, s2) in enumerate(zip(grad_other.shape, other_tensor.data.shape)):
                    if s1 != s2:
                        grad_other = grad_other.sum(axis=i, keepdims=True)

                other_tensor.grad += grad_other

        out._backward = _backward
        return out
    
    def __rtruediv__(self, other):
        return (self ** -1) * other
    
    def __neg__(self):
        return self * -1
    
    def __sub__(self, other):
        return self + (-other)

    def __rsub__(self, other):
        return -(self - other)
    
    def log(self):
        out = Tensor(
            data=np.log(self.data),
            requires_grad=self.requires_grad,
            _operand="log",
            _children=(self,),
        )

        def _backward():
            if self.requires_grad:
                self.grad += (1 / self.data) * out.grad

        out._backward = _backward
        return out

    def sum(self, axis=None, keepdims=False):
        out = Tensor(
            data=self.data.sum(axis=axis, keepdims=keepdims),
            requires_grad=self.requires_grad,
            _operand="sum",
            _children=(self,),
        )

        def _backward():
            if self.requires_grad:
                grad = out.grad  # broadcast grad to the shape of the original tensor
                if axis is not None and not keepdims:
                    grad = np.expand_dims(grad, axis=axis)
                self.grad += np.ones_like(self.data) * grad

        out._backward = _backward
        return out

    @property
    def T(self):
        """transpose"""
        out = Tensor(
            data=self.data.T,
            requires_grad=self.requires_grad,
            _children=(self,),  # keep that ',' causing errors otherwise (found out the hard way, lol)
            _operand="T",
        )
        
        def _backward():
            if self.requires_grad:
                self.grad += out.grad.T
        
        out._backward = _backward
        return out
    
    # Backward function for all tensor-instances

    def backward(self):
        """
        Builds compute graph and computes the gradients.
        Compute graph is built using topo sort, then gradients are found using Tensor's ._backward
        """
        graph = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                graph.append(v)
        build_topo(self)

        # Init statrting gradient
        self.grad = np.ones_like(self.data) if self.data.ndim > 0 else np.array(1.0)
        # Continue gradient flow from CG
        for tensor in reversed(graph):
            if tensor.requires_grad:
                #print(f"[DEBUG tensor.backward] tensor: {tensor._operand}, shape: {tensor.shape}, grad: {tensor.grad}")
                tensor._backward()

    # Other important stuff

    def relu(self):
        out_data = np.maximum(0, self.data)
        out = Tensor(
            data=out_data,
            requires_grad=self.requires_grad,
            _operand="ReLU",
            _children=(self,)
        )

        def _backward():
            if self.requires_grad:
                grad_input = (self.data > 0).astype(float) * out.grad
                self.grad += grad_input

        out._backward = _backward
        return out

    # Will be used later for NN optimization
    def zero_grad(self):
        if self.requires_grad:
            self.grad = np.zeros_like(self.data)

    @property
    def ndim(self):
        return self.data.ndim
    @property
    def shape(self):
        return self.data.shape
    def __repr__(self):
        return f"tensor({self.data}, requires_grad={self.requires_grad})"
