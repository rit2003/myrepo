async function loadInterviews() {
    try {
        const email = localStorage.getItem("email");

        if (!email) {
            console.error("No user email found in local storage.");
            return;
        }

        const response = await fetch(
            `http://localhost:8080/api/schedules/interviewer?email=${email}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch schedules");
        }

        const interviews = await response.json();
        console.log("Schedules:", interviews);

        const interviewList = document.getElementById("interviewList");
        const noInterviewsMessage = document.getElementById("noInterviewsMessage");
        interviewList.innerHTML = "";

        // Filter out evaluated interviews
        const pendingInterviews = interviews.filter(
            (interview) => !interview.evaluated
        );

        if (pendingInterviews.length === 0) {
            noInterviewsMessage.style.display = "block";
        } else {
            noInterviewsMessage.style.display = "none";
            pendingInterviews.forEach((interview) => {
                const interviewCard = document.createElement("div");
                interviewCard.classList.add("interview-card");
                interviewCard.innerHTML = `
            <h2>${interview.intervieweeName}</h2>
            <p><strong>Date/Time:</strong> ${new Date(
                    interview.interviewDate
                ).toLocaleString()}</p>
            <p><strong>Email:</strong> ${interview.intervieweeEmail}</p>
            <p><strong>Interview Round:</strong> ${interview.typeOfInterview}</p>
            <p><a href="${interview.resumeLink}" target="_blank">View Resume</a></p>
            <a href="evaluation.html?id=${encodeURIComponent(interview.id)}&name=${encodeURIComponent(
                    interview.intervieweeName
                )}&email=${encodeURIComponent(interview.intervieweeEmail)}&date=${encodeURIComponent(
                    interview.interviewDate
                )}&round=${encodeURIComponent(interview.typeOfInterview)}" class="evaluate-button">
              Evaluate
            </a>
          `;

                interviewList.appendChild(interviewCard);
            });
        }
    } catch (error) {
        console.error("Error fetching interviews:", error);
    }
}

loadInterviews();

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}
