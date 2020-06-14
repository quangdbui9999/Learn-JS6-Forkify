import axios from "axios";
import { proxy, website_parent } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}${website_parent}get?rId=${this.id}`);

      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log(res);
    } catch (error) {
      console.log(error);
      alert(`Something went Wrong :(`);
    }
  }

  calcTime() {
    // how many ingredients are in there
    const numIngredients = this.ingredients.length;

    // Assuming that we need 15 mins for each 3 ingredients
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    // 4 servings on each recipe
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoon",
      "tablespoons",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "packages",
      "package",
      "cups",
      "cup",
      "pounds",
      "pound",
      "jars",
      "jar"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "pkg",
      "pkg",
      "cup",
      "cup",
      "pound",
      "pound",
      "jar",
      "jar"
    ];

    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map(el => {
      // 1. Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3. Parse ingradients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // Ex: 4 1/2 cups, arrCount [4, 1/2]
        // => eval("4 + 1/2") = 4.5
        // Ex: 4 cups, arrCount [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;

        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit, but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        // There is NO unit
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ing => {
      //ing.count = ing.count * (newServings / this.servings);
      ing.count *= newServings / this.servings;
    });
    this.servings = newServings;
  }
}
