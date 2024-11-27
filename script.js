// DOM Elements
const loginSection = document.getElementById('login-section');
const logoutSection = document.getElementById('logout-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password'); // Optional for password
const logoutButton = document.getElementById('logout-button');
const calorieGoal = document.getElementById('calorie-goal');
const caloriesConsumed = document.getElementById('calories-consumed');
const caloriesRemaining = document.getElementById('calories-remaining');
const totalFats = document.getElementById('total-fats');
const totalCarbs = document.getElementById('total-carbs');
const totalProtein = document.getElementById('total-protein');
const mealList = document.getElementById('meal-list');
const goalForm = document.getElementById('goal-form');
const mealForm = document.getElementById('meal-form');

// Initialize App State
function initializeApp() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        showUserUI(loggedInUser);
        loadUserData();
    } else {
        showLoginUI();
    }
}

// Login Functionality
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim(); // Optional password logic

    if (username) {
        // Save the logged-in user to localStorage
        localStorage.setItem('loggedInUser', username);

        // Save fresh user data to avoid duplication
        if (!localStorage.getItem('userData')) {
            localStorage.setItem('userData', JSON.stringify({
                calorieGoal: 0,
                caloriesConsumed: 0,
                totalFats: 0,
                totalCarbs: 0,
                totalProtein: 0,
                meals: []
            }));
        }

        // Update the UI
        showUserUI(username);
    }

    // Clear the input
    loginForm.reset();
});

// Logout Functionality
logoutButton.addEventListener('click', function () {
    // Remove the logged-in user from localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userData');
    showLoginUI();
});

// Show the User Interface After Login
function showUserUI(username) {
    loginSection.style.display = 'none';
    logoutSection.style.display = 'block';
    document.querySelector('h1').textContent = `Welcome, ${username}!`;

    // Load user-specific data
    loadUserData();
}

// Show the Login Interface
function showLoginUI() {
    loginSection.style.display = 'block';
    logoutSection.style.display = 'none';
    document.querySelector('h1').textContent = 'Welcome to Nutrition Tracker';

    // Reset the tracker UI
    resetTracker();
}

// Save and Load User-Specific Data
function saveUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        calorieGoal: 0,
        caloriesConsumed: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
        meals: []
    };

    // Populate the tracker
    calorieGoal.textContent = userData.calorieGoal || 0;
    caloriesConsumed.textContent = userData.caloriesConsumed || 0;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
    totalFats.textContent = userData.totalFats || 0;
    totalCarbs.textContent = userData.totalCarbs || 0;
    totalProtein.textContent = userData.totalProtein || 0;

    // Populate the meal list
    mealList.innerHTML = '';
    userData.meals.forEach(meal => addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false));
}

// Add Meal to the List
function addMealToList(name, calories, fats, carbs, protein, save = true) {
    const mealItem = document.createElement('li');
    mealItem.classList.add('list-group-item');
    mealItem.textContent = `${name}: ${calories} calories, ${fats}g fats, ${carbs}g carbs, ${protein}g protein`;

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.addEventListener('click', function () {
        mealList.removeChild(mealItem);
        updateTotals(-calories, -fats, -carbs, -protein);
        saveUpdatedData();
    });

    mealItem.appendChild(deleteButton);
    mealList.appendChild(mealItem);

    if (save) {
        updateTotals(calories, fats, carbs, protein);
        saveUpdatedData();
    }
}

// Save Updated Data
function saveUpdatedData() {
    const updatedData = {
        calorieGoal: parseInt(calorieGoal.textContent, 10),
        caloriesConsumed: parseInt(caloriesConsumed.textContent, 10),
        totalFats: parseInt(totalFats.textContent, 10),
        totalCarbs: parseInt(totalCarbs.textContent, 10),
        totalProtein: parseInt(totalProtein.textContent, 10),
        meals: Array.from(mealList.children).map(item => {
            const [name, calories, fats, carbs, protein] = item.textContent.match(/[^:\s]+/g);
            return { name, calories, fats, carbs, protein };
        })
    };
    saveUserData(updatedData);
}

// Reset the Tracker
function resetTracker() {
    calorieGoal.textContent = 0;
    caloriesConsumed.textContent = 0;
    caloriesRemaining.textContent = 0;
    totalFats.textContent = 0;
    totalCarbs.textContent = 0;
    totalProtein.textContent = 0;
    mealList.innerHTML = '';
}

// Event Listeners for Forms
goalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    calorieGoal.textContent = goal;
    caloriesRemaining.textContent = goal - parseInt(caloriesConsumed.textContent, 10);
    saveUpdatedData();
    goalForm.reset();
});

mealForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);

    addMealToList(name, calories, fats, carbs, protein);
    mealForm.reset();
});

// Initialize the App
initializeApp();
