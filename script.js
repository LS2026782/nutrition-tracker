// DOM Elements
const calorieGoal = document.getElementById('calorie-goal');
const caloriesConsumed = document.getElementById('calories-consumed');
const caloriesRemaining = document.getElementById('calories-remaining');
const totalFats = document.getElementById('total-fats');
const totalCarbs = document.getElementById('total-carbs');
const totalProtein = document.getElementById('total-protein');
const mealList = document.getElementById('meal-list');
const goalForm = document.getElementById('goal-form');
const mealForm = document.getElementById('meal-form');
const cardioForm = document.getElementById('cardio-form');
const workoutTime = document.getElementById('workout-time');
const distance = document.getElementById('distance');
const averagePace = document.getElementById('average-pace');
const averageHeartRate = document.getElementById('average-heart-rate');
const cardioWorkoutList = document.getElementById('cardio-workout-list');

// Tab Navigation Logic
const nutritionTab = document.getElementById('nutrition-tab');
const cardioTab = document.getElementById('cardio-tab');
const nutritionSection = document.getElementById('nutrition-section');
const cardioSection = document.getElementById('cardio-section');

// Debug Logs
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    console.log("Checking all required DOM elements...");
    console.log("nutritionTab:", nutritionTab);
    console.log("cardioTab:", cardioTab);
    console.log("nutritionSection:", nutritionSection);
    console.log("cardioSection:", cardioSection);

    initializeApp();
});

// Tab Event Listeners
nutritionTab?.addEventListener('click', () => {
    console.log('Switching to Nutrition Tab');
    nutritionSection.style.display = 'block';
    cardioSection.style.display = 'none';
    nutritionTab.classList.add('active');
    cardioTab.classList.remove('active');
});

cardioTab?.addEventListener('click', () => {
    console.log('Switching to Cardio Tab');
    cardioSection.style.display = 'block';
    nutritionSection.style.display = 'none';
    cardioTab.classList.add('active');
    nutritionTab.classList.remove('active');
});

// Initialize App State
let currentUser = 'defaultUser'; // Default user setup
function initializeApp() {
    console.log(`Initializing app for user: ${currentUser}`);
    if (!localStorage.getItem(`userData_${currentUser}`)) {
        console.log(`Creating default data for userData_${currentUser}`);
        const defaultData = {
            calorieGoal: 0,
            caloriesConsumed: 0,
            totalFats: 0,
            totalCarbs: 0,
            totalProtein: 0,
            meals: [],
            workouts: [],
        };
        localStorage.setItem(`userData_${currentUser}`, JSON.stringify(defaultData));
    }
    loadUserData();
}

// Save and Load User Data
function saveUserData(data) {
    console.log(`Saving data to localStorage with key: userData_${currentUser}`, data);
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
}

function loadUserData() {
    console.log(`Accessing localStorage with key: userData_${currentUser}`);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));

    if (userData) {
        if (calorieGoal) calorieGoal.textContent = userData.calorieGoal || 0;
        if (caloriesConsumed) caloriesConsumed.textContent = userData.caloriesConsumed || 0;
        if (caloriesRemaining) caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
        if (totalFats) totalFats.textContent = userData.totalFats || 0;
        if (totalCarbs) totalCarbs.textContent = userData.totalCarbs || 0;
        if (totalProtein) totalProtein.textContent = userData.totalProtein || 0;

        mealList.innerHTML = '';
        userData.meals.forEach(meal => {
            addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false);
        });

        cardioWorkoutList.innerHTML = '';
        userData.workouts.forEach(workout => {
            addCardioToList(workout.time, workout.distance, workout.pace, workout.heartRate, false);
        });
    } else {
        console.error("No userData found in localStorage for key:", `userData_${currentUser}`);
    }
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
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.meals = userData.meals.filter(meal => meal.name !== name);
        saveUserData(userData);
    });

    mealItem.appendChild(deleteButton);
    mealList.appendChild(mealItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.meals.push({ name, calories, fats, carbs, protein });
        saveUserData(userData);
    }
}

// Add Cardio Workout to List
function addCardioToList(time, distance, pace, heartRate, save = true) {
    const workoutItem = document.createElement('li');
    workoutItem.classList.add('list-group-item');
    workoutItem.textContent = `Time: ${time}, Distance: ${distance} miles, Pace: ${pace}, Heart Rate: ${heartRate} bpm`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.addEventListener('click', () => {
        cardioWorkoutList.removeChild(workoutItem);
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.workouts = userData.workouts.filter(
            workout => workout.time !== time || workout.distance !== distance
        );
        saveUserData(userData);
    });

    workoutItem.appendChild(deleteButton);
    cardioWorkoutList.appendChild(workoutItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.workouts.push({ time, distance, pace, heartRate });
        saveUserData(userData);
    }
}

// Event Listeners for Forms
goalForm.addEventListener('submit', event => {
    event.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    console.log('Setting Calorie Goal:', goal);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    userData.calorieGoal = goal;
    saveUserData(userData);
    calorieGoal.textContent = goal;
    caloriesRemaining.textContent = goal - parseInt(caloriesConsumed.textContent, 10);
    goalForm.reset();
});

mealForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);
    console.log('Logging Meal:', { name, calories, fats, carbs, protein });
    addMealToList(name, calories, fats, carbs, protein);
    mealForm.reset();
});

cardioForm.addEventListener('submit', event => {
    event.preventDefault();
    const time = workoutTime.value;
    const dist = parseFloat(distance.value);
    const pace = averagePace.value;
    const heartRate = parseInt(averageHeartRate.value, 10);
    console.log('Logging Cardio Workout:', { time, dist, pace, heartRate });
    addCardioToList(time, dist, pace, heartRate);
    cardioForm.reset();
});








