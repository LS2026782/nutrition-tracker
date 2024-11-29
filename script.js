// DOM Elements
const calorieGoal = document.getElementById('calorie-goal');
const caloriesConsumed = document.getElementById('calories-consumed');
const caloriesRemaining = document.getElementById('calories-remaining');
const totalFats = document.getElementById('total-fats');
const totalCarbs = document.getElementById('total-carbs');
const totalProtein = document.getElementById('total-protein');
const mealList = document.getElementById('meal-list');
const cardioWorkoutList = document.getElementById('cardio-workout-list');
const goalForm = document.getElementById('goal-form');
const mealForm = document.getElementById('meal-form');
const cardioForm = document.getElementById('cardio-form');

let currentUser = "testUser"; // For simplicity, use a static user for now

// Save user data
function saveUserData(data) {
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
        calorieGoal: 0,
        caloriesConsumed: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
        meals: [],
        cardioWorkouts: []
    };

    calorieGoal.textContent = userData.calorieGoal;
    caloriesConsumed.textContent = userData.caloriesConsumed;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
    totalFats.textContent = userData.totalFats;
    totalCarbs.textContent = userData.totalCarbs;
    totalProtein.textContent = userData.totalProtein;

    mealList.innerHTML = '';
    userData.meals.forEach(meal => addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false));

    cardioWorkoutList.innerHTML = '';
    userData.cardioWorkouts.forEach(workout => addCardioToList(workout.time, workout.distance, workout.pace, workout.heartRate, false));
}

// Add meal to list
function addMealToList(name, calories, fats, carbs, protein, save = true) {
    const mealItem = document.createElement('li');
    mealItem.classList.add('list-group-item');
    mealItem.textContent = `${name}: ${calories} calories, ${fats}g fats, ${carbs}g carbs, ${protein}g protein`;

    mealList.appendChild(mealItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
        userData.meals = userData.meals || [];
        userData.meals.push({ name, calories, fats, carbs, protein });
        saveUserData(userData);
    }
}

// Add cardio workout to list
function addCardioToList(time, distance, pace, heartRate, save = true) {
    const cardioItem = document.createElement('li');
    cardioItem.classList.add('list-group-item');
    cardioItem.textContent = `Time: ${time}, Distance: ${distance} miles, Pace: ${pace}, Heart Rate: ${heartRate} bpm`;

    cardioWorkoutList.appendChild(cardioItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
        userData.cardioWorkouts = userData.cardioWorkouts || [];
        userData.cardioWorkouts.push({ time, distance, pace, heartRate });
        saveUserData(userData);
    }
}

// Event Listeners
goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
    userData.calorieGoal = goal;
    saveUserData(userData);
    loadUserData();
});

mealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);
    addMealToList(name, calories, fats, carbs, protein);
    mealForm.reset();
});

cardioForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const time = document.getElementById('workout-time').value;
    const distance = parseFloat(document.getElementById('distance').value);
    const pace = document.getElementById('average-pace').value;
    const heartRate = parseInt(document.getElementById('average-heart-rate').value, 10);
    addCardioToList(time, distance, pace, heartRate);
    cardioForm.reset();
});

// Initialize app
loadUserData();












