document.addEventListener('DOMContentLoaded', () => {
    console.log("JS LOADED");


    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-msg');
            
         
            const validUsername = "admin1";
            const validPassword = "adminpass12";

            if (usernameInput !== validUsername || passwordInput !== validPassword) {
               
                errorMsg.textContent = "Error: Invalid username or password. Access denied.";
                errorMsg.hidden = false;
                return; 
            }

            errorMsg.hidden = true; 
            loginSection.hidden = true; 
            dashboardSection.hidden = false; 
           
            updateStats();
        });
    }


    const tableBody = document.getElementById('reservation-table-body');
    const statTotalEl = document.getElementById('stat-total');
    const statPendingEl = document.getElementById('stat-pending');
    const statCancelledEl = document.getElementById('stat-cancelled');

   
    const updateStats = () => {
        if (!tableBody) return; // safety check
        
        const rows = document.querySelectorAll('.reservation-row');
        let totalCount = rows.length;
        let pendingCount = 0;
        let cancelledCount = 0;

        rows.forEach(row => {
            const status = row.getAttribute('data-status');
            if (status === 'pending') pendingCount++;
            if (status === 'cancelled') cancelledCount++;
        });

        if (statTotalEl) statTotalEl.innerText = totalCount;
        if (statPendingEl) statPendingEl.innerText = pendingCount;
        if (statCancelledEl) statCancelledEl.innerText = cancelledCount;
    };


    const showNotification = (title, message) => {
        const modal = document.getElementById('notificationModal');
        if(modal) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalMessage').textContent = message;
            modal.showModal();
        }
    };

    const addForm = document.getElementById('addReservationForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('resName').value;
            const guests = document.getElementById('resGuests').value;
            const dateTimeInput = document.getElementById('resDateTime').value;

            // Format Date and Time
            const dateObj = new Date(dateTimeInput);
            const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);

         
            const newRow = document.createElement('tr');
            newRow.className = 'reservation-row';
            newRow.setAttribute('data-status', 'pending');
            
            newRow.innerHTML = `
                <td class="customer-name" scope="row">${name}</td>
                <td>${guests} Persons</td>
                <td><time datetime="${dateTimeInput}">${formattedDate}</time></td>
                <td><span class="badge pending">Pending</span></td>
                <td>
                    <button class="btn-confirm">Confirm</button>
                    <button class="btn-cancel">Cancel</button>
                </td>
            `;

            tableBody.appendChild(newRow);
            
           
            this.reset();
            updateStats();
            showNotification("Success", `Reservation for ${name} added!`);
        });
    }

 
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const badge = row.querySelector('.badge');
            const confirmBtn = row.querySelector('.btn-confirm');
            const cancelBtn = row.querySelector('.btn-cancel');
            const customerName = row.querySelector('.customer-name').innerText;

            if (!badge) return;

     
            if (target.classList.contains('btn-confirm') && !target.disabled) {
                row.setAttribute('data-status', 'confirmed');
                badge.className = 'badge confirmed';
                badge.textContent = 'Confirmed';
                target.disabled = true; 

                updateStats();
                showNotification("Confirmed", `Reservation for ${customerName} has been confirmed.`);
            }


            if (target.classList.contains('btn-cancel') && !target.disabled) {
                row.setAttribute('data-status', 'cancelled');
                badge.className = 'badge cancelled';
                badge.textContent = 'Cancelled';

                if(confirmBtn) confirmBtn.disabled = true; 
                target.disabled = true; 
                

                row.classList.add('faded');

                updateStats();
                showNotification("Cancelled", `Reservation for ${customerName} has been cancelled.`);
            }
        });
    }

    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.reservation-row');

            rows.forEach(row => {
                const name = row.querySelector('.customer-name').textContent.toLowerCase();
             
                row.hidden = !name.includes(searchTerm);
            });
        });
    }
});
