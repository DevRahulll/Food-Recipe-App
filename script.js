const searchInput=document.getElementById('search-box')
const searchButton=document.getElementById('searchButton')
const mealList=document.getElementById('mealList')
const Conatainer=document.querySelector(".container");
const recipeCloseBtn=document.getElementById("recipeCloseBtn")
const mealDetailsContent=document.querySelector(".meal-details-content")


// Event Listener
searchButton.addEventListener('click',async()=>{
    const ingredient=searchInput.value.trim();
    if(ingredient){
        const meals=await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
});

mealList.addEventListener('click',async(e)=>{
    const card=e.target.closest('.meal-item');
    if(card){
        const mealId=card.dataset.id;
        const meal=await getMealDetails(mealId);
        if(meal){
            showMealDetailsPopup(meal);
        }
    }
});

// Function to fetch meals by ingredient 
async function searchMealsByIngredient(ingredient){
    try {
        const response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data=await response.json();
        return data.meals;
    } catch (error) {
        // show error in console
        console.error("Error in fetching Recipe:",error);
    }
}

// Function to fetch meal details by ID
async function getMealDetails(mealId){
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data=await response.json();
        return data.meals[0];
    } catch (error) {
        console.error("Error in fetching meals Details:",error);
    }
}
// Function to display meals in the list
function displayMeals(meal){
    mealList.innerHTML='';
    if(meal){
        meal.forEach((meal)=>{
            const mealItem=document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id=meal.idMeal;
            mealItem.innerHTML=`
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h3>${meal.strMeal}</h3>`;
            mealList.appendChild(mealItem);
        });
    }else{
        mealList.innerHTML='<p>No meals found. Try another Recipe.</p>';
    }
}
// Function to create and display meal details on popup
function showMealDetailsPopup(meal){
    mealDetailsContent.innerHTML=`
    <h2 class='recipe-title'>${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-img">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <div class="recipe-video">
    <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
    </div>
    `;
    Conatainer.style.display='block';
}

// Event listener for popup close button
recipeCloseBtn.addEventListener('click',closeRecipe);
function closeRecipe(){
    Conatainer.style.display='none';
}

searchInput.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        performSearch();
    }
});

async function performSearch(){
    const ingredient=searchInput.value.trim();
    if(ingredient){
        const meals=await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
}
// Perform a chicken search on page load
window.addEventListener('load',()=>{
    searchInput.value='chicken';
    performSearch();
});