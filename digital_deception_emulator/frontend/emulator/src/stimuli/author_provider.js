import { shuffle } from "../utils/randomization";

const AUTHOR_BANK = require("./author_bank.json");
const autoBind = require("auto-bind");


export default class AuthorProvider {
    constructor() {
        this.currentAuthor = 0;
        this.shuffledBank = shuffle(AUTHOR_BANK);
        autoBind(this);
    }

    getNextAuthor() {
        let author = this.shuffledBank[this.currentAuthor++ % this.shuffledBank.length];
        console.debug("Next retrieved author is " + author["Full Name"]);
        return author["Full Name"];
    }
}
