//export default "I am an exported string.";

import axios from "axios";
import { proxy, website_parent } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  // every asynchronous function, it automatically returns a promise
  async getResults() {
    try {
      const res = await axios(
        `${proxy}${website_parent}search?&q=${this.query}`
      );
      this.result = res.data.recipes;
      //console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}
