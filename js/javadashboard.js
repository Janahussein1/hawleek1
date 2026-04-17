console.log("JS LOADED");
document.addEventListener('DOMContentLoaded', () => {

    console.log("JS LOADED");

    let pendingCount = parseInt(localStorage.getItem('pendingStats')) || 12;
    let cancelledCount = parseInt(localStorage.getItem('cancelledStats')) || 4;

    const statPendingEl = document.getElementById('stat-pending');
    const statCancelledEl = document.getElementById('stat-cancelled');

    if (statPendingEl) statPendingEl.innerText = pendingCount;
    if (statCancelledEl) statCancelledEl.innerText = cancelledCount;

    const updateStats = () => {
        if (statPendingEl) statPendingEl.innerText = pendingCount;
        if (statCancelledEl) statCancelledEl.innerText = cancelledCount;

        localStorage.setItem('pendingStats', pendingCount);
        localStorage.setItem('cancelledStats', cancelledCount);
    };

    const tableBody = document.getElementById('reservation-table-body');

    if (!tableBody) {
        console.error("Table body NOT found");
        return;
    }

    tableBody.addEventListener('click', (e) => {
        console.log("CLICK DETECTED");

        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;

        const badge = row.querySelector('.badge');
        const confirmBtn = row.querySelector('.btn-confirm');
        const cancelBtn = row.querySelector('.btn-cancel');

        if (!badge) return;

        // CONFIRM
        if (target.classList.contains('btn-confirm') && !target.disabled) {
            console.log("CONFIRM CLICKED");

            if (badge.classList.contains('pending')) {
                pendingCount--;
            }

            badge.className = 'badge confirmed';
            badge.textContent = 'Confirmed';

            target.disabled = true;
            updateStats();
        }

        // CANCEL
        if (target.classList.contains('btn-cancel') && !target.disabled) {
            console.log("CANCEL CLICKED");

            if (badge.classList.contains('pending')) {
                pendingCount--;
            }

            cancelledCount++;

            badge.className = 'badge cancelled';
            badge.textContent = 'Cancelled';

            confirmBtn.disabled = true;
            cancelBtn.disabled = true;
            row.style.opacity = '0.5';

            updateStats();
        }
    });

});