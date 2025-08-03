import numpy as np
from typing import Union

from ..tensor import Tensor

def cross_entropy_loss(logits: Tensor, targets: Union[np.ndarray, Tensor]):
    if isinstance(targets, Tensor):
        targets = targets.data
    targets = np.array(targets, dtype=int)

    B = logits.shape[0]
    
    # log_probs is a tensor that is a child of the logits tensor and its operations  | FIX: GEMINI
    log_probs = (logits - logits.data.max(axis=-1, keepdims=True)).exp()
    log_probs = log_probs / log_probs.sum(axis=-1, keepdims=True)
    log_probs = log_probs.log()  # shape: [B, C]

    # Create a tensor for the indexed data with a manual backward function
    out_data = log_probs.data[np.arange(B), targets]
    correct_log_probs = Tensor(
        data=out_data,
        requires_grad=log_probs.requires_grad,
        _operand="gather_indices",
        _children=(log_probs,)
    )

    def _backward():
        if log_probs.requires_grad:
            grad_to_parent = np.zeros_like(log_probs.grad)
            grad_to_parent[np.arange(B), targets] += correct_log_probs.grad
            log_probs.grad += grad_to_parent

    correct_log_probs._backward = _backward
    return -correct_log_probs.sum() / B

def softmax(logits: Tensor):
    exps = (logits - logits.data.max(axis=-1, keepdims=True)).exp()
    return exps / exps.sum(axis=-1, keepdims=True)
