const apiUrl = "http://localhost:8080/api/employees";

function fetchEmployees() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("employeeContainer");
            container.innerHTML = "";
            data.forEach(emp => {
                const card = `
                    <div class="employee-card">
                        <div class="employee-card-header">
                            <h3>${emp.name}</h3>
                            <div class="employee-actions">
                                <button class="btn-edit" onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.email}', '${emp.department}', ${emp.salary})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" onclick="deleteEmployee(${emp.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p><strong>Email:</strong> ${emp.email}</p>
                        <p><strong>Department:</strong> ${emp.department}</p>
                        <p><strong>Salary:</strong> $${emp.salary.toLocaleString()}</p>
                    </div>
                `;
                container.innerHTML += card;
            });
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
            alert('Failed to load employees. Please check your connection.');
        });
}

function openModal() {
    document.getElementById("employeeModal").style.display = "flex";
    document.getElementById("employeeForm").reset();
    document.getElementById("modalTitle").textContent = "Add Employee";
}

function closeModal() {
    document.getElementById("employeeModal").style.display = "none";
}

function saveEmployee() {
    const id = document.getElementById("employeeId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;

    const employeeData = { name, email, department, salary: Number(salary) };

    const method = id ? "PUT" : "POST";
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            closeModal();
            fetchEmployees();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save employee. Please try again.');
        });
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                fetchEmployees();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete employee. Please try again.');
            });
    }
}

function editEmployee(id, name, email, department, salary) {
    document.getElementById("employeeId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("department").value = department;
    document.getElementById("salary").value = salary;
    document.getElementById("modalTitle").textContent = "Edit Employee";
    openModal();
}

// Fetch employees on page load
fetchEmployees();