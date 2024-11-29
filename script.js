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
        meals: [],
        cardioWorkouts: []
    };

    // Populate UI with saved data
    calorieGoal.textContent = userData.calorieGoal || 0;
    caloriesConsumed.textContent = userData.caloriesConsumed || 0;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
    totalFats.textContent = userData.totalFats || 0;
    totalCarbs.textContent = userData.totalCarbs || 0;
    totalProtein.textContent = userData.totalProtein || 0;

    // Populate the meal list
    mealList.innerHTML = '';
    userData.meals.forEach(meal => {
        addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false);
    });

    // Populate the cardio workout list
    cardioWorkoutList.innerHTML = '';
    userData.cardioWorkouts.forEach(workout => {
        addCardioToList(workout.time, workout.distance, workout.pace, workout.heartRate, false);
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

        // Update data
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
        userData.meals = userData.meals.filter(meal => meal.name !== name);
        saveUserData(userData);
    });

    mealItem.appendChild(deleteButton);
    mealList.appendChild(mealItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
        userData.meals.push({ name, calories, fats, carbs, protein });
        userData.caloriesConsumed += calories;
        userData.totalFats += fats;
        userData.totalCarbs += carbs;
        userData.totalProtein += protein;
        saveUserData(userData);
    }
}

// Add Cardio to the List
function addCardioToList(time, distance, pace, heartRate, save = true) {
    const cardioItem = document.createElement('li');
    cardioItem.classList.add('list-group-item');
    cardioItem.textContent = `Time: ${time}, Distance: ${distance} miles, Pace: ${pace}, Heart Rate: ${heartRate} bpm`;

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.addEventListener('click', function () {
        cardioWorkoutList.removeChild(cardioItem);

        // Update data
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
        userData.cardioWorkouts = userData.cardioWorkouts.filter(workout => workout.time !== time);
        saveUserData(userData);
    });

    cardioItem.appendChild(deleteButton);
    cardioWorkoutList.appendChild(cardioItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
        userData.cardioWorkouts.push({ time, distance, pace, heartRate });
        saveUserData(userData);
    }
}

// Event Listeners for Forms
goalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
    userData.calorieGoal = goal;
    saveUserData(userData);

    calorieGoal.textContent = goal;
    caloriesRemaining.textContent = goal - parseInt(caloriesConsumed.textContent, 10);
    goalForm.reset();
});

mealForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);

    if (name && !isNaN(calories) && !isNaN(fats) && !isNaN(carbs) && !isNaN(protein)) {
        addMealToList(name, calories, fats, carbs, protein);
    }
    mealForm.reset();
});

cardioForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const time = workoutTime.value;
    const dist = parseFloat(distance.value);
    const pace = averagePace.value;
    const heartRate = parseInt(averageHeartRate.value, 10);

    if (time && !isNaN(dist) && pace && !isNaN(heartRate)) {
        addCardioToList(time, dist, pace, heartRate);
    }
    cardioForm.reset();
});

// Initialize App
initializeApp();











