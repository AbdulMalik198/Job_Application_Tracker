// Load jobs from localStorage
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// DOM elements
const jobForm = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const filterStatus = document.getElementById("filterStatus");
const sortBy = document.getElementById("sortBy");

// Add Job
jobForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const job = {
        id: Date.now(),
        company: document.getElementById("company").value,
        position: document.getElementById("position").value,
        status: document.getElementById("status").value,
        date: new Date().toISOString()
    };

    jobs.push(job);
    saveJobs();
    renderJobs();
    jobForm.reset();
});

// Save to localStorage
function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

// Render Jobs
function renderJobs() {
    jobList.innerHTML = "";

    let filtered = jobs;

    // Filter
    if (filterStatus.value !== "All") {
        filtered = filtered.filter(job => job.status === filterStatus.value);
    }

    // Sort
    if (sortBy.value === "company") {
        filtered.sort((a, b) => a.company.localeCompare(b.company));
    } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Display
    filtered.forEach(job => {
        const card = document.createElement("div");
        card.classList.add("job-card");

        card.innerHTML = `
            <div class="job-info">
                <h3>${job.company}</h3>
                <p>${job.position}</p>
                <span class="status ${job.status}">${job.status}</span>
            </div>

            <div class="actions">
                <button class="edit-btn" onclick="editJob(${job.id})">Edit</button>
                <button class="delete-btn" onclick="deleteJob(${job.id})">Delete</button>
            </div>
        `;

        jobList.appendChild(card);
    });
}

// Edit Job
function editJob(id) {
    const job = jobs.find(j => j.id === id);

    document.getElementById("company").value = job.company;
    document.getElementById("position").value = job.position;
    document.getElementById("status").value = job.status;

    deleteJob(id);
}

// Delete Job
function deleteJob(id) {
    jobs = jobs.filter(job => job.id !== id);
    saveJobs();
    renderJobs();
}

// Filters
filterStatus.addEventListener("change", renderJobs);
sortBy.addEventListener("change", renderJobs);

// Initial load
renderJobs();