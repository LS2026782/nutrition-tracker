// Global Variables
let currentDate = new Date().toISOString().split('T')[0];
let currentUser = 'defaultUser';

// Utilities for Local Storage
function getUserData() {
    const allData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
    return allData[currentDate] || {
        calorieGoal: 2000,
        proteinGoal: 150,
        carbGoal: 225,
        fatGoal: 65,
        meals: [],
        workouts: { cardio: [], strength: [], history: [] },
        sleep: [],
        hydration: { goal: 64, consumed: 0 },
    };
}

function saveUserData(data) {
    const allData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {};
    allData[currentDate] = data;
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(allData));
}

// Tab Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const tabs = {
        'nutrition-tab': 'nutrition-section',
        'cardio-tab': 'cardio-section',
        'strength-tab': 'strength-section',
        'sleep-tab': 'sleep-section',
        'hydration-tab': 'hydration-section',
    };

    Object.keys(tabs).forEach(tabId => {
        const tab = document.getElementById(tabId);
        tab.addEventListener('click', () => {
            Object.values(tabs).forEach(sectionId => {
                document.getElementById(sectionId).style.display = 'none';
            });
            Object.keys(tabs).forEach(id => document.getElementById(id).classList.remove('active'));
            document.getElementById(tabs[tabId]).style.display = 'block';
            tab.classList.add('active');
        });
    });

    updateNutritionUI();
    tabModules.cardio();
    tabModules.strength();
    tabModules.sleep();
    tabModules.hydration();
});

// Update UI when date changes
document.getElementById('calendar-picker').addEventListener('change', (event) => {
    currentDate = event.target.value;
    updateNutritionUI();
});

// Nutrition Tab Logic
function updateNutritionUI() {
    const userData = getUserData();

    document.getElementById('calorie-goal-input').value = userData.calorieGoal;
    document.getElementById('protein-goal-input').value = userData.proteinGoal;
    document.getElementById('carb-goal-input').value = userData.carbGoal;
    document.getElementById('fat-goal-input').value = userData.fatGoal;

    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';
    userData.meals.forEach((meal, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
            ${meal.name}: ${meal.calories} cal, ${meal.protein}g protein, 
            ${meal.carbs}g carbs, ${meal.fats}g fats
            <button class="btn btn-sm btn-warning float-end mx-2 edit-meal" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-danger float-end delete-meal" data-index="${index}">Delete</button>
        `;
        mealList.appendChild(listItem);
    });

    const ctx = document.getElementById('nutrition-pie-chart').getContext('2d');
    const protein = userData.meals.reduce((sum, meal) => sum + meal.protein, 0);
    const carbs = userData.meals.reduce((sum, meal) => sum + meal.carbs, 0);
    const fats = userData.meals.reduce((sum, meal) => sum + meal.fats, 0);
    if (window.nutritionChart) window.nutritionChart.destroy();
    window.nutritionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Protein', 'Carbs', 'Fats'],
            datasets: [{
                data: [protein, carbs, fats],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            }],
        },
    });
}

document.getElementById('meal-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const mealName = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);

    const userData = getUserData();
    userData.meals.push({ name: mealName, calories, protein, carbs, fats });
    saveUserData(userData);

    updateNutritionUI();
    event.target.reset();
});

document.getElementById('meal-list').addEventListener('click', (event) => {
    const target = event.target;
    const userData = getUserData();
    const index = target.dataset.index;

    if (target.classList.contains('delete-meal')) {
        userData.meals.splice(index, 1);
        saveUserData(userData);
        updateNutritionUI();
    }

    if (target.classList.contains('edit-meal')) {
        const meal = userData.meals[index];
        document.getElementById('meal-name').value = meal.name;
        document.getElementById('calories').value = meal.calories;
        document.getElementById('protein').value = meal.protein;
        document.getElementById('carbs').value = meal.carbs;
        document.getElementById('fats').value = meal.fats;

        userData.meals.splice(index, 1);
        saveUserData(userData);
        updateNutritionUI();
    }
});

document.getElementById('goal-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const calorieGoal = parseInt(document.getElementById('calorie-goal-input').value, 10);
    const proteinGoal = parseInt(document.getElementById('protein-goal-input').value, 10);
    const carbGoal = parseInt(document.getElementById('carb-goal-input').value, 10);
    const fatGoal = parseInt(document.getElementById('fat-goal-input').value, 10);

    const userData = getUserData();
    userData.calorieGoal = calorieGoal;
    userData.proteinGoal = proteinGoal;
    userData.carbGoal = carbGoal;
    userData.fatGoal = fatGoal;

    saveUserData(userData);
    updateNutritionUI();
});

const tabModules = {
    cardio: () => {
        const cardioForm = document.getElementById('cardio-form');
        const cardioWorkoutList = document.getElementById('cardio-workout-list');
        const cardioTrendsChart = document.getElementById('cardio-trends-chart');
        let trendsChart;

        cardioForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const userData = getUserData();
            const time = parseInt(document.getElementById('cardio-time').value, 10);
            const distance = parseFloat(document.getElementById('distance').value);
            const pace = document.getElementById('pace').value;
            const calories = parseInt(document.getElementById('calories-burned').value, 10);

            userData.workouts.cardio.push({ time, distance, pace, calories, date: currentDate });
            saveUserData(userData);
            updateCardioUI();
        });

        function updateCardioUI() {
            // Implementation for updating Cardio UI
        }
    },

    strength: () => {
        const createWorkoutForm = document.getElementById('create-workout-form');
        const workoutPlan = document.getElementById('workout-plan');

        createWorkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const userData = getUserData();
            const exerciseName = document.getElementById('exercise-name').value;
            const sets = parseInt(document.getElementById('sets').value, 10);
            const reps = parseInt(document.getElementById('reps').value, 10);
            const weight = parseInt(document.getElementById('weight').value, 10);

            userData.workouts.strength.push({ name: exerciseName, sets, reps, weight });
            saveUserData(userData);
            updateStrengthUI();
        });

        function updateStrengthUI() {
            // Implementation for updating Strength UI
        }
    },

    sleep: () => {
        const sleepForm = document.getElementById('sleep-form');

        sleepForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const userData = getUserData();
            const hours = parseInt(document.getElementById('sleep-hours').value, 10);
            const quality = document.getElementById('sleep-quality').value;

            userData.sleep.push({ hours, quality, date: currentDate });
            saveUserData(userData);
            updateSleepUI();
        });

        function updateSleepUI() {
            // Implementation for updating Sleep UI
        }
    },

    hydration: () => {
        const hydrationForm = document.getElementById('hydration-form');

        hydrationForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const userData = getUserData();
            const intake = parseInt(document.getElementById('water-intake').value, 10);

            userData.hydration.consumed += intake;
            saveUserData(userData);
            updateHydrationUI();
        });

        function updateHydrationUI() {
            // Implementation for updating Hydration UI
        }
    },
};
