// Function to fetch interviewers and populate the dropdown
function populateInterviewers() {
  fetch("http://localhost:8080/api/users/getinterviewer")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((interviewers) => {
      const interviewerSelect = document.getElementById("interviewer")
      interviewers.forEach((interviewer) => {
        const option = document.createElement("option")
        option.value = interviewer.email // Use email as value
        option.textContent = interviewer.name // Display interviewer's name or email
        interviewerSelect.appendChild(option)
      })
    })
    .catch((error) => console.error("Error fetching interviewers:", error))
}

// Custom popup functionality
function showPopup(title, message, callback) {
  const popup = document.getElementById("custom-popup")
  const popupTitle = document.getElementById("popup-title")
  const popupMessage = document.getElementById("popup-message")
  const popupButton = document.getElementById("popup-button")

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
  const popup = document.getElementById("custom-popup")
  popup.style.display = "none"
}

document.addEventListener("DOMContentLoaded", () => {
  // Setup popup close button
  const closePopup = document.querySelector(".close-popup")
  closePopup.addEventListener("click", hidePopup)

  // Close popup when clicking outside the popup content
  const popup = document.getElementById("custom-popup")
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      hidePopup()
    }
  })

  function scheduleInterview() {
    const intervieweeName = document.getElementById("intervieweeName")
    const intervieweeEmail = document.getElementById("intervieweeEmail")
    const intervieweeResume = document.getElementById("intervieweeResume")
    const interviewer = document.getElementById("interviewer")
    const interviewDateTime = document.getElementById("interviewDateTime")
    const level = document.getElementById("level")

    if (
      !intervieweeName.value ||
      !intervieweeEmail.value ||
      !intervieweeResume.value ||
      !interviewer.value ||
      !interviewDateTime.value ||
      !level.value
    ) {
      showPopup("Missing Information", "Please fill in all the fields.")
      return
    }

    const scheduleData = {
      typeOfInterview: level.value,
      intervieweeEmail: intervieweeEmail.value,
      intervieweeName: intervieweeName.value,
      email: interviewer.value,
      resumeLink: intervieweeResume.value,
      interviewDate: interviewDateTime.value,
    }

    console.log(scheduleData)

    fetch("http://localhost:8080/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scheduleData),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        return response.json()
      })
      .then((data) => {
        console.log("Success:", data)
        showPopup("Success", "Interview scheduled successfully!", () => {
          // Clear form fields after successful scheduling
          intervieweeName.value = ""
          intervieweeEmail.value = ""
          intervieweeResume.value = ""
          interviewer.value = ""
          interviewDateTime.value = ""
          level.value = ""
        })
        sendEmail(interviewer.value, interviewDateTime.value)
      })
      .catch((error) => {
        console.error("Error:", error)
        showPopup("Error", "An error occurred. Please try again.")
      })
  }

  function sendEmail(email, dateTime) {

    emailjs.init("-ERYtWewRPd26lbez")
    emailjs
      .send("service_bczd6pb", "template_cydxr7w", {
        to_email: email,
        message: `Your interview is scheduled on ${dateTime}`,
      })
      .then((response) => console.log("Email sent successfully!", response))
      .catch((error) => console.error("Email sending failed:", error))
  }

  document.getElementById("scheduleBtn").addEventListener("click", scheduleInterview)
})

// Call populateInterviewers when the page loads
window.onload = populateInterviewers


// Update the logout function to be more secure
function logout() {
  // Clear all storage
  localStorage.clear()
  sessionStorage.clear()

  // Set a flag to indicate logout happened
  sessionStorage.setItem("loggedOut", "true")

  // Redirect to login page with cache-busting parameter
  window.location.replace("../index.html?logout=" + new Date().getTime())
}

// Add this function at the top of your JS file to check login status
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("email")
  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    window.location.replace("../index.html")
    return false
  }
  return true
}
// Update the window.onload function to check login status first
window.onload = () => {
  // Check if user is logged in before loading page content
  if (!checkLoginStatus()) return

  // Load page content only if logged in

  populateInterviewers()

  // Prevent back button after logout
  window.history.pushState(null, null, window.location.href)
  window.addEventListener("popstate", () => {
    window.history.pushState(null, null, window.location.href)
  })
}




