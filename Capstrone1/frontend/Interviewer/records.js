
async function updateFinalDecision(id, newDecision) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/evaluations/${id}/final-decision?finalDecision=${newDecision}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            }
        );
        if (response.ok) {
            alert("Final decision updated successfully");
            loadRecords();
        } else {
            alert("Error updating decision");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchEvaluationDetails(email) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/evaluations/by-email?intervieweeEmail=${email}`
        );
        const data = await response.json();

        if (data.length === 0) {
            alert("No evaluation details found.");
            return;
        }

        generatePDF(data, email);
    } catch (error) {
        console.error("Error:", error);
    }
}

function generatePDF(data, email) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10; // Y-coordinate for text placement

    doc.setFontSize(14);
    doc.text(`Evaluation Details for: ${email}`, 10, y);
    y += 10;

    data.forEach((e, index) => {
        doc.setFontSize(12);
        doc.text(`Interview #${index + 1}`, 10, y);
        y += 6;
        doc.text(`Interview Date: ${e.interviewTime}`, 10, y);
        y += 6;
        doc.text(`Interviewer: ${e.interviewerEmail}`, 10, y);
        y += 6;
        doc.text(`L1 Decision: ${e.l1Decision}`, 10, y);
        y += 6;
        doc.text(`Final Decision: ${e.finalDecision}`, 10, y);
        y += 8;
        doc.text("Skills Ratings:", 10, y);
        y += 6;

        e.parameters.forEach((p) => {
            doc.text(`- ${p.skill}: ${p.rating} (${p.comments})`, 15, y);
            y += 6;
        });

        y += 10; // Space between evaluations
        if (y > 270) { // Avoid overflowing the page
            doc.addPage();
            y = 10;
        }
    });

    doc.save(`${email}_evaluation.pdf`);
}


async function loadRecords() {
    try {
        const response = await fetch("http://localhost:8080/api/evaluations");
        const records = await response.json();
        const tableBody = document.getElementById("recordTableBody");
        tableBody.innerHTML = "";
        console.log(records)
        records.forEach((record) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${record.intervieweeName}</td>
              <td>${record.interviewTime}</td>
              <td>${record.interviewerEmail}</td>
              <td>${record.l1Decision}</td>
              <td>${record.l2Scheduled}</td>
              <td>${record.finalDecision}</td>
              <td>
                  <button onclick="fetchEvaluationDetails('${record.intervieweeEmail
                }')">Download PDF</button>
              </td>
  
          `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}

window.onload = loadRecords;