// Validate the registration form
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('registration-error');

        if (passwordInput.value.length < 8) {
            event.preventDefault(); // Prevent form submission
            errorMessage.textContent = 'Password must be at least 8 characters long.';
        }
    });
}

// Validate the login form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('login-error');

        if (usernameInput.value === '' || passwordInput.value === '') {
            event.preventDefault(); // Prevent form submission
            errorMessage.textContent = 'Username and password are required.';
        }
    });
}
