
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    login();
});

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Clear previous error messages
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');

    fetch("http://localhost:8080/api/hr/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid email or password");
            }
            return response.json();
        })
        .then(data => {
            // Store token or user data if needed
            // localStorage.setItem('token', data.token);
            window.location.href = "employee_dashboard.html";
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            errorMessage.classList.add('show');
        });
}