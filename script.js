// DOM Elements
const loginSection = document.getElementById('login-section');
const logoutSection = document.getElementById('logout-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password'); // Optional password handling
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

// Cardio Section DOM Elements
const cardioForm = document.getElementById('cardio-form');
const workoutTime = document.getElementById('workout-time');
const distance = document.getElementById('distance');
const averagePace = document.getElementById('average-pace');
const averageHeartRate = document.getElementById('average-heart-rate');
const cardioWorkoutList = document.getElementById('cardio-workout-list');

// Navigation Logic
const nutritionTab = document.getElementById('nutrition-tab');
const cardioTab = document.getElementById('cardio-tab');
const nutritionSection = document.getElementById('nutrition-section');
const cardioSection = document.getElementById('cardio-section');

// Handle Tab Navigation
nutritionTab.addEventListener('click', () => {
    nutritionSection.style.display = 'block';
    cardioSection.style.display = 'none';
    nutritionTab.classList.add('active');
    cardioTab.classList.remove('active');
});

cardioTab.addEventListener('click', () => {
    cardioSection.style.display = 'block';
    nutritionSection.style.display = 'none';
    cardioTab.classList.add('active');
    nutritionTab.classList.remove('active');
});

// Initialize App State
let currentUser = null; // Track the logged-in user

function initializeApp() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        currentUser = loggedInUser;
        loadUserData();
    }
}

// Save and Load User Data
function saveUserData(data) {
    if (currentUser) {
        localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
    }
}

function loadUserData() {
    if (!currentUser) return;

    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
        calorieGoal: 0,
        caloriesConsumed: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
        meals: []
    };

    // Populate UI with saved data
    calorieGoal.textContent = userData.calorieGoal || 0;
    caloriesConsumed.textContent = userData.caloriesConsumed || 0;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
    totalFats.textContent = userData.totalFats || 0;
    totalCarbs.textContent = userData.totalCarbs || 0;
    totalProtein.textContent = userData.totalProtein || 0;

    // Populate the meal list
    mealList.innerHTML = ''; // Clear existing list
    userData.meals.forEach(meal => {
        addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false);
    });
}

// Add Meal to the List
function addMealToList(name, calories, fats, carbs, protein, save = true) {
    const mealItem = document.createElement('li');
    mealItem.classList.add('list-group-item');
    mealItem.textContent = `${name}: ${calories} calories, ${fats}g fats, ${carbs}g carbs, ${protein}g protein`;

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.addEventListener('click', function () {
        mealList.removeChild(mealItem);
    });

    mealItem.appendChild(deleteButton);
    mealList.appendChild(mealItem);
}

// Initialize App
initializeApp();









