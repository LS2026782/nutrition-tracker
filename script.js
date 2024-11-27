// DOM Elements
const loginSection = document.getElementById('login-section');
const logoutSection = document.getElementById('logout-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password'); // Optional password handling
const logoutButton = document.getElementById('logout-button');

// Nutrition DOM Elements
const calorieGoal = document.getElementById('calorie-goal');
const caloriesConsumed = document.getElementById('calories-consumed');
const caloriesRemaining = document.getElementById('calories-remaining');
const totalFats = document.getElementById('total-fats');
const totalCarbs = document.getElementById('total-carbs');
const totalProtein = document.getElementById('total-protein');
const mealList = document.getElementById('meal-list');
const goalForm = document.getElementById('goal-form');
const mealForm = document.getElementById('meal-form');

// Cardio DOM Elements
const cardioForm = document.getElementById('cardio-form');
const cardioWorkoutList = document.getElementById('cardio-workout-list');

// Navigation Logic
const nutritionTab = document.getElementById('nutrition-tab');
const cardioTab = document.getElementById('cardio-tab');
const nutritionSection = document.getElementById('nutrition-section');
const cardioSection = document.getElementById('cardio-section');

// App State
let currentUser = null;

// Initialize App
function initializeApp() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        currentUser = loggedInUser;
        showUserUI(loggedInUser);
        loadUserData();
    } else {
        showLoginUI();
    }
}

// Login Functionality
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim(); // Optional: Add password validation if needed

    if (username) {
        currentUser = username;
        localStorage.setItem('loggedInUser', username);

        if (!localStorage.getItem(`userData_${username}`)) {
            localStorage.setItem(
                `userData_${username}`,
                JSON.stringify({
                    calorieGoal: 0,
                    caloriesConsumed: 0,
                    totalFats: 0,
                    totalCarbs: 0,
                    totalProtein: 0,
                    meals: [],
                    cardioWorkouts: [],
                })
            );
        }

        showUserUI(username);
    }

    loginForm.reset();
});

// Logout Functionality
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    currentUser = null;
    showLoginUI();
});

// Tab Navigation
nutritionTab.addEventListener('click', () => {
    nutritionSection.style.display = 'block';
    cardioSection.style.display = 'none';
    nutritionTab.classList.add('active');
    cardioTab.classList.remove('active');
    loadUserData(); // Reload nutrition data when switching tabs
});

cardioTab.addEventListener('click', () => {
    cardioSection.style.display = 'block';
    nutritionSection.style.display = 'none';
    cardioTab.classList.add('active');
    nutritionTab.classList.remove('active');
    loadCardioData(); // Reload cardio data when switching tabs
});

// Show User UI
function showUserUI(username) {
    loginSection.style.display = 'none';
    logoutSection.style.display = 'block';
    document.querySelector('h1').textContent = `Welcome, ${username}!`;

    loadUserData();
}

// Show Login UI
function showLoginUI() {
    loginSection.style.display = 'block';
    logoutSection.style.display = 'none';
    document.querySelector('h1').textContent = 'Welcome to Health Tracker';

    resetTracker();
}

// Save User Data
function saveUserData(data) {
    if (currentUser) {
        localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
    }
}

// Load User Data
function loadUserData() {
    if (!currentUser) return;

    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
        calorieGoal: 0,
        caloriesConsumed: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
        meals: [],
        cardioWorkouts: [],
    };

    // Populate Nutrition UI
    calorieGoal.textContent = userData.calorieGoal || 0;
    caloriesConsumed.textContent = userData.caloriesConsumed || 0;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
    totalFats.textContent = userData.totalFats || 0;
    totalCarbs.textContent = userData.totalCarbs || 0;
    totalProtein.textContent = userData.totalProtein || 0;

    mealList.innerHTML = ''; // Clear existing meal list
    userData.meals.forEach((meal) => {
        addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false);
    });

    // Populate Cardio UI
    cardioWorkoutList.innerHTML = ''; // Clear existing cardio list
    userData.cardioWorkouts.forEach((workout) => {
        addWorkoutToList(workout, false);
    });
}

// Add Meal to List
function addMealToList(name, calories, fats, carbs, protein, save = true) {
    const mealItem = document.createElement('li');
    mealItem.classList.add('list-group-item');
    mealItem.textContent = `${name}: ${calories} calories, ${fats}g fats, ${carbs}g carbs, ${protein}g protein`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.addEventListener('click', () => {
        mealList.removeChild(mealItem);
        updateNutritionTotals(-calories, -fats, -carbs, -protein);
        saveUserData(getCurrentUserData());
    });

    mealItem.appendChild(deleteButton);
    mealList.appendChild(mealItem);

    if (save) {
        updateNutritionTotals(calories, fats, carbs, protein);
        saveUserData(getCurrentUserData());
    }
}

// Add Cardio Workout to List
function addWorkoutToList(workout, save = true) {
    const workoutItem = document.createElement('li');
    workoutItem.classList.add('list-group-item');
    workoutItem.textContent = `Workout Time: ${workout.workoutTime}, Distance: ${workout.distance} miles, Average Pace: ${workout.averagePace}, Heart Rate: ${workout.averageHeartRate} bpm`;

    cardioWorkoutList.appendChild(workoutItem);

    if (save) {
        const userData = getCurrentUserData();
        userData.cardioWorkouts.push(workout);
        saveUserData(userData);
    }
}

// Update Nutrition Totals
function updateNutritionTotals(calories, fats, carbs, protein) {
    const currentCalories = parseInt(caloriesConsumed.textContent, 10) || 0;
    const currentFats = parseInt(totalFats.textContent, 10) || 0;
    const currentCarbs = parseInt(totalCarbs.textContent, 10) || 0;
    const currentProtein = parseInt(totalProtein.textContent, 10) || 0;

    caloriesConsumed.textContent = currentCalories + calories;
    totalFats.textContent = currentFats + fats;
    totalCarbs.textContent = currentCarbs + carbs;
    totalProtein.textContent = currentProtein + protein;

    caloriesRemaining.textContent = parseInt(calorieGoal.textContent, 10) - parseInt(caloriesConsumed.textContent, 10);
}

// Reset Tracker
function resetTracker() {
    calorieGoal.textContent = 0;
    caloriesConsumed.textContent = 0;
    caloriesRemaining.textContent = 0;
    totalFats.textContent = 0;
    totalCarbs.textContent = 0;
    totalProtein.textContent = 0;
    mealList.innerHTML = '';
    cardioWorkoutList.innerHTML = '';
}

// Event Listeners
goalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    calorieGoal.textContent = goal;
    caloriesRemaining.textContent = goal - parseInt(caloriesConsumed.textContent, 10);
    saveUserData(getCurrentUserData());
    goalForm.reset();
});

mealForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);

    addMealToList(name, calories, fats, carbs, protein);
    mealForm.reset();
});

cardioForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const workoutTime = document.getElementById('workout-time').value;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const averagePace = document.getElementById('average-pace').value;
    const averageHeartRate = parseInt(document.getElementById('average-heart-rate').value, 10) || 0;

    const workout = { workoutTime, distance, averagePace, averageHeartRate };
    addWorkoutToList(workout);
    cardioForm.reset();
});

// Helper to Get Current User Data
function getCurrentUserData() {
    return JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
        calorieGoal: 0,
        caloriesConsumed: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
        meals: [],
        cardioWorkouts: [],
    };
}

// Initialize App
initializeApp();




