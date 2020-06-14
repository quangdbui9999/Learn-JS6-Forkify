//export const add = (a, b) => a + b;
//export const multiply = (a, b) => a * b;
//export const ID = 23;

import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach(el => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active");
};

// 'Pasta with tomato and spinach'
/*
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 25 / newTitle = ['Pasta', 'with', 'tomato']
*/
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length; // return from reduce() method
    }, 0); // string begin at 0
    // return the result
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  // rendered to DOM element
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
}; // do not have export, that's means this is the private function

// type: 'prev' or 'next' page
// data-goto will be use for event handler
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
  <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${
            type === "prev" ? "left" : "right"
          }"></use>
      </svg>
  </button>
`;

// numResults: how many total results for one search key (26, 27, 28, or 30) => TOTAL results
// resPesPage: how many results we have per page
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;

  if (page === 1 && pages > 1) {
    // This is the first page: page 1
    // only Button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // not 1st page, and not last page
    // Both button go to previous and next page
    button = `
    ${createButton(page, "prev")}
    ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    // This is the last page
    // only Button to go to previous page
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

// page: current page
// resPesPage: how many results we have per page
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  // start = (1-1) * 10 = 0
  // end = 1 * 10 = 10 (exclude end, feature of slice(star, end))
  // start = (2-1) * 10 = 10
  // end = 2 * 10 = 20
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  // call the renderRecipe for each of them
  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
