// Toggle between login and signup forms
const tabs = document.querySelectorAll(".tab")
const toggleLinks = document.querySelectorAll(".toggle-form")
const forms = document.querySelectorAll(".form-box")

function switchForm(formId) {
  // Hide all forms
  forms.forEach((form) => {
    form.classList.remove("active")
  })

  // Show the selected form
  document.getElementById(formId).classList.add("active")

  // Update active tab
  tabs.forEach((tab) => {
    if (tab.dataset.form === formId) {
      tab.classList.add("active")
    } else {
      tab.classList.remove("active")
    }
  })
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchForm(tab.dataset.form)
  })
})

toggleLinks.forEach((link) => {
  link.addEventListener("click", () => {
    switchForm(link.dataset.form)
  })
})

// Custom popup functionality
const popup = document.getElementById("custom-popup")
const closePopup = document.querySelector(".close-popup")
const popupButton = document.getElementById("popup-button")
const popupTitle = document.getElementById("popup-title")
const popupMessage = document.getElementById("popup-message")

function showPopup(title, message, callback) {
  popupTitle.textContent = title
  popupMessage.textContent = message
  popup.style.display = "flex"

  // Set the callback for the popup button
  popupButton.onclick = () => {
    hidePopup()
    if (callback && typeof callback === "function") {
      callback()
    }
  }
}

function hidePopup() {
  popup.style.display = "none"
}

// Close popup when clicking the X button
closePopup.addEventListener("click", hidePopup)

// Close popup when clicking outside the popup content
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    hidePopup()
  }
})

// Function to handle login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const requestData = { email, password }

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || "Login failed. Please check your credentials.")
    }

    const responseData = await response.json() // Parse JSON response

    // Show success popup instead of alert
    showPopup("Login Successful", "You have successfully logged in!", () => {
      localStorage.setItem("email", responseData.email)
      localStorage.setItem("role", responseData.role)

      // Redirect based on role
      if (responseData.role === "hr") {
        window.location.href = "./hr/dashboard.html"
      } else if (responseData.role === "interviewer") {
        window.location.href = "./interviewer/dashboard.html"
      } else {
        showPopup("Error", "Unknown role. Please contact support.")
      }
    })
  } catch (error) {
    console.error("Login failed:", error)
    showPopup("Login Failed", error.message)
  }
})

// Function to handle signup
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("signup-name").value
  const email = document.getElementById("signup-email").value
  const role = document.getElementById("signup-role").value
  const password = document.getElementById("signup-password").value

  //email checking 
  const validateEmailDomain = (email) => {
    const allowedDomain = "@nucleusteq.com"
    return email.endsWith(allowedDomain) && email.length > allowedDomain.length
  }

  if (!validateEmailDomain(email)) {
    showPopup("Invalid Email", "Only @nucleausteq.com email addresses are allowed")
    return
  }

  const requestData = { name, email, role, password }

  try {
    const response = await fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    const responseData = await response.json() // Parse JSON response

    // Show success popup instead of alert
    showPopup("Registration Successful", "Your account has been created successfully!", () => {
      localStorage.setItem("email", responseData.email)
      localStorage.setItem("role", responseData.role)

      // Redirect based on role
      if (responseData.role === "hr") {
        window.location.href = "./hr/dashboard.html"
      } else if (responseData.role === "interviewer") {
        window.location.href = "./interviewer/dashboard.html"
      } else {
        showPopup("Error", "Unknown role. Please contact support.")
      }
    })
  } catch (error) {
    console.error("Signup failed:", error)
    showPopup("Registration Failed", "An error occurred while signing up. Please try again later.")
  }
})

