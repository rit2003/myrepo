// Modal functionality
const modal = document.getElementById("customModal")
const modalTitle = document.getElementById("modalTitle")
const modalMessage = document.getElementById("modalMessage")
const modalIcon = document.getElementById("modalIcon")
const closeButton = document.querySelector(".close-button")
const modalOkButton = document.getElementById("modalOkButton")

// Show modal function
function showModal(title, message, type = "info") {
  modalTitle.textContent = title
  modalMessage.textContent = message

  // Set header class based on type
  const modalHeader = document.querySelector(".modal-header")
  modalHeader.className = "modal-header" // Reset classes
  modalHeader.classList.add(type)

  // Set icon based on type
  if (type === "success") {
    modalIcon.innerHTML = "✅"
  } else if (type === "error") {
    modalIcon.innerHTML = "❌"
  } else {
    modalIcon.innerHTML = "ℹ️"
  }

  // Show the modal
  modal.style.display = "block"

  // Prevent scrolling on the body
  document.body.style.overflow = "hidden"
}

// Close modal function
function closeModal() {
  modal.style.display = "none"
  document.body.style.overflow = ""
}

// Event listeners for closing the modal
closeButton.addEventListener("click", closeModal)
modalOkButton.addEventListener("click", closeModal)
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "block") {
    closeModal()
  }
})

async function deleteRecord(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/evaluations/${id}`, { method: "DELETE" })
    if (response.ok) {
      showModal("Success", "Record deleted successfully", "success")
      loadRecords()
    } else {
      showModal("Error", "Error deleting record", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showModal("Error", "Failed to delete record", "error")
  }
}

async function updateFinalDecision(id, newDecision) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/evaluations/${id}/final-decision?finalDecision=${newDecision}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
    )
    if (response.ok) {
      showModal("Success", "Final decision updated successfully", "success")
      loadRecords()
    } else {
      showModal("Error", "Error updating decision", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showModal("Error", "Failed to update decision", "error")
  }
}

async function fetchEvaluationDetails(email) {
  try {
    const response = await fetch(`http://localhost:8080/api/evaluations/by-email?intervieweeEmail=${email}`)
    const data = await response.json()

    if (data.length === 0) {
      showModal("Info", "No evaluation details found", "info")
      return
    }

    generatePDF(data, email)
  } catch (error) {
    console.error("Error:", error)
    showModal("Error", "Failed to fetch evaluation details", "error")
  }
}

function generatePDF(data, email) {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()
  let y = 10 // Y-coordinate for text placement

  doc.setFontSize(14)
  doc.text(`Evaluation Details for: ${email}`, 10, y)
  y += 10

  data.forEach((e, index) => {
    doc.setFontSize(12)
    doc.text(`Interview #${index + 1}`, 10, y)
    y += 6
    doc.text(`Interview Date: ${e.interviewTime}`, 10, y)
    y += 6
    doc.text(`Interviewer: ${e.interviewerEmail}`, 10, y)
    y += 6
    doc.text(`L1 Decision: ${e.l1Decision}`, 10, y)
    y += 6
    doc.text(`Final Decision: ${e.finalDecision}`, 10, y)
    y += 8

    doc.text("Skills Ratings:", 10, y)
    y += 6

    e.parameters.forEach((p) => {
      doc.text(`- ${p.skill}: ${p.rating} (${p.comments})`, 15, y)
      y += 6
    })

    y += 10 // Space between evaluations
    if (y > 270) {
      // Avoid overflowing the page
      doc.addPage()
      y = 10
    }
  })

  doc.save(`${email}_evaluation.pdf`)
}

async function loadRecords() {
  try {
    const response = await fetch("http://localhost:8080/api/evaluations")
    const records = await response.json()
    const tableBody = document.getElementById("recordTableBody")
    tableBody.innerHTML = ""

    if (records.length === 0) {
      document.getElementById("noRecordsMessage").style.display = "block"
      return
    }

    document.getElementById("noRecordsMessage").style.display = "none"
    
    records.forEach((record) => {
      // Determine L2 scheduling based on L1 decision
      const needsL2 = record.l1Decision !== "L1 Passed"
      const l2ScheduledText = needsL2 ? "Yes" : "No"
      const row = document.createElement("tr")
      row.innerHTML = `
            <td data-label="Interviewee Name">${record.intervieweeName}</td>
            <td data-label="Interview Date">${record.interviewTime}</td>
            <td data-label="Interviewer">${record.interviewerEmail}</td>
            <td data-label="L1 Decision">${record.l1Decision}</td>
            <td data-label="L2 Scheduled">${l2ScheduledText}</td>
            <td data-label="Final Decision">
                <select onchange="updateFinalDecision('${record.id}', this.value)">
                    <option value="Pending" ${record.finalDecision === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Selected" ${record.finalDecision === "Selected" ? "selected" : ""}>Selected</option>
                    <option value="Not Selected" ${record.finalDecision === "Not Selected" ? "selected" : ""}>Not Selected</option>
                </select>
            </td>
            <td data-label="View PDF">
                <button onclick="fetchEvaluationDetails('${record.intervieweeEmail}')">Download PDF</button>
            </td>
            <td data-label="Actions"><button onclick="deleteRecord('${record.id}')">Delete</button></td>
        `
      tableBody.appendChild(row)
    })
  } catch (error) {
    console.error("Error:", error)
    showModal("Error", "Failed to load records", "error")
  }
}

window.onload = loadRecords

