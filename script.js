// Shared Utilities
function getUserData() {
    return JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
        nutrition: { calorieGoal: 0, caloriesConsumed: 0, meals: [] },
        workouts: { strength: [], cardio: [] },
        sleep: [],
        hydration: { goal: 64, consumed: 0 }
    };
}

function saveUserData(data) {
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
}

// Initialize App
let currentUser = 'defaultUser';

function initializeApp() {
    if (!localStorage.getItem(`userData_${currentUser}`)) {
        saveUserData(getUserData());
    }
}

// Tab-Specific Logic
const tabModules = {
    nutrition: () => {
        const calorieGoal = document.getElementById('calorie-goal');
        const caloriesConsumed = document.getElementById('calories-consumed');
        const caloriesRemaining = document.getElementById('calories-remaining');
        const mealForm = document.getElementById('meal-form');
        const mealList = document.getElementById('meal-list');

        function updateNutritionUI() {
            const userData = getUserData();
            const nutrition = userData.nutrition;

            calorieGoal.textContent = nutrition.calorieGoal;
            caloriesConsumed.textContent = nutrition.caloriesConsumed;
            caloriesRemaining.textContent = nutrition.calorieGoal - nutrition.caloriesConsumed;

            mealList.innerHTML = '';
            nutrition.meals.forEach(meal => {
                const mealItem = document.createElement('li');
                mealItem.textContent = `${meal.name}: ${meal.calories} calories`;
                mealList.appendChild(mealItem);
            });
        }

        mealForm.addEventListener('submit', event => {
            event.preventDefault();
            const mealName = document.getElementById('meal-name').value;
            const mealCalories = parseInt(document.getElementById('calories').value, 10);

            const userData = getUserData();
            userData.nutrition.meals.push({ name: mealName, calories: mealCalories });
            userData.nutrition.caloriesConsumed += mealCalories;
            saveUserData(userData);
            updateNutritionUI();
            mealForm.reset();
        });

        updateNutritionUI();
    },

    workouts: () => {
        const workoutList = document.getElementById('strength-workout-list');
        const workoutForm = document.getElementById('strength-form');

        function updateWorkoutsUI() {
            const userData = getUserData();
            const strengthWorkouts = userData.workouts.strength;

            workoutList.innerHTML = '';
            strengthWorkouts.forEach(workout => {
                const listItem = document.createElement('li');
                listItem.textContent = `${workout.name}: ${workout.sets} sets, ${workout.reps} reps, ${workout.weight} lbs`;
                workoutList.appendChild(listItem);
            });
        }

        workoutForm.addEventListener('submit', event => {
            event.preventDefault();
            const exerciseName = document.getElementById('exercise-name').value;
            const sets = parseInt(document.getElementById('sets').value, 10);
            const reps = parseInt(document.getElementById('reps').value, 10);
            const weight = parseInt(document.getElementById('weight').value, 10);

            const userData = getUserData();
            userData.workouts.strength.push({ name: exerciseName, sets, reps, weight });
            saveUserData(userData);
            updateWorkoutsUI();
            workoutForm.reset();
        });

        updateWorkoutsUI();
    },

    sleep: () => {
        const sleepForm = document.getElementById('sleep-form');
        const sleepTrendsCanvas = document.getElementById('sleep-trends-chart');
        let sleepTrendsChart;

        function updateSleepUI() {
            const userData = getUserData();
            const sleepData = userData.sleep;

            const ctx = sleepTrendsCanvas.getContext('2d');
            if (sleepTrendsChart) sleepTrendsChart.destroy();

            sleepTrendsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sleepData.map((_, i) => `Day ${i + 1}`),
                    datasets: [{
                        label: 'Hours of Sleep',
                        data: sleepData.map(entry => entry.hours),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }]
                },
                options: { responsive: true }
            });
        }

        sleepForm.addEventListener('submit', event => {
            event.preventDefault();
            const hours = parseInt(document.getElementById('sleep-hours').value, 10);
            const quality = document.getElementById('sleep-quality').value;

            const userData = getUserData();
            userData.sleep.push({ hours, quality, date: new Date().toISOString().split('T')[0] });
            saveUserData(userData);
            updateSleepUI();
            sleepForm.reset();
        });

        updateSleepUI();
    },

    hydration: () => {
        const hydrationForm = document.getElementById('hydration-form');
        const waterConsumed = document.getElementById('water-consumed');
        const hydrationProgress = document.getElementById('hydration-progress');

        function updateHydrationUI() {
            const userData = getUserData();
            const hydration = userData.hydration;

            waterConsumed.textContent = hydration.consumed;
            const percent = (hydration.consumed / hydration.goal) * 100;
            hydrationProgress.style.width = `${percent}%`;
        }

        hydrationForm.addEventListener('submit', event => {
            event.preventDefault();
            const intake = parseInt(document.getElementById('water-intake').value, 10);

            const userData = getUserData();
            userData.hydration.consumed += intake;
            saveUserData(userData);
            updateHydrationUI();
            hydrationForm.reset();
        });

        updateHydrationUI();
    }
};

// Initialize Tab Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    // Activate Modules by Tab
    tabModules.nutrition();
    tabModules.workouts();
    tabModules.sleep();
    tabModules.hydration();
});
