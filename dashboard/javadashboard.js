document.addEventListener('DOMContentLoaded', () => {
// 1. SELECT ELEMENTS
const tableBody = document.getElementById('reservation-table-body');
const statTotal = document.getElementById('stat-total');
const statPending = document.getElementById('stat-pending');
const statCancelled = document.getElementById('stat-cancelled');
const addForm = document.getElementById('addReservationForm');

// 2. DATA INITIALIZATION (Persistence)
let reservations = JSON.parse(localStorage.getItem('restaurant_data')) || [];

// 3. TOAST NOTIFICATION FUNCTION
function showToast(message, type = 'success') {
const container = document.getElementById('toast-container');
if (!container) return;

const toast = document.createElement('div');
toast.className = `toast toast-${type}`;
toast.innerText = message;

container.appendChild(toast);

// Auto-remove after 3 seconds
setTimeout(() => {
toast.style.opacity = '0';
setTimeout(() => toast.remove(), 500);
}, 3000);
}

// 4. CORE FUNCTIONS
function updateStats() {
statTotal.innerText = reservations.length;
statPending.innerText = reservations.filter(r => r.status === 'Pending').length;
statCancelled.innerText = reservations.filter(r => r.status === 'Cancelled').length;
}

function saveData() {
localStorage.setItem('restaurant_data', JSON.stringify(reservations));
updateStats();
}

function renderTable() {
tableBody.innerHTML = '';

reservations.forEach((res, index) => {
const row = document.createElement('tr');
row.className = 'res-row';
row.setAttribute('data-status', res.status);

// Dynamic color for status text
const statusColor = res.status === 'Confirmed' ? '#27ae60' : (res.status === 'Cancelled' ? '#e74c3c' : '#f39c12');

row.innerHTML = `
<td>${res.name}</td>
<td>${res.guests}</td>
<td>${res.dateTime.replace('T', ' ')}</td>
<td style="color: ${statusColor}; font-weight: bold;">${res.status}</td>
<td>
<button class="btn-confirm" data-index="${index}">Confirm</button>
<button class="btn-cancel" data-index="${index}">Cancel</button>
</td>
`;
tableBody.appendChild(row);
});
updateStats();
}

// 5. EVENT LISTENERS

// Add New Reservation
addForm.addEventListener('submit', (e) => {
e.preventDefault();

const name = document.getElementById('resName').value.trim();
const guests = parseInt(document.getElementById('resGuests').value);
const dateStr = document.getElementById('resDateTime').value;
const inputDate = new Date(dateStr);
const now = new Date();

// VALIDATION 1: Letters only
if (!/^[A-Za-z\s]+$/.test(name)) {
showToast("Error: Name must be letters only!", "error");
return;
}

// VALIDATION 2: No negative or zero
if (guests <= 0) {
showToast("Error: Guests must be at least 1!", "error");
return;
}

// VALIDATION 3: No past dates
if (inputDate < now) {
showToast("Error: You cannot book a date in the past!", "error");
return;
}

// Add to array
reservations.push({
name: name,
guests: guests,
dateTime: dateStr,
status: 'Pending'
});

saveData();
renderTable();
showToast("Reservation successfully added!");
addForm.reset();
});

// Handle Confirm/Cancel (Using Event Delegation)
tableBody.addEventListener('click', (e) => {
const index = e.target.dataset.index;
if (index === undefined) return;

if (e.target.classList.contains('btn-confirm')) {
reservations[index].status = 'Confirmed';
showToast("Booking Confirmed!");
} else if (e.target.classList.contains('btn-cancel')) {
reservations[index].status = 'Cancelled';
showToast("Booking Cancelled", "error");
}

saveData();
renderTable();
});

// 6. INITIAL RUN
renderTable();
});
