// Toggle between login and signup forms
const tabs = document.querySelectorAll('.tab');
const toggleLinks = document.querySelectorAll('.toggle-form');
const forms = document.querySelectorAll('.form-box');

function switchForm(formId) {
    // Hide all forms
    forms.forEach(form => {
        form.classList.remove('active');
    });

    // Show the selected form
    document.getElementById(formId).classList.add('active');

    // Update active tab
    tabs.forEach(tab => {
        if (tab.dataset.form === formId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchForm(tab.dataset.form);
    });
});

toggleLinks.forEach(link => {
    link.addEventListener('click', () => {
        switchForm(link.dataset.form);
    });
});

// Function to handle login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const requestData = { email, password };

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Login failed. Please check your credentials.");
        }

        const responseData = await response.json(); // Parse JSON response

        alert("Login successful!");
        localStorage.setItem("email", responseData.email);
        localStorage.setItem("role", responseData.role);

        // Redirect based on role
        if (responseData.role === "hr") {
            window.location.href = "./hr/dashboard.html";
        } else if (responseData.role === "interviewer") {
            window.location.href = "./interviewer/dashboard.html";
        } else {
            alert("Unknown role. Please contact support.");
        }

    } catch (error) {
        console.error("Login failed:", error);
        alert(error.message);
    }
});

// Function to handle signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const role = document.getElementById('signup-role').value;
    const password = document.getElementById('signup-password').value;
    const validateEmailDomain = (email) => {
        const allowedDomain = "@nucleausteq.com"
        return email.endsWith(allowedDomain) && email.length > allowedDomain.length
      }
      if (!validateEmailDomain(email)) {
        alert("Only @nucleausteq.com email addresses are allowed")
        return
      }
    const requestData = { name, email, role, password };

    try {
        const response = await fetch("http://localhost:8080/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json(); // Parse JSON response

        alert("SignUp successful!");
        localStorage.setItem("email", responseData.email);
        localStorage.setItem("role", responseData.role);

        // Redirect based on role
        if (responseData.role === "hr") {
            window.location.href = "./hr/dashboard.html";
        } else if (responseData.role === "interviewer") {
            window.location.href = "./interviewer/dashboard.html";
        } else {
            alert("Unknown role. Please contact support.");
        }
    } catch (error) {
        console.error("Signup failed:", error);
        alert("An error occurred while signing up. Please try again later.");
    }
});
