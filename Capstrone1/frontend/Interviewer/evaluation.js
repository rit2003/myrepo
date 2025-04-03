 // Function to get URL parameters
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ""
    return decodeURIComponent(results[2].replace(/\+/g, " "))
  }
  
  // Load candidate information from URL parameters
  function loadCandidateInfo() {
    const name = getParameterByName("name")
    const candidateEmail = getParameterByName("email")
    const date = getParameterByName("date")
    const round = getParameterByName("round")
  
    const candidateInfoDiv = document.getElementById("candidate-info")
    candidateInfoDiv.innerHTML = `
                <h2>Evaluating: ${name}</h2>
                <p>Email: ${candidateEmail}</p>
                <p>Interview Date: ${date}</p>
                <p>Interview Round: ${round || "N/A"}</p>
            `
  }
  
  function createSkillRow(skill) {
    const row = document.createElement("div")
    row.classList.add("evaluation-row")
  
    // Skill Label
    const skillLabel = document.createElement("label")
    skillLabel.textContent = skill
    row.appendChild(skillLabel)
  
    // Rating Select
    const ratingSelect = document.createElement("select")
    ratingSelect.name = `rating-${skill.replace(/\s+/g, "-").toLowerCase()}`
    const ratings = ["Average", "Good", "Not Evaluated", "Poor", "Very Good"]
    ratings.forEach((rating) => {
      const option = document.createElement("option")
      option.value = rating
      option.textContent = rating
      ratingSelect.appendChild(option)
    })
    row.appendChild(ratingSelect)
  
    // Topics Input
    const topicsInput = document.createElement("input")
    topicsInput.type = "text"
    topicsInput.name = `topics-${skill.replace(/\s+/g, "-").toLowerCase()}`
    topicsInput.placeholder = "Topics Used for Evaluation"
    row.appendChild(topicsInput)
  
    // Comments Input
    const commentsInput = document.createElement("input")
    commentsInput.type = "text"
    commentsInput.name = `comments-${skill.replace(/\s+/g, "-").toLowerCase()}`
    commentsInput.placeholder = "Comments"
    row.appendChild(commentsInput)
  
    // Remove Button
    const removeButton = document.createElement("button")
    removeButton.textContent = "Remove"
    removeButton.onclick = () => {
      row.remove()
    }
    row.appendChild(removeButton)
  
    return row
  }
  
  // Modal functions
  function openAddSkillModal() {
    document.getElementById("add-skill-modal").style.display = "flex"
    document.getElementById("skill-name").value = ""
    document.getElementById("skill-name").focus()
  }
  
  function closeAddSkillModal() {
    document.getElementById("add-skill-modal").style.display = "none"
  }
  
  function confirmAddSkill() {
    const skillName = document.getElementById("skill-name").value.trim()
    if (skillName) {
      const skillEvaluationDiv = document.getElementById("skill-evaluation")
      const newSkillRow = createSkillRow(skillName)
      skillEvaluationDiv.appendChild(newSkillRow)
      closeAddSkillModal()
    }
  }
  
  function openSuccessModal() {
    document.getElementById("success-modal").style.display = "flex"
  }
  
  function closeSuccessModal() {
    document.getElementById("success-modal").style.display = "none"
    window.location.href = "records.html"
  }
  
  // Initial Skills
  const initialSkills = [
    "Basic Algorithm",
    "Code and Syntax",
    "Design Patterns",
    "SQL",
    "Git",
    "Overall Attitude",
    "Learning Ability",
    "Resume Explanation",
    "Communication",
  ]
  
  function populateSkillEvaluation() {
    const skillEvaluationDiv = document.getElementById("skill-evaluation")
    skillEvaluationDiv.innerHTML =
      '<h2>Skill Evaluation</h2><button type="button" id="add-skill-button" onclick="openAddSkillModal()">Add Skill</button>'
    initialSkills.forEach((skill) => {
      const row = createSkillRow(skill)
      skillEvaluationDiv.appendChild(row)
    })
  }
  
  function openValidationModal() {
    document.getElementById("validation-modal").style.display = "flex"
  }
  
  function closeValidationModal() {
    document.getElementById("validation-modal").style.display = "none"
  }
  
  function submitEvaluation() {
    const interviewerEmail = localStorage.getItem("email")
    const candidateName = getParameterByName("name")
    const candidateEmail = getParameterByName("email")
    const interviewTime = getParameterByName("date")
    const finalDecision = document.getElementById("final-decision").value
    const id = getParameterByName("id")
  
    // Validate required fields
    let hasEmptyRequiredFields = false
    const skillRows = document.querySelectorAll(".evaluation-row")
  
    skillRows.forEach((row) => {
      const skillLabel = row.querySelector("label").textContent
      const skillKey = skillLabel.replace(/\s+/g, "-").toLowerCase()
      const ratingSelect = row.querySelector(`select[name="rating-${skillKey}"]`)
      const topicsInput = row.querySelector(`input[name="topics-${skillKey}"]`)
  
      // Check if rating or topics are empty (comments are optional)
      if (!ratingSelect.value || !topicsInput.value.trim()) {
        hasEmptyRequiredFields = true
      }
    })
  
    if (hasEmptyRequiredFields) {
      openValidationModal()
      return
    }
  
    const skillEvaluations = []
    skillRows.forEach((row) => {
      const skillLabel = row.querySelector("label").textContent
      const skillKey = skillLabel.replace(/\s+/g, "-").toLowerCase()
      skillEvaluations.push({
        skill: skillLabel,
        rating: row.querySelector(`select[name="rating-${skillKey}"]`).value,
        topicsUsed: row.querySelector(`input[name="topics-${skillKey}"]`).value,
        comments: row.querySelector(`input[name="comments-${skillKey}"]`).value,
      })
    })
  
    const requestBody = {
      interviewerEmail: interviewerEmail,
      intervieweeName: candidateName,
      intervieweeEmail: candidateEmail,
      interviewTime: interviewTime,
      l1Decision: finalDecision,
      l2Scheduled: ["L1 Passed"].includes(finalDecision) ? "No" : "Yes",
      finalDecision: "pending",
      parameters: skillEvaluations,
    }
  
    console.log("Sending Request:", requestBody)
  
    fetch("http://localhost:8080/api/evaluations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data)
        openSuccessModal() 
  
        if (id) {
          fetch(`http://localhost:8080/api/schedules/updateEvaluation/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((res) => console.log("Schedule Updated:", res))
            .catch((error) => console.error("Schedule Update Error:", error))
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Failed to submit evaluation.")
      })
  }
  
  // Add event listener for the skill name input to handle Enter key
  document.addEventListener("DOMContentLoaded", () => {
    const skillNameInput = document.getElementById("skill-name")
    skillNameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        confirmAddSkill()
      }
    })
  })