const Bagel = require('../src/bagel.js');
const Basket = require('../src/basket.js');

class Receipt {
    constructor(obj = {}) {
        this.purchases = obj;
        this.date = new Date();
        this.total = 0;
    }

    getReceipt() {
        return `
    ~~~ Bob's Bagels ~~~    

       ${this.date.toDateString()}
----------------------------
${this.getPurchaseList()}
Total                 £${Number(this.total.toFixed(2))}
        Thank you
      for your order!         `;
    }

    getPurchaseList() {
        this.total = 0;
        let purchaseLines = '';
        for (let key in this.purchases) {
            let receiptLine = '';
            receiptLine += Bagel.getTypeOfBagel(key)
                ? Bagel.getTypeOfBagel(key)
                : 'Coffee';
            for (let i = 0; i < 19; i++) {
                if (receiptLine.length < 19) {
                    receiptLine += ' ';
                }
            }
            receiptLine += this.purchases[`${key}`];
            for (let i = 0; i < 4; i++) {
                if (receiptLine.length < 23) {
                    receiptLine += ' ';
                }
            }
            receiptLine += '£';
            const subtotal = Basket.getSubtotal(this.purchases, key);
            receiptLine += subtotal;
            this.total += subtotal;
            purchaseLines += `${receiptLine}\n`;
        }
        return purchaseLines;
    }
}
module.exports = Receipt;
