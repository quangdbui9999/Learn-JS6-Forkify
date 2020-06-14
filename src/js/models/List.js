import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = []; // empty array
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    // [2, 4, 8]
    // splice(start index, how many elements to take)
    // splice(1, 1) => return 4, original [2, 8]
    // splice(1, 2) => return [4, 8], original [2]

    // slice(starting index, ending index)
    // slice(1, 2) => return 4, original [2, 4, 8]

    const index = this.items.findIndex(el => el.id === id);
    this.items.splice(index, 1); // only 1 element id to be removed
  }

  updateCount(id, newCount) {
    // Just update the counts, do NOT update the units and ingredients
    // findIndex() return index
    // find() returns the element itself
    this.items.find(el => el.id === id).count = newCount;
  }
}
