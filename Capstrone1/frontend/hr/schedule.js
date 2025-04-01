// Function to fetch interviewers and populate the dropdown
function populateInterviewers() {
    fetch("http://localhost:8080/api/users/getinterviewer")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((interviewers) => {
            const interviewerSelect = document.getElementById("interviewer");
            interviewers.forEach((interviewer) => {
                const option = document.createElement("option");
                option.value = interviewer.email; // Use email as value
                option.textContent = interviewer.name; // Display interviewer's name or email
                interviewerSelect.appendChild(option);
            });
        })
        .catch((error) =>
            console.error("Error fetching interviewers:", error)
        );
}

document.addEventListener("DOMContentLoaded", function () {
    function scheduleInterview() {
        const intervieweeName = document.getElementById("intervieweeName");
        const intervieweeEmail = document.getElementById("intervieweeEmail");
        const intervieweeResume =
            document.getElementById("intervieweeResume");
        const interviewer = document.getElementById("interviewer");
        const interviewDateTime =
            document.getElementById("interviewDateTime");
        const typeOfInterview = document.getElementById("typeOfInterview");

        if (
            !intervieweeName.value ||
            !intervieweeEmail.value ||
            !intervieweeResume.value ||
            !interviewer.value ||
            !interviewDateTime.value
        ) {
            alert("Please fill in all the fields.");
            return;
        }

        const scheduleData = {
            typeOfInterview: document.getElementById("level").value,
            intervieweeEmail: intervieweeEmail.value,
            intervieweeName: intervieweeName.value,
            email: interviewer.value,
            resumeLink: intervieweeResume.value,
            interviewDate: interviewDateTime.value,
        };

        console.log(scheduleData);

        fetch("http://localhost:8080/api/schedules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scheduleData),
        })
            .then((response) => {
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                alert("Interview scheduled successfully!");
                sendEmail(interviewer.value, interviewDateTime.value);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");

            });
    }

    function sendEmail(email, dateTime) {
        emailjs.init("-ERYtWewRPd26lbez");
        emailjs
            .send("service_bczd6pb", "template_cydxr7w", {
                to_email: email,
                message: `Your interview is scheduled on ${dateTime}`,
            })
            .then((response) =>
                console.log("Email sent successfully!", response)
            )
            .catch((error) => console.error("Email sending failed:", error));
    }

    document
        .getElementById("scheduleBtn")
        .addEventListener("click", scheduleInterview);
});

// Call populateInterviewers when the page loads
window.onload = populateInterviewers;

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}
