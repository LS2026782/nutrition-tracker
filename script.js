// Get references to form, meal list, and nutrient totals
const form = document.getElementById('meal-form');
const mealList = document.getElementById('meal-list');
const caloriesConsumed = document.getElementById('calories-consumed');
const totalFats = document.getElementById('total-fats');
const totalCarbs = document.getElementById('total-carbs');
const totalProtein = document.getElementById('total-protein');

// Get references for nutrient goals
const calorieGoal = document.getElementById('calorie-goal');
const fatGoal = document.getElementById('fat-goal');
const carbGoal = document.getElementById('carb-goal');
const proteinGoal = document.getElementById('protein-goal');

// Get references for remaining nutrients
const caloriesRemaining = document.getElementById('calories-remaining');
const fatRemaining = document.getElementById('fat-remaining');
const carbRemaining = document.getElementById('carb-remaining');
const proteinRemaining = document.getElementById('protein-remaining');

// Get goal form inputs
const goalForm = document.getElementById('goal-form');
const dailyCalorieGoalInput = document.getElementById('daily-calorie-goal');
const dailyFatGoalInput = document.getElementById('daily-fat-goal');
const dailyCarbGoalInput = document.getElementById('daily-carb-goal');
const dailyProteinGoalInput = document.getElementById('daily-protein-goal');

// Save meals to local storage
function saveMeals() {
    const meals = [];
    mealList.querySelectorAll('li').forEach(meal => {
        meals.push(meal.dataset);
    });
    localStorage.setItem('meals', JSON.stringify(meals));
}

// Load meals from local storage
function loadMeals() {
    const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    savedMeals.forEach(data => {
        addMealToList(data.name, data.calories, data.fats, data.carbs, data.protein);
    });
}

// Add a meal to the list
function addMealToList(name, calories, fats, carbs, protein) {
    const mealItem = document.createElement('li');
    mealItem.textContent = `${name}: ${calories} calories, ${fats}g fats, ${carbs}g carbs, ${protein}g protein`;
    mealItem.dataset.name = name;
    mealItem.dataset.calories = calories;
    mealItem.dataset.fats = fats;
    mealItem.dataset.carbs = carbs;
    mealItem.dataset.protein = protein;

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.addEventListener('click', function () {
        mealList.removeChild(mealItem);
        updateTotals(-calories, -fats, -carbs, -protein);
        saveMeals();
    });

    // Add delete button to meal item
    mealItem.appendChild(deleteButton);

    // Add meal item to the list
    mealList.appendChild(mealItem);

    // Update totals
    updateTotals(calories, fats, carbs, protein);
}

// Update totals for calories and macronutrients
function updateTotals(calories, fats, carbs, protein) {
    caloriesConsumed.textContent = parseInt(caloriesConsumed.textContent) + parseInt(calories);
    totalFats.textContent = parseInt(totalFats.textContent) + parseInt(fats);
    totalCarbs.textContent = parseInt(totalCarbs.textContent) + parseInt(carbs);
    totalProtein.textContent = parseInt(totalProtein.textContent) + parseInt(protein);

    // Refresh remaining nutrients
    updateRemaining();
}

// Save nutrient goals to local storage
function saveGoals() {
    const goals = {
        calorieGoal: dailyCalorieGoalInput.value || 0,
        fatGoal: dailyFatGoalInput.value || 0,
        carbGoal: dailyCarbGoalInput.value || 0,
        proteinGoal: dailyProteinGoalInput.value || 0,
    };
    localStorage.setItem('nutrientGoals', JSON.stringify(goals));
    loadGoals(); // Refresh displayed goals
}

// Load nutrient goals from local storage
function loadGoals() {
    const savedGoals = JSON.parse(localStorage.getItem('nutrientGoals')) || {
        calorieGoal: 0,
        fatGoal: 0,
        carbGoal: 0,
        proteinGoal: 0,
    };

    calorieGoal.textContent = savedGoals.calorieGoal;
    fatGoal.textContent = savedGoals.fatGoal;
    carbGoal.textContent = savedGoals.carbGoal;
    proteinGoal.textContent = savedGoals.proteinGoal;

    updateRemaining();
}

// Update remaining nutrients
function updateRemaining() {
    const calorieRemaining = parseInt(calorieGoal.textContent, 10) - parseInt(caloriesConsumed.textContent, 10);
    caloriesRemaining.textContent = Math.max(calorieRemaining, 0);

    const fatRemaining = parseInt(fatGoal.textContent, 10) - parseInt(totalFats.textContent, 10);
    fatRemaining.textContent = Math.max(fatRemaining, 0);

    const carbRemaining = parseInt(carbGoal.textContent, 10) - parseInt(totalCarbs.textContent, 10);
    carbRemaining.textContent = Math.max(carbRemaining, 0);

    const proteinRemaining = parseInt(proteinGoal.textContent, 10) - parseInt(totalProtein.textContent, 10);
    proteinRemaining.textContent = Math.max(proteinRemaining, 0);
}

// Set nutrient goals on form submission
goalForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form refresh
    saveGoals();
    goalForm.reset(); // Clear the form
});

// Form submission handler
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values
    const mealName = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);

    // Add the meal to the list
    addMealToList(mealName, calories, fats, carbs, protein);

    // Save meals to local storage
    saveMeals();

    // Clear the form
    form.reset();
});

// Load everything on page load
document.addEventListener('DOMContentLoaded', function () {
    loadMeals();
    loadGoals();
    updateRemaining();
});