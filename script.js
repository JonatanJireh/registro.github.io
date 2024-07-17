document.addEventListener('DOMContentLoaded', function () {
    let total = 0;
    let totalToReturn = 0;

    const totalDisplay = document.getElementById('total');
    const totalToReturnDisplay = document.getElementById('totalToReturn');
    const incomeForm = document.getElementById('incomeForm');
    const expenseForm = document.getElementById('expenseForm');
    const showIncomeFormButton = document.getElementById('showIncomeForm');
    const showExpenseFormButton = document.getElementById('showExpenseForm');
    const addIncomeButton = document.getElementById('addIncome');
    const addExpenseButton = document.getElementById('addExpense');
    const viewTransactionsButton = document.getElementById('viewTransactions');

    function updateTotals() {
        totalDisplay.textContent = total.toFixed(2);
        totalToReturnDisplay.textContent = totalToReturn.toFixed(2);
    }

    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.forEach(transaction => {
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

    function saveTransaction(type, amount, details, returnTo, returnStatus) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push({ type, amount, details, returnTo, returnStatus });
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

        saveTransaction(type, amount, details, returnTo, returnStatus);

        if (type === 'income') {
            total += amount;
        } else {
            total -= amount;
            if (returnStatus === 'No devuelto') {
                totalToReturn += amount;
            }
        }

        updateTotals();
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

    viewTransactionsButton.addEventListener('click', function () {
        window.location.href = 'transactions.html';
    });

    loadTransactions();
});
