// Sample expense data
let expenses = [
    { id: 1, title: "Groceries", amount: 150.00, category: "food", date: "2023-06-15" },
    { id: 2, title: "Uber Ride", amount: 25.00, category: "transport", date: "2023-06-14" },
    { id: 3, title: "Netflix Subscription", amount: 15.99, category: "entertainment", date: "2023-06-10" },
    { id: 4, title: "Electricity Bill", amount: 80.00, category: "utilities", date: "2023-06-05" }
];

// Currency data with symbols and exchange rates relative to USD
const currencies = {
    "GHS": { symbol: "₵", rate: 11.5 },
    "USD": { symbol: "$", rate: 1 },
    "EUR": { symbol: "€", rate: 0.92 },
    "GBP": { symbol: "£", rate: 0.79 },
    "JPY": { symbol: "¥", rate: 144.5 },
    "CAD": { symbol: "C$", rate: 1.35 },
    "AUD": { symbol: "A$", rate: 1.5 },
    "CHF": { symbol: "Fr", rate: 0.89 },
    "CNY": { symbol: "¥", rate: 7.23 },
    "INR": { symbol: "₹", rate: 82.9 },
    "BRL": { symbol: "R$", rate: 4.92 },
    "RUB": { symbol: "₽", rate: 93.5 },
    "KRW": { symbol: "₩", rate: 1312.5 },
    "MXN": { symbol: "$", rate: 17.2 },
    "SGD": { symbol: "S$", rate: 1.35 },
    "NZD": { symbol: "NZ$", rate: 1.66 },
    "TRY": { symbol: "₺", rate: 26.1 },
    "ZAR": { symbol: "R", rate: 18.9 },
    "SEK": { symbol: "kr", rate: 10.7 },
    "NOK": { symbol: "kr", rate: 10.8 },
    "DKK": { symbol: "kr", rate: 6.9 }
};

let currentCurrency = "GHS";

// DOM Elements
const currencySelector = document.getElementById('currency');
const totalBalanceElement = document.getElementById('total-balance');
const totalIncomeElement = document.getElementById('total-income');
const totalExpensesElement = document.getElementById('total-expenses');
const expenseForm = document.getElementById('expense-form');
const expensesTable = document.getElementById('expenses-table');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow
    showSlides();
    
    // Set today's date as default for the date input
    document.getElementById('expense-date').valueAsDate = new Date();
    
    // Load expenses and update UI
    updateUI();
    
    // Set up event listeners
    currencySelector.addEventListener('change', handleCurrencyChange);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter expenses
            filterExpenses(this.textContent);
        });
    });
});

// Slideshow functionality
let slideIndex = 0;
function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

// Handle currency change
function handleCurrencyChange() {
    currentCurrency = currencySelector.value;
    updateUI();
}

// Handle expense form submission
function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('expense-title').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    
    // Create new expense object
    const newExpense = {
        id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
        title,
        amount,
        category,
        date
    };
    
    // Add to expenses array
    expenses.push(newExpense);
    
    // Update UI
    updateUI();
    
    // Reset form
    expenseForm.reset();
    document.getElementById('expense-date').valueAsDate = new Date();
}

// Filter expenses by category
function filterExpenses(category) {
    let filteredExpenses;
    
    if (category === 'All') {
        filteredExpenses = expenses;
    } else {
        filteredExpenses = expenses.filter(expense => 
            expense.category === category.toLowerCase()
        );
    }
    
    renderExpensesTable(filteredExpenses);
}

// Update all UI elements
function updateUI() {
    updateSummary();
    renderExpensesTable(expenses);
}

// Update summary cards
function updateSummary() {
    const totalIncome = 7800; // Static for demo purposes
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBalance = totalIncome - totalExpenses;
    
    const currencySymbol = currencies[currentCurrency].symbol;
    const rate = currencies[currentCurrency].rate;
    
    totalIncomeElement.textContent = `${currencySymbol} ${(totalIncome * rate).toFixed(2)}`;
    totalExpensesElement.textContent = `${currencySymbol} ${(totalExpenses * rate).toFixed(2)}`;
    totalBalanceElement.textContent = `${currencySymbol} ${(totalBalance * rate).toFixed(2)}`;
}

// Render expenses table
function renderExpensesTable(expensesArray) {
    const tbody = expensesTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    const currencySymbol = currencies[currentCurrency].symbol;
    const rate = currencies[currentCurrency].rate;
    
    if (expensesArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No expenses found</td></tr>';
        return;
    }
    
    expensesArray.forEach(expense => {
        const tr = document.createElement('tr');
        
        // Format date
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Format category with capital first letter
        const formattedCategory = expense.category.charAt(0).toUpperCase() + expense.category.slice(1);
        
        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${expense.title}</td>
            <td>${formattedCategory}</td>
            <td>${currencySymbol} ${(expense.amount * rate).toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${expense.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${expense.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteExpense(id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editExpense(id);
        });
    });
}

// Delete an expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        updateUI();
    }
}

// Edit an expense (simplified for demo)
function editExpense(id) {
    const expense = expenses.find(expense => expense.id === id);
    
    if (expense) {
        // In a real app, you would show a modal or form to edit the expense
        alert(`Edit functionality would open for: ${expense.title}`);
    }
}
