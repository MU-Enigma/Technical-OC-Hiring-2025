# Kind of like a context-manager for all gradient related things...
# More or less like a global gradient option, so when a Tensor is created, its requires_grad will default to whats set here

class GradMode:
    _enabled = True

    @classmethod
    def is_enabled(cls):
        return cls._enabled

    @classmethod
    def enable(cls):
        cls._enabled = True

    @classmethod
    def disable(cls):
        cls._enabled = False

    @classmethod
    def set(cls, mode: bool):
        cls._enabled = mode
