// Global app controller

/*
import str from "./models/Search";
import * as searchView from "./views/searchView";
//import { add as a, multiply as m, ID } from "./views/searchView";

console.log(
  `Using imported functions! ${searchView.add(
    searchView.ID,
    2
  )} and ${searchView.multiply(3, 5)}. ${str} `
);
*/

/*
// Test app
import num from "./test";

const x = 23;

// console.log(`I imported ${num} from another module.`);
console.log(
  `I imported ${num} from another module called test.js! Variable x is: ${x}`
);
*/

import Seach from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/**
 * Global State of the App
 * - Search object
 * - Current Recipe object
 * - Shopping List object
 * - Liked recipes.
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
  // 1. Get the query from the View
  const query = searchView.getInput();

  if (query) {
    // 2. New search object then added to state
    state.search = new Seach(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4. Search for recipes
      // we want the rendering of the results only to happen after we actually receive the results from the API. put await this promise here
      await state.search.getResults();

      // 5/ Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
      //console.log(state.search.result); // this.result from '/models/Search.js'
    } catch (error) {
      //alert(`Processing Search Error!`);
      alert(error);
      clearLoader();
    }
  }
};

// add an event listener for whenever we submit this form. And event listeners are something that go into the controller because that's where we're then gonna delegate what people want to happen when these are submits to form,
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault(false); // prevent reload the page
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  // closest returns to closest ancestor of the current element which matches the selector given in the parameter.
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); // base 10: 0-9
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // Get the ID from url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Hightlight selected Search Item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();

      // Calculate serbings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert(`Error processing recipe: ${error}`);
      clearLoader();
    }
  }
};

// hashchange for get Id from the url
// load: Load the id (id do not lost) whenever the pages loaded
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  // Add each ingredients to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle dele and update List item events
elements.shopping.addEventListener("click", e => {
  // we need to specifically find the element which contains our ID that we want to read.
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    // Handle the count update
    // get current value when each click
    const val = parseFloat(e.target.value, 10);
    if (val > 0) state.list.updateCount(id, val);
  }
});

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  // Creating a new like object
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like Button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    // User HAS liked current recipe

    // Remove like to the state
    state.likes.deleteLike(currentID);

    // Toggle the like Button
    likesView.toggleLikeBtn(false);

    // Remove like to UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipe on page load
window.addEventListener("load", () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle the menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing like
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe Button click
elements.recipe.addEventListener("click", e => {
  // matches: target these different elements, to basically test what was clicked, and then react accordingly.
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decreasing Button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increasing Button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping List
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
