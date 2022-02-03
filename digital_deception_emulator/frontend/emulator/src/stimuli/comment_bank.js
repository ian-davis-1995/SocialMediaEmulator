const COMMENT_BANK = require("./comment_bank.json");
const PRACTICE_COMMENT_BANK = require("./practice_comment_bank.json");
const ROOT_CATEGORY = "general";

var autoBind = require("auto-bind");

export default class CommentBank {
    constructor() {
        this.rootCategory = ROOT_CATEGORY;
        autoBind(this);
    }

    availableCategories() {
        return Object.keys(COMMENT_BANK);
    }

    availableComments(category) {
        return COMMENT_BANK[category];
    }
}

export class PracticeCommentBank {
    constructor() {
        autoBind(this);
    }

    availableCategories() {
        return ["general",];
    }

    availableComments(category) {
        return PRACTICE_COMMENT_BANK;
    }
}