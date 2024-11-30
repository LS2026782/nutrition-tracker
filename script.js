// DOM Elements
const tabs = {
    'nutrition-tab': 'nutrition-section',
    'cardio-tab': 'cardio-section',
    'strength-tab': 'strength-section',
    'sleep-tab': 'sleep-section',
    'hydration-tab': 'hydration-section',
};

// Tab Navigation
Object.keys(tabs).forEach(tabId => {
    const tab = document.getElementById(tabId);
    const sectionId = tabs[tabId];
    tab?.addEventListener('click', () => {
        Object.values(tabs).forEach(section => {
            document.getElementById(section).style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
        Object.keys(tabs).forEach(id => document.getElementById(id)?.classList.remove('active'));
        tab?.classList.add('active');
    });
});

// Nutrition Tracker
const calorieGoal = document.getElementById('calorie-goal');
const caloriesConsumed = document.getElementById('calories-consumed');
const caloriesRemaining = document.getElementById('calories-remaining');
const mealList = document.getElementById('meal-list');
const goalForm = document.getElementById('goal-form');
const mealForm = document.getElementById('meal-form');

// Strength Workouts
const strengthForm = document.getElementById('strength-form');
const strengthWorkoutList = document.getElementById('strength-workout-list');

// Sleep Tracker
const sleepForm = document.getElementById('sleep-form');
const sleepHoursInput = document.getElementById('sleep-hours');
const sleepQualityInput = document.getElementById('sleep-quality');
const sleepTrendsChartCanvas = document.getElementById('sleep-trends-chart');
let sleepTrendsData = [];

// Hydration Tracker
const hydrationForm = document.getElementById('hydration-form');
const waterIntakeInput = document.getElementById('water-intake');
const hydrationGoal = document.getElementById('hydration-goal');
const waterConsumed = document.getElementById('water-consumed');
const hydrationProgress = document.getElementById('hydration-progress');

// Initialize App State
let currentUser = 'defaultUser'; // Default user setup
function initializeApp() {
    console.log(`Initializing app for user: ${currentUser}`);
    if (!localStorage.getItem(`userData_${currentUser}`)) {
        const defaultData = {
            calorieGoal: 0,
            caloriesConsumed: 0,
            meals: [],
            workouts: [],
            sleep: [],
            hydration: { consumed: 0, goal: 64 },
        };
        localStorage.setItem(`userData_${currentUser}`, JSON.stringify(defaultData));
    }
    loadUserData();
}

function saveUserData(data) {
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    if (!userData) return;

    // Nutrition
    calorieGoal.textContent = userData.calorieGoal;
    caloriesConsumed.textContent = userData.caloriesConsumed;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;

    // Hydration
    waterConsumed.textContent = userData.hydration.consumed;
    hydrationGoal.textContent = userData.hydration.goal;
    const hydrationPercent = (userData.hydration.consumed / userData.hydration.goal) * 100;
    hydrationProgress.style.width = `${hydrationPercent}%`;

    // Sleep Trends
    sleepTrendsData = userData.sleep || [];
    updateSleepTrendsChart();

    // Render Meals and Workouts
    mealList.innerHTML = '';
    userData.meals.forEach(meal => addMealToList(meal.name, meal.calories, false));

    strengthWorkoutList.innerHTML = '';
    userData.workouts.forEach(workout => addWorkoutToList(workout.exercise, workout.sets, workout.reps, workout.weight, false));
}

// Nutrition
goalForm.addEventListener('submit', event => {
    event.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    userData.calorieGoal = goal;
    saveUserData(userData);
    calorieGoal.textContent = goal;
    caloriesRemaining.textContent = goal - userData.caloriesConsumed;
    goalForm.reset();
});

mealForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    addMealToList(name, calories);
    mealForm.reset();
});

function addMealToList(name, calories, save = true) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = `${name}: ${calories} calories`;
    mealList.appendChild(listItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.meals.push({ name, calories });
        userData.caloriesConsumed += calories;
        saveUserData(userData);
        loadUserData();
    }
}

// Strength Workouts
strengthForm.addEventListener('submit', event => {
    event.preventDefault();
    const exercise = document.getElementById('exercise-name').value;
    const sets = parseInt(document.getElementById('sets').value, 10);
    const reps = parseInt(document.getElementById('reps').value, 10);
    const weight = parseInt(document.getElementById('weight').value, 10);
    addWorkoutToList(exercise, sets, reps, weight);
    strengthForm.reset();
});

function addWorkoutToList(exercise, sets, reps, weight, save = true) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = `${exercise}: ${sets} sets, ${reps} reps, ${weight} lbs`;
    strengthWorkoutList.appendChild(listItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.workouts.push({ exercise, sets, reps, weight });
        saveUserData(userData);
    }
}

// Sleep Tracker
sleepForm.addEventListener('submit', event => {
    event.preventDefault();
    const hours = parseInt(sleepHoursInput.value, 10);
    const quality = sleepQualityInput.value;
    sleepTrendsData.push({ hours, quality });
    updateSleepTrendsChart();
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    userData.sleep = sleepTrendsData;
    saveUserData(userData);
    sleepForm.reset();
});

function updateSleepTrendsChart() {
    const ctx = sleepTrendsChartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sleepTrendsData.map((_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Hours of Sleep',
                data: sleepTrendsData.map(entry => entry.hours),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }],
        },
        options: { responsive: true, maintainAspectRatio: false },
    });
}

// Hydration Tracker
hydrationForm.addEventListener('submit', event => {
    event.preventDefault();
    const intake = parseInt(waterIntakeInput.value, 10);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    userData.hydration.consumed += intake;
    saveUserData(userData);
    loadUserData();
    hydrationForm.reset();
});

// Initialize the app
document.addEventListener('DOMContentLoaded', initializeApp);
