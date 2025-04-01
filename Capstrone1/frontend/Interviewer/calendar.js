
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

async function fetchInterviews() {
    try {
        const email = localStorage.getItem("email");
        const response = await fetch(
            `http://localhost:8080/api/schedules/interviewer?email=${email}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch interviews:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return [];
    }
}

function generateCalendar(year, month, interviews) {
    const calendarBody = document.querySelector("#calendar tbody");
    calendarBody.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    let dayCounter = 1;
    let row = document.createElement("tr");

    for (let i = 0; i < startingDay; i++) {
        let cell = document.createElement("td");
        row.appendChild(cell);
    }

    while (dayCounter <= daysInMonth) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }

        let cell = document.createElement("td");
        let day = document.createElement("div");
        day.textContent = dayCounter;
        cell.appendChild(day);

        if (row.children.length === 0 || row.children.length === 6) {
            cell.classList.add("weekend");
        }

        const currentDate = new Date(year, month, dayCounter);
        const interviewsForDay = interviews.filter((interview) => {
            if (!interview.interviewDate) return false;
            const interviewDate = new Date(interview.interviewDate);
            return (
                interviewDate.getFullYear() === currentDate.getFullYear() &&
                interviewDate.getMonth() === currentDate.getMonth() &&
                interviewDate.getDate() === currentDate.getDate()
            );
        });

        interviewsForDay.forEach((interview) => {
            let event = document.createElement("div");
            event.classList.add("event");
            let interviewTime = new Date(
                interview.interviewDate
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            event.innerHTML = `<strong>${interviewTime}</strong><br>${interview.intervieweeName}`;
            cell.appendChild(event);
        });

        cell.setAttribute("data-day", dayCounter);
        row.appendChild(cell);
        dayCounter++;
    }

    while (row.children.length < 7) {
        let cell = document.createElement("td");
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

function updateMonthYearDisplay() {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    document.getElementById(
        "currentMonthYear"
    ).textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

async function changeMonth(change) {
    currentMonth += change;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    await initializeCalendar();
}

async function initializeCalendar() {
    const interviews = await fetchInterviews();
    generateCalendar(currentYear, currentMonth, interviews);
    updateMonthYearDisplay();
}

window.onload = async function () {
    await initializeCalendar();
};

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}
