const meals=document.getElementById("meals");
const favoriteContainer =document.getElementById("favorite-meals")

getRandomMeal()
fetchFavMeals()

async function getRandomMeal() {
    
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const respData=await resp.json();
        const randomMeal= respData.meals[0]
        
        console.log(randomMeal)
        addMeal(randomMeal, true)
    }
    
    async function getMealById(id) {
        
        const resp = await fetch(
            "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
            );
            
            const respData=await resp.json()
            const meal = respData.meals[0]

            return meal
            
        }
        
        async function getMealsBySearch (term) {
            const meals = await fetch(
                "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
                );
                
            }


            
function addMeal(mealData, random=false) {

    const meal=document.createElement("div")
    meal.classList.add("meal")

    meal.innerHTML=`
    <div class="meal-header">
    ${ random ? `<span class="random">Rastgele Tarif</span>` : "" }
      
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fa-solid fa-heart"></i>
        </button>
    </div>`



    const btn =meal.querySelector(".meal-body .fav-btn")


    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals()
    })

    meals.appendChild(meal)

}

function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {

    //Konteyniri temizle.
    favoriteContainer.innerHTML="";

    const mealIds=getMealsLS();
 
    for(let i=0; i<mealIds.length; i++) {
        const mealId = mealIds[i]
        meal = await getMealById(mealId)

        addMealFav(meal)
    }

}


function addMealFav(mealData) {

  
    const favMeal=document.createElement("li")

    favMeal.innerHTML=`
      <img
       src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
       <span>${mealData.strMeal}</span>
       <button class="clear"><i class="fa-sharp fa-regular fa-circle-xmark"></i></button>`

       const btn=favMeal.querySelector(".clear");
       btn.addEventListener("click", () => {

        removeMealLS(mealData.idMeal);

        fetchFavMeals()

       })

    favoriteContainer.appendChild(favMeal)

}