// Helper functions to select elements
let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);

// Get form and input elements
let form = id("form");
let fullname = id("fullname");
let email = id("email");
let password = id("password");
let confirmPassword = id("confirmPassword");
let terms = id("terms");
let btn = id("btn");

// Get error message and icon elements
let errorMsg = classes("error");
let successIcon = classes("success-icon");
let failureIcon = classes("failure-icon");

// Password strength elements
let strengthBar = document.querySelector('.strength-bar');
let strengthText = document.querySelector('.strength-text span');
let passwordRequirements = document.querySelectorAll('.password-requirements p i');

// Modal elements
let successModal = id("success-modal");
let emailModal = id("email-modal");
let userEmailSpan = id("user-email");
let userNameSpan = id("user-name");
let userEmailDisplay = id("user-email-display");
let viewProfileBtn = id("view-profile");
let sendEmailBtn = id("send-email");
let closeModalBtns = document.querySelectorAll('.close-modal');
let loginLink = id("login-link");

// Password requirements check
const requirements = [
    { regex: /.{8,}/, index: 0 },        // At least 8 characters
    { regex: /[A-Z]/, index: 1 },       // Uppercase letter
    { regex: /[a-z]/, index: 2 },       // Lowercase letter
    { regex: /[0-9]/, index: 3 },       // Number
    { regex: /[^A-Za-z0-9]/, index: 4 } // Special character
];

// Email validation function
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Check password strength
function checkPasswordStrength(pass) {
    let score = 0;
    
    // Check each requirement
    requirements.forEach(req => {
        if (req.regex.test(pass)) {
            score++;
            passwordRequirements[req.index].className = 'fas fa-check';
        } else {
            passwordRequirements[req.index].className = 'fas fa-times';
        }
    });
    
    // Update strength bar width and color
    let percentage = (score / 5) * 100;
    strengthBar.style.width = percentage + '%';
    
    // Update color and text based on score
    if (score <= 1) {
        strengthBar.style.background = '#e74c3c'; // Red
        strengthText.textContent = 'Very Weak';
    } else if (score === 2) {
        strengthBar.style.background = '#e67e22'; // Orange
        strengthText.textContent = 'Weak';
    } else if (score === 3) {
        strengthBar.style.background = '#f1c40f'; // Yellow
        strengthText.textContent = 'Medium';
    } else if (score === 4) {
        strengthBar.style.background = '#2ecc71'; // Light green
        strengthText.textContent = 'Strong';
    } else {
        strengthBar.style.background = '#27ae60'; // Dark green
        strengthText.textContent = 'Very Strong';
    }
    
    return score;
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('✅ User data saved:', userData);
}

// Send email confirmation (simulated)
function sendEmailConfirmation(email, username) {
    console.log(`📧 Email sent to: ${email}`);
    console.log(`👤 Username: ${username}`);
    
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('✅ Email sent successfully!');
            resolve(true);
        }, 1000);
    });
}

// Show success modal
function showSuccessModal(name, email) {
    userNameSpan.textContent = name;
    userEmailSpan.textContent = email;
    successModal.style.display = 'flex';
}

// Show email modal
function showEmailModal(email) {
    userEmailDisplay.textContent = email;
    emailModal.style.display = 'flex';
}

// Form validation engine
let engine = (id, serial, message, validationFn = null) => {
    let isValid = true;
    let value = id.value.trim();
    
    if (validationFn) {
        isValid = validationFn(value);
    } else {
        isValid = value !== "";
    }
    
    if (!isValid) {
        errorMsg[serial].innerHTML = message;
        id.style.border = "2px solid #e74c3c";
        if (failureIcon[serial]) failureIcon[serial].style.opacity = "1";
        if (successIcon[serial]) successIcon[serial].style.opacity = "0";
        return false;
    } else {
        errorMsg[serial].innerHTML = "";
        id.style.border = "2px solid #2ecc71";
        if (failureIcon[serial]) failureIcon[serial].style.opacity = "0";
        if (successIcon[serial]) successIcon[serial].style.opacity = "1";
        return true;
    }
};

// REAL-TIME VALIDATION

// Full name validation
fullname.addEventListener('input', () => {
    if (fullname.value.length > 0) {
        engine(fullname, 0, "Name must be at least 2 characters",
            (val) => val.length >= 2);
    } else {
        errorMsg[0].innerHTML = "";
        fullname.style.border = "2px solid #e0e0e0";
        if (failureIcon[0]) failureIcon[0].style.opacity = "0";
        if (successIcon[0]) successIcon[0].style.opacity = "0";
    }
});

// Email validation
email.addEventListener('input', () => {
    if (email.value.length > 0) {
        engine(email, 1, "Please enter a valid email address", isValidEmail);
    } else {
        errorMsg[1].innerHTML = "";
        email.style.border = "2px solid #e0e0e0";
        if (failureIcon[1]) failureIcon[1].style.opacity = "0";
        if (successIcon[1]) successIcon[1].style.opacity = "0";
    }
});

// Password strength and validation
password.addEventListener('input', () => {
    let pass = password.value;
    
    if (pass.length > 0) {
        let strengthScore = checkPasswordStrength(pass);
        
        // Only show error if password is too weak
        if (strengthScore < 3) {
            errorMsg[2].innerHTML = "Password must meet at least 3 requirements";
            password.style.border = "2px solid #e74c3c";
        } else {
            errorMsg[2].innerHTML = "";
            password.style.border = "2px solid #2ecc71";
        }
            
        // Check confirm password if it has value
        if (confirmPassword.value.length > 0) {
            engine(confirmPassword, 3, "Passwords do not match",
                (val) => val === password.value);
        }
    } else {
        // Reset strength indicator
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Weak';
        passwordRequirements.forEach(icon => {
            icon.className = 'fas fa-times';
        });
        
        // Reset validation
        errorMsg[2].innerHTML = "";
        password.style.border = "2px solid #e0e0e0";
    }
});

// Confirm password validation
confirmPassword.addEventListener('input', () => {
    if (confirmPassword.value.length > 0) {
        engine(confirmPassword, 3, "Passwords do not match",
            (val) => val === password.value);
    } else {
        errorMsg[3].innerHTML = "";
        confirmPassword.style.border = "2px solid #e0e0e0";
        if (failureIcon[3]) failureIcon[3].style.opacity = "0";
        if (successIcon[3]) successIcon[3].style.opacity = "0";
    }
});

// FORM SUBMIT HANDLER
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate all fields
    isValid &= engine(fullname, 0, "Full name is required", 
        (val) => val.length >= 2);
    
    isValid &= engine(email, 1, "Valid email is required", isValidEmail);
    
    // Password validation (at least 3 requirements)
    let passwordScore = checkPasswordStrength(password.value);
    if (passwordScore < 3) {
        errorMsg[2].innerHTML = "Password must meet at least 3 requirements";
        password.style.border = "2px solid #e74c3c";
        isValid = false;
    } else {
        errorMsg[2].innerHTML = "";
        password.style.border = "2px solid #2ecc71";
    }
    
    isValid &= engine(confirmPassword, 3, "Passwords must match",
        (val) => val === password.value);
    
    // Validate terms checkbox
    if (!terms.checked) {
        errorMsg[4].innerHTML = "You must accept the terms & conditions";
        isValid = false;
    } else {
        errorMsg[4].innerHTML = "";
    }
    
    if (isValid) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        const userData = {
            fullname: fullname.value.trim(),
            email: email.value.trim(),
            password: password.value,
            registeredAt: new Date().toISOString(),
            status: 'pending_confirmation',
            confirmed: false,
            lastLogin: new Date().toISOString()
        };
        
        try {
            saveUserData(userData);
            await sendEmailConfirmation(userData.email, userData.fullname);
            showSuccessModal(userData.fullname, userData.email);
            
            form.reset();
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Weak';
            passwordRequirements.forEach(icon => {
                icon.className = 'fas fa-times';
            });
            
            [fullname, email, password, confirmPassword].forEach((input, index) => {
                input.style.border = "2px solid #e0e0e0";
                if (failureIcon[index]) failureIcon[index].style.opacity = "0";
                if (successIcon[index]) successIcon[index].style.opacity = "0";
                if (errorMsg[index]) errorMsg[index].innerHTML = "";
            });
            
            errorMsg[4].innerHTML = "";
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            errorMsg[4].innerHTML = "Registration failed. Please try again.";
        } finally {
            btn.disabled = false;
            btn.textContent = 'Register Now';
        }
    }
});

// EMAIL FUNCTIONS

function sendMail() {
    const savedData = localStorage.getItem('userData');
    if (!savedData) {
        alert('No user data found! Please register first.');
        return;
    }
    
    const userData = JSON.parse(savedData);
    const username = userData.fullname;
    const email = userData.email;
    
    const subject = "Welcome to Our Platform - Confirm Your Email";
    const body = `
Dear ${username},

Thank you for registering with us!

Please confirm your email address by clicking the link below:
https://yourapp.com/confirm-email?token=${Date.now()}&email=${encodeURIComponent(email)}

Your registration details:
- Username: ${username}
- Email: ${email}
- Registration Date: ${new Date().toLocaleDateString()}

If you didn't create an account, please ignore this email.

Best regards,
The Team
    `.trim();
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function resendEmail() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        
        const resendBtn = document.querySelector('.btn-secondary');
        const originalText = resendBtn.innerHTML;
        resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        resendBtn.disabled = true;
        
        setTimeout(() => {
            alert(`Confirmation email has been resent to ${userData.email}`);
            resendBtn.innerHTML = originalText;
            resendBtn.disabled = false;
        }, 1500);
    }
}

// MODAL HANDLERS

viewProfileBtn.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        successModal.style.display = 'none';
        emailModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === successModal) successModal.style.display = 'none';
    if (e.target === emailModal) emailModal.style.display = 'none';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Login functionality would go here!');
});

// Load saved data on page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        console.log('Previously saved user:', JSON.parse(savedData));
    }
});