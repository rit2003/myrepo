
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

    loadCandidateInfo()
    populateSkillEvaluation()
    
    // Prevent back button after logout
    window.history.pushState(null, null, window.location.href)
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, window.location.href)
    })
  }
  

  