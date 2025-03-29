document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const countryCodeSelect = document.getElementById("country-code");
    const mobileInput = document.getElementById("mobile_number");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const passwordError = document.getElementById("password-error");
    const passwordRequirements = document.getElementById("password-requirements");

    // ✅ Update mobile number field when country is selected
    countryCodeSelect.addEventListener("change", function () {
        mobileInput.value = this.value + " "; // Set default country code
        mobileInput.focus();
    });

    // ✅ Password strength validation function
    function validatePassword(password) {
        const minLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@#$%^&*!]/.test(password);

        let errors = [];
        if (!minLength) errors.push("- At least 8 characters long");
        if (!hasNumber) errors.push("- At least 1 number (0-9)");
        if (!hasSpecialChar) errors.push("- At least 1 special character (@, #, $, etc.)");

        if (errors.length > 0) {
            passwordRequirements.style.display = "block";
            passwordRequirements.innerHTML = errors.join("<br>");
            return false;
        } else {
            passwordRequirements.style.display = "none";
            return true;
        }
    }

    // ✅ Check password strength in real-time
    passwordInput.addEventListener("input", function () {
        validatePassword(passwordInput.value);
    });

    // ✅ Check if passwords match in real-time
    confirmPasswordInput.addEventListener("input", function () {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordError.style.display = "block";
        } else {
            passwordError.style.display = "none";
        }
    });

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        // ✅ Validate password before submission
        if (!validatePassword(passwordInput.value)) {
            alert("Please enter a valid password that meets all requirements.");
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Passwords do not match!");
            return;
        }

        const userData = {
            name: document.getElementById("fullname").value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            age: document.getElementById("age").value,
            mobile_number: mobileInput.value,
            email: document.getElementById("email").value,
            username: document.getElementById("username").value,
            password: passwordInput.value
        };

        console.log("📤 Sending data:", userData);

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            console.log("✅ Response:", result);

            if (response.ok) {
                alert(result.message);
                setTimeout(() => {
                    window.location.href = "loginpage.html";
                }, 100);
            } else {
                alert(result.message || "Signup failed!");
            }
        } catch (error) {
            console.error("❌ Error signing up:", error);
            alert("Failed to sign up. Try again!");
        }
    });
});
