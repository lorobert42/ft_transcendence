export function printMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    const messageToast = document.getElementById("messageToast");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(messageToast);
    toastBootstrap.show();
}

export function printError(message) {
    const errorMessageDiv = document.getElementById("errorMessage");
    errorMessageDiv.textContent = message;
    const errorToast = document.getElementById("errorToast");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
    toastBootstrap.show();
}

export function printSuccess(message) {
    const successMessageDiv = document.getElementById("successMessage");
    successMessageDiv.textContent = message;
    const successToast = document.getElementById("successToast");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(successToast);
    toastBootstrap.show();
}