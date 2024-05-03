function validatePassword() {
    var newPassword = document.getElementById("newPassword").value;
    var confirmNewPassword = document.getElementById("confirmNewPassword").value;
    var errorMessage = document.querySelector('.error-message');

    if (newPassword !== confirmNewPassword) {
        errorMessage.textContent = "Password Doesn't match. Please try again.";
        errorMessage.style.display = "block";
        return false;
    } else {
        errorMessage.style.display = "none";
        return true;
    }
}