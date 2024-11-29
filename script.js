// Initialize App State
let currentUser = null; // Track the logged-in user

function initializeApp() {
    currentUser = localStorage.getItem('loggedInUser');
    if (currentUser) {
        // Ensure userData is initialized
        if (!localStorage.getItem(`userData_${currentUser}`)) {
            localStorage.setItem(`userData_${currentUser}`, JSON.stringify({
                calorieGoal: 0,
                caloriesConsumed: 0,
                totalFats: 0,
                totalCarbs: 0,
                totalProtein: 0,
                meals: [],
                workouts: [],
            }));
        }
        loadUserData();
    } else {
        alert('No user logged in. Please set a current user.');
    }
}

// Save and Load User Data
function saveUserData(userData) {
    if (!currentUser) {
        alert('No user logged in. Cannot save data.');
        return;
    }
    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(userData));
}

function loadUserData() {
    if (!currentUser) {
        alert('No user logged in. Cannot load data.');
        return;
    }

    let userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
        calorieGoal: 0,
        caloriesConsumed: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalProtein: 0,
        meals: [],
        workouts: [],
    };

    // Ensure all fields exist in userData
    userData.meals = userData.meals || [];
    userData.workouts = userData.workouts || [];

    // Populate UI with saved data
    calorieGoal.textContent = userData.calorieGoal || 0;
    caloriesConsumed.textContent = userData.caloriesConsumed || 0;
    caloriesRemaining.textContent = userData.calorieGoal - userData.caloriesConsumed;
    totalFats.textContent = userData.totalFats || 0;
    totalCarbs.textContent = userData.totalCarbs || 0;
    totalProtein.textContent = userData.totalProtein || 0;

    // Populate meals
    mealList.innerHTML = ''; // Clear existing list
    userData.meals.forEach(meal => {
        addMealToList(meal.name, meal.calories, meal.fats, meal.carbs, meal.protein, false);
    });

    // Populate workouts
    cardioWorkoutList.innerHTML = ''; // Clear existing list
    userData.workouts.forEach(workout => {
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

        // Update userData
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

// Add Cardio Workout to the List
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

        // Update userData
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.workouts = userData.workouts.filter(
            workout => workout.time !== time || workout.distance !== distance
        );
        saveUserData(userData);
    });

    cardioItem.appendChild(deleteButton);
    cardioWorkoutList.appendChild(cardioItem);

    if (save) {
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
        userData.workouts.push({ time, distance, pace, heartRate });
        saveUserData(userData);
    }
}

// Event Listeners for Forms
goalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const goal = parseInt(document.getElementById('daily-goal').value, 10);
    calorieGoal.textContent = goal;
    caloriesRemaining.textContent = goal - parseInt(caloriesConsumed.textContent, 10);
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    userData.calorieGoal = goal;
    saveUserData(userData);
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

cardioForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const time = workoutTime.value;
    const dist = parseFloat(distance.value);
    const pace = averagePace.value;
    const heartRate = parseInt(averageHeartRate.value, 10);

    addCardioToList(time, dist, pace, heartRate);
    cardioForm.reset();
});

// Initialize App
initializeApp();














