// Global variables to track totals
let fats = 0;
let carbs = 0;
let protein = 0;

// Initialize chart for macronutrient distribution
let ctx = document.getElementById('macronutrient-chart').getContext('2d');
let macronutrientChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Fats (g)', 'Carbohydrates (g)', 'Protein (g)'],
        datasets: [{
            label: 'Macronutrient Distribution',
            data: [fats, carbs, protein],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each nutrient
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial'
                    }
                }
            }
        }
    }
});

// Update chart with new macronutrient data
function updateChart(newFats, newCarbs, newProtein) {
    fats += parseInt(newFats);
    carbs += parseInt(newCarbs);
    protein += parseInt(newProtein);

    macronutrientChart.data.datasets[0].data = [fats, carbs, protein];
    macronutrientChart.update();
}

// Add meal to the list and update chart/totals
function addMealToList(name, calories, fats, carbs, protein) {
    const mealItem = document.createElement('li');
    mealItem.classList.add('list-group-item');
    mealItem.textContent = `${name}: ${calories} calories, ${fats}g fats, ${carbs}g carbs, ${protein}g protein`;
    mealItem.dataset.name = name;
    mealItem.dataset.calories = calories;
    mealItem.dataset.fats = fats;
    mealItem.dataset.carbs = carbs;
    mealItem.dataset.protein = protein;

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
    deleteButton.addEventListener('click', function () {
        mealList.removeChild(mealItem);
        updateTotals(-calories, -fats, -carbs, -protein);
        saveMeals();
    });

    // Append delete button and add meal to list
    mealItem.appendChild(deleteButton);
    mealList.appendChild(mealItem);

    // Update totals and chart
    updateTotals(calories, fats, carbs, protein);
    updateChart(fats, carbs, protein);
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

// Update remaining calories
function updateRemaining() {
    const calorieRemaining = parseInt(calorieGoal.textContent, 10) - parseInt(caloriesConsumed.textContent, 10);
    caloriesRemaining.textContent = Math.max(calorieRemaining, 0);
}

// Save and load meals to/from localStorage
function saveMeals() {
    const meals = [];
    mealList.querySelectorAll('li').forEach(meal => {
        meals.push(meal.dataset);
    });
    localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMeals() {
    const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    savedMeals.forEach(data => {
        addMealToList(data.name, data.calories, data.fats, data.carbs, data.protein);
    });
}

// Save and load calorie goals
function saveGoals() {
    const goals = {
        calorieGoal: dailyGoalInput.value || 0
    };
    localStorage.setItem('nutrientGoals', JSON.stringify(goals));
    loadGoals();
}

function loadGoals() {
    const savedGoals = JSON.parse(localStorage.getItem('nutrientGoals')) || { calorieGoal: 0 };
    calorieGoal.textContent = savedGoals.calorieGoal;
    updateRemaining();
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    // Save the preference in localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// Load Dark Mode preference on page load
document.addEventListener('DOMContentLoaded', function () {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    loadMeals();
    loadGoals();
    updateRemaining();
});

// Event listeners for form submissions
goalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    saveGoals();
    goalForm.reset();
});

mealForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values
    const mealName = document.getElementById('meal-name').value;
    const calories = parseInt(document.getElementById('calories').value, 10);
    const fats = parseInt(document.getElementById('fats').value, 10);
    const carbs = parseInt(document.getElementById('carbs').value, 10);
    const protein = parseInt(document.getElementById('protein').value, 10);

    // Add meal and save
    addMealToList(mealName, calories, fats, carbs, protein);
    saveMeals();

    // Clear the form
    mealForm.reset();
});
