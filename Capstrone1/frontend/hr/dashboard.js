async function loadScheduledInterviews() {
    try {
        const response = await fetch('http://localhost:8080/api/schedules');
        const scheduledInterviews = await response.json();

        const interviewBody = document.getElementById('interviewBody');
        const noInterviewsMessage = document.getElementById('noInterviewsMessage');

        // Clear existing interviews
        interviewBody.innerHTML = '';

        if (scheduledInterviews.length === 0) {
            noInterviewsMessage.style.display = 'block';
            document.getElementById('interviewTable').style.display = 'none'; // Hide table if no data
        } else {
            noInterviewsMessage.style.display = 'none';
            document.getElementById('interviewTable').style.display = 'table'; // Show table

            scheduledInterviews.forEach(interview => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${interview.intervieweeName}</td>
                        <td>${interview.email}</td>
                        <td>${interview.intervieweeEmail}</td>
                        <td>${new Date(interview.interviewDate).toLocaleString()}</td>
                        <td><a href="${interview.resumeLink}" target="_blank">View</a></td>
                    `;
                interviewBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching interview schedules:', error);
        document.getElementById('noInterviewsMessage').textContent = 'Failed to load interviews. Please try again later.';
        document.getElementById('noInterviewsMessage').style.display = 'block';
    }
}

// Load scheduled interviews on page load
document.addEventListener('DOMContentLoaded', loadScheduledInterviews);

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}