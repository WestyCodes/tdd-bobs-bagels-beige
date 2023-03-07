const Bagel = require("../src/bagel.js");
const deals = require("../src/deals.js");

class Basket {
  constructor(number = 3) {
    this.contents = [];
    this.IDcounter = 0;
    this.capacity = number;
    this.counts = {};
  }

  addBagel(SKU, numOfBagels = 1) {
    for (let i = 0; i < numOfBagels; i++) {
      if (!this.basketIsFull()) {
        this.IDcounter++;
        const id = this.IDcounter;
        let bagelItem = new Bagel(SKU, id);
        this.contents.push(bagelItem);
      }
    }
    return this.contents;
  }

  removeBagel(id) {
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i].id === id) {
        this.contents.splice([i], 1);
        return this.contents;
      }
    }
    return "Bagel isn't in basket";
  }

  basketIsFull() {
    if (this.contents.length >= this.capacity) {
      return "basket is full";
    }
    return false;
  }

  getPriceOfBagel(SKU) {
    const output = new Bagel(SKU);
    return output.price;
  }
  /*
    getTotal() {
        let total = 0
        this.checkDeals()
        console.log(this.countBagelsinBasket())
      for (let i = 0; i < this.contents.length; i++) {
         total += this.contents[i].price * 100
      }
     return total/100
    }
*/

  countBagelsInBasket() {
    this.counts = {};
    for (let i = 0; i < this.contents.length; i++) {
      const SKU = this.contents[i]["SKU"];
      if (!this.counts.hasOwnProperty(SKU)) {
        this.counts[`${SKU}`] = 1;
      } else {
        this.counts[`${SKU}`]++;
      }
    }
    return this.counts;
  }

  static plainBagelCoffeeDeal(basketQuantities) {
    let totalBagelCoffeeSaving = 0;
    if (basketQuantities.COF > 0 && basketQuantities.BGLP > 0) {
      let coffeeCount = basketQuantities.COF;
      let plainBagelCount = basketQuantities.BGLP % 12;
      while (coffeeCount > 0 && plainBagelCount > 0) {
        coffeeCount--;
        plainBagelCount--;
        totalBagelCoffeeSaving += 0.13;
      }
    }
    return totalBagelCoffeeSaving;
  }

  static getSubtotal(basketQuantities, SKU) {
    const itemQuantity = basketQuantities[SKU];
    const dealQuantity = deals[SKU][0];
    const dealPrice = deals[SKU][1];
    const bagelPrice = Bagel.getPriceOfBagel(SKU);
    const dealSum = Math.floor(itemQuantity / dealQuantity) * dealPrice;
    const nonDealSum = (itemQuantity % dealQuantity) * bagelPrice;
    let coffeeDealSaving = 0;
    if (SKU === "COF") {
      coffeeDealSaving = Basket.plainBagelCoffeeDeal(basketQuantities);
    }
    return Number((dealSum + nonDealSum - coffeeDealSaving).toFixed(2));
  }

  getTotal() {
    const counts = this.counts;
    let total = 0;
    for (let SKU in counts) {
      const count = counts[`${SKU}`];
      const dealQuantity = deals[SKU][0];
      const dealPrice = deals[SKU][1];
      const bagelPrice = Bagel.getPriceOfBagel(SKU);
      if (deals.hasOwnProperty(SKU)) {
        const dealSum = Math.floor(count / dealQuantity) * dealPrice;
        const nonDealSum = (count % dealQuantity) * bagelPrice;
        total += dealSum + nonDealSum;
      }
      if (dealQuantity === 1) {
        // adhoc application of coffee deal saving
        const BOGOFSKU = `${deals[SKU][2]}`;
        const numOfDiscounts = counts[BOGOFSKU] % deals[BOGOFSKU][0];
        const saving = Bagel.getPriceOfBagel(BOGOFSKU) - deals[SKU][3];
        total -= numOfDiscounts * saving;
      }
    }

    return Number(total.toFixed(2));
  }

  /*this.contents.filter()
        for(let i = 0; i < this.contents.length; i++){
            for (let j = 0; j < )
        }
    }
    */
}

module.exports = Basket;
