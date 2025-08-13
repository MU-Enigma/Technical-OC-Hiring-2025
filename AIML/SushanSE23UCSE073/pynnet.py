import numpy as np

class Layer:
    def __init__(self):
        self.input = None
        self.output = None

    def forward(self, input):
        raise NotImplementedError

    def backward(self, output_gradient, learning_rate):
        raise NotImplementedError

class DenseLayer(Layer):
    def __init__(self, input_size, output_size):
        super().__init__()
        self.weights = np.random.randn(input_size, output_size) * 0.1
        self.bias = np.zeros((1, output_size))

    def forward(self, input_data):
        self.input = input_data
        self.output = np.dot(self.input, self.weights) + self.bias
        return self.output

    def backward(self, output_gradient, learning_rate):
        weights_gradient = np.dot(self.input.T, output_gradient)
        input_gradient = np.dot(output_gradient, self.weights.T)
        
        self.weights -= learning_rate * weights_gradient
        self.bias -= learning_rate * np.sum(output_gradient, axis=0)
        
        return input_gradient

class ActivationLayer(Layer):
    def __init__(self, activation, activation_prime):
        super().__init__()
        self.activation = activation
        self.activation_prime = activation_prime

    def forward(self, input_data):
        self.input = input_data
        self.output = self.activation(self.input)
        return self.output

    def backward(self, output_gradient, learning_rate):
        if self.activation_prime is None:
            return output_gradient
        return output_gradient * self.activation_prime(self.input)

#activation and loss functions
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_prime(x):
    s = sigmoid(x)
    return s * (1 - s)

def softmax(x):
    exps = np.exp(x - np.max(x, axis=1, keepdims=True))
    return exps / np.sum(exps, axis=1, keepdims=True)

def categorical_cross_entropy(y_true, y_pred):
    y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)
    return -np.sum(y_true * np.log(y_pred)) / len(y_true)

def categorical_cross_entropy_prime(y_true, y_pred):
    return y_pred - y_true

#the sequential model
class Sequential:
    def __init__(self):
        self.layers = []
        self.loss = None
        self.loss_prime = None

    def add(self, layer):
        self.layers.append(layer)

    def compile(self, loss, loss_prime, learning_rate):
        self.loss = loss
        self.loss_prime = loss_prime
        self.learning_rate = learning_rate

    def fit(self, x_train, y_train, epochs):
        for i in range(epochs):
            total_loss = 0
            for j, x in enumerate(x_train):
                output = x.reshape(1, -1)

                for layer in self.layers:
                    output = layer.forward(output)
                
                total_loss += self.loss(y_train[j], output)

                gradient = self.loss_prime(y_train[j], output)
                for layer in reversed(self.layers):
                    gradient = layer.backward(gradient, self.learning_rate)
            
            avg_loss = total_loss / len(x_train)
            if i % 10 == 0 or i == epochs -1:
                print(f"Epoch {i+1}/{epochs}, Loss: {avg_loss:.5f}")

    def predict(self, input_data):
        samples = len(input_data)
        result = []
        for i in range(samples):
            output = input_data[i].reshape(1, -1)
            for layer in self.layers:
                output = layer.forward(output)
            result.append(output)
        return result
