// create an object which will contain all of the elements that we select from our DOM, so all the elements that we need from our app.

export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMemu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list")
};

export const elementStrings = {
  loader: "loader"
};

// loading spinner on the website (for resuability)
/*
- SVG stands for Scalable Vector Graphics
- SVG is used to define graphics for the Web
- SVG is a W3C recommendation
 */
export const renderLoader = parent => {
  const loader = `
  <div class="${elementStrings.loader}">
    <svg>
      <use href="img/icons.svg#icon-cw"></use>
    </svg>
  </div>
  `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};
