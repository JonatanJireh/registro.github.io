document.addEventListener('DOMContentLoaded', function () {
    let total = 0;
    let totalToReturn = 0;

    const transactionTable = document.getElementById('transactionTable');
    const totalDisplay = document.getElementById('total');
    const totalToReturnDisplay = document.getElementById('totalToReturn');
    const backToMainButton = document.getElementById('backToMain');
    const clearDataButton = document.getElementById('clearData');

    function updateTotals() {
        totalDisplay.textContent = total.toFixed(2);
        totalToReturnDisplay.textContent = totalToReturn.toFixed(2);
    }

    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(transaction => {
            addTransactionToTable(transaction.type, transaction.amount, transaction.details, transaction.returnTo, transaction.returnStatus);
            if (transaction.type === 'income') {
                total += transaction.amount;
            } else {
                total -= transaction.amount;
                if (transaction.returnStatus === 'No devuelto') {
                    totalToReturn += transaction.amount;
                }
            }
        });
        updateTotals();
    }

    function addTransactionToTable(type, amount, details, returnTo, returnStatus) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${type === 'income' ? 'Ingreso' : 'Egreso'}</td>
            <td>Bs ${amount.toFixed(2)}</td>
            <td>${details}</td>
            <td>${type === 'income' ? '' : returnTo}</td>
            <td>${type === 'income' ? '' : `<select class="returnStatus">
                    <option value="No devuelto" ${returnStatus === 'No devuelto' ? 'selected' : ''}>No devuelto</option>
                    <option value="Devuelto" ${returnStatus === 'Devuelto' ? 'selected' : ''}>Devuelto</option>
                </select>`}</td>
        `;
        if (type === 'expense') {
            row.querySelector('.returnStatus').addEventListener('change', updateReturnStatus);
        }
        transactionTable.appendChild(row);
    }

    function updateReturnStatus(event) {
        const row = event.target.closest('tr');
        const index = Array.from(transactionTable.children).indexOf(row);
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const transaction = transactions[index];

        const oldStatus = transaction.returnStatus;
        transaction.returnStatus = event.target.value;
        localStorage.setItem('transactions', JSON.stringify(transactions));

        if (oldStatus !== transaction.returnStatus) {
            if (transaction.returnStatus === 'Devuelto') {
                totalToReturn -= transaction.amount;
            } else {
                totalToReturn += transaction.amount;
            }
            updateTotals();
        }
    }

    function clearData() {
        if (confirm('¿Está seguro de que desea borrar todos los datos?')) {
            localStorage.removeItem('transactions');
            transactionTable.innerHTML = '';
            total = 0;
            totalToReturn = 0;
            updateTotals();
        }
    }

    backToMainButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    clearDataButton.addEventListener('click', clearData);

    loadTransactions();
});
