const form = document.getElementById("addReservationForm");
const tableBody = document.getElementById("reservation-table-body");

let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

// Load data when page opens
window.onload = function () {
    renderReservations();
};

// Add reservation
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("resName").value.trim();
    const guests = document.getElementById("resGuests").value;
    const datetime = document.getElementById("resDateTime").value;

    if (!name || !guests || !datetime) return;

    const newReservation = {
        name,
        guests,
        datetime,
        status: "pending"
    };

    reservations.push(newReservation);
    saveAndRender();
    form.reset();
});

// Save + render
function saveAndRender() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
    renderReservations();
}

// Render ALL reservations
function renderReservations() {
    tableBody.innerHTML = "";

    let total = reservations.length;
    let pending = 0;
    let cancelled = 0;

    reservations.forEach((res, index) => {
        if (res.status === "pending") pending++;
        if (res.status === "cancelled") cancelled++;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${res.name}</td>
            <td>${res.guests} Persons</td>
            <td>${new Date(res.datetime).toLocaleString()}</td>
            <td><span class="badge ${res.status}">${res.status}</span></td>
            <td>
                <button onclick="confirmReservation(${index})">Confirm</button>
                <button onclick="cancelReservation(${index})">Cancel</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-cancelled").textContent = cancelled;
}


function confirmReservation(index) {
    reservations[index].status = "confirmed";
    saveAndRender();
}


function cancelReservation(index) {
    reservations[index].status = "cancelled";
    saveAndRender();
}
