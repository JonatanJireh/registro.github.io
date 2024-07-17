document.addEventListener('DOMContentLoaded', function () {
    let total = 0;

    const totalDisplay = document.getElementById('total');
    const incomeForm = document.getElementById('incomeForm');
    const expenseForm = document.getElementById('expenseForm');
    const showIncomeFormButton = document.getElementById('showIncomeForm');
    const showExpenseFormButton = document.getElementById('showExpenseForm');
    const addIncomeButton = document.getElementById('addIncome');
    const addExpenseButton = document.getElementById('addExpense');
    const transactionTable = document.getElementById('transactionTable');

    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(transaction => {
            addTransactionToTable(transaction.type, transaction.amount, transaction.details, transaction.returnTo, transaction.returnStatus);
            if (transaction.type === 'income') {
                total += transaction.amount;
            } else {
                total -= transaction.amount;
            }
        });
        updateTotal();
    }

    function updateTotal() {
        totalDisplay.textContent = total.toFixed(2);
    }

    function saveTransaction(type, amount, details, returnTo, returnStatus) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push({ type, amount, details, returnTo, returnStatus });
        localStorage.setItem('transactions', JSON.stringify(transactions));
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
        transactions[index].returnStatus = event.target.value;
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function addTransaction(type) {
        const amount = parseFloat(type === 'income' ? document.getElementById('incomeAmount').value : document.getElementById('expenseAmount').value);
        const details = type === 'income' ? document.getElementById('incomeDetails').value : document.getElementById('expenseDetails').value;
        const returnTo = type === 'income' ? '' : document.getElementById('returnTo').value;
        const returnStatus = type === 'income' ? '' : document.getElementById('returnStatus').value;

        if (isNaN(amount) || amount <= 0 || !details.trim() || (type === 'expense' && (!returnTo.trim() || !returnStatus.trim()))) {
            alert('Por favor ingrese un monto, detalles y destinatario válidos');
            return;
        }

        addTransactionToTable(type, amount, details, returnTo, returnStatus);
        saveTransaction(type, amount, details, returnTo, returnStatus);

        if (type === 'income') {
            total += amount;
        } else {
            total -= amount;
        }

        updateTotal();
        if (type === 'income') {
            document.getElementById('incomeAmount').value = '';
            document.getElementById('incomeDetails').value = '';
        } else {
            document.getElementById('expenseAmount').value = '';
            document.getElementById('expenseDetails').value = '';
            document.getElementById('returnTo').value = '';
            document.getElementById('returnStatus').value = 'No devuelto';
        }
    }

    showIncomeFormButton.addEventListener('click', function () {
        incomeForm.classList.remove('hidden');
        expenseForm.classList.add('hidden');
    });

    showExpenseFormButton.addEventListener('click', function () {
        incomeForm.classList.add('hidden');
        expenseForm.classList.remove('hidden');
    });

    addIncomeButton.addEventListener('click', function () {
        addTransaction('income');
    });

    addExpenseButton.addEventListener('click', function () {
        addTransaction('expense');
    });

    loadTransactions();
});
