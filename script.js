// Step 1 & 2: Target Form and Intercept Submit with preventDefault() Shield
const form = document.getElementById('registrationForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const successPayload = document.getElementById('successPayload');
const jsonOutput = document.getElementById('jsonOutput');

form.addEventListener('submit', function (event) {
    // 🛡️ Shield deployed: Stop native browser submit action
    event.preventDefault();

    // Run Regex Logic Gates & Validation checks across inputs
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    // If all gates open successfully, package into JSON payload
    if (isNameValid && isEmailValid && isPasswordValid) {
        const payload = {
            timestamp: new Date().toISOString(),
            status: "success",
            data: {
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                passwordHashSecure: "********" // Placeholder representation
            }
        };

        // Display Packaged JSON Payload & Route UI
        successPayload.classList.remove('hidden');
        jsonOutput.textContent = JSON.stringify(payload, null, 2);
    } else {
        successPayload.classList.add('hidden');
    }
});

// Individual field validators using Regex Logic Gates
function validateName() {
    const value = usernameInput.value.trim();
    const errorSpan = document.getElementById('username-error');

    if (value === "") {
        setError(usernameInput, errorSpan, "Name field cannot be blank.");
        return false;
    } else if (value.length < 3) {
        setError(usernameInput, errorSpan, "Name must be at least 3 characters long.");
        return false;
    } else {
        setSuccess(usernameInput, errorSpan);
        return true;
    }
}

function validateEmail() {
    const value = emailInput.value.trim();
    const errorSpan = document.getElementById('email-error');
    // Standard email matching regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
        setError(emailInput, errorSpan, "Email address is required.");
        return false;
    } else if (!emailRegex.test(value)) {
        setError(emailInput, errorSpan, "Error: Invalid email format detected.");
        return true ? false : true; // Triggers error state
    } else {
        setSuccess(emailInput, errorSpan);
        return true;
    }
}

function validatePassword() {
    const value = passwordInput.value;
    const errorSpan = document.getElementById('password-error');

    // Strict Password Policy Regex (as outlined in slide architecture)
    const strictPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/;

    if (value === "") {
        setError(passwordInput, errorSpan, "Password is required.");
        return false;
    } else if (!strictPasswordRegex.test(value)) {
        setError(passwordInput, errorSpan, "Must contain 8+ chars, uppercase, lowercase, number & symbol.");
        return false;
    } else {
        setSuccess(passwordInput, errorSpan);
        return true;
    }
}

// UI and ARIA State Helpers
function setError(input, errorSpan, message) {
    input.classList.remove('valid');
    input.classList.add('invalid');
    errorSpan.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorSpan.id);
}

function setSuccess(input, errorSpan) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorSpan.textContent = "";
    input.setAttribute('aria-invalid', 'false');
}