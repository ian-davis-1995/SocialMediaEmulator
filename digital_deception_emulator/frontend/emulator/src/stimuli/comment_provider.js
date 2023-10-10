import { shuffle } from "../utils/randomization";

const autoBind = require("auto-bind");

export default class CommentProvider {
    constructor(comment_bank, author_provider) {
        autoBind(this);

        this.author_provider = author_provider;
        this.comment_bank = comment_bank;
        this.shuffled_comment_bank = {};
        this.generateShuffledBank();
        console.debug("Successfully shuffled comment bank");
        this.all_picked_comment_ids = [];
    }

    generateShuffledBank() {
        let categories = this.comment_bank.availableCategories();
        let rootComments = this.comment_bank.availableComments(
            this.comment_bank.rootCategory
        );
        let numberRootPerCategory = Math.trunc(
            rootComments.length / (categories.length - 1)
        );
        let currentRootIndex = 0;

        for (let i = 0; i < categories.length; i++) {
            let category = categories[i];
            let extraComments = rootComments.slice(
                currentRootIndex,
                currentRootIndex + numberRootPerCategory
            );
            currentRootIndex += numberRootPerCategory;
            currentRootIndex = currentRootIndex % rootComments.length;

            // if (category == this.comment_bank.rootCategory) {
            //     continue;
            // }

            let categoryComments =
                this.comment_bank.availableComments(category);
            categoryComments.push(...extraComments);
            let randomizedComments = shuffle(categoryComments);

            console.debug("randomize comments for category " + category);
            console.debug(randomizedComments);

            this.shuffled_comment_bank[category] = {
                current_index: 0,
                comments: randomizedComments,
            };
        }

        console.debug("Done generating shuffled bank");
    }

    getNextComment(post) {
        // Get the next index in the comment bank, wrapping around to the start if necessary.
        let category;

        if (!("category" in post)) {
            category = this.comment_bank.rootCategory;
        } else {
            category = post.category;
        }

        if (!(category in this.shuffled_comment_bank)) {
            console.error(
                "Could not find category " +
                    category +
                    " in shuffle comment bank, what happened??"
            );
        }

        let useSpecificCategory = true;

        if (!useSpecificCategory) {
            console.debug(
                "Using general category instead of specific this time"
            );
            category = this.comment_bank.rootCategory;
        }

        console.debug(
            "Looking for category in shuffled comment bank " + category
        );

        let comment_data = this.shuffled_comment_bank[category];
        let comment_index = comment_data.current_index;
        let comments = comment_data.comments;

        if (comment_index >= comments.length) {
            console.warn(
                "We were going to use specific category " +
                    category +
                    " but that comment bank has run out, using root category instead"
            );
            category = this.comment_bank.rootCategory;
            comment_data = this.shuffled_comment_bank[category];
            comment_index = comment_data.current_index;
            comments = comment_data.comments;
        }

        let comment = comments[comment_index % comments.length];

        if (this.all_picked_comment_ids.includes(comment.body)) {
            console.warn(
                "Picked comment " +
                    comment.body +
                    " has already been picked once before???"
            );
            console.debug(this.all_picked_comment_ids);
            console.debug(comment_data);
        } else {
            this.all_picked_comment_ids.push(comment.body);
        }

        console.debug(
            "Picked comment " + comment.body + " for post id " + post.id
        );
        console.debug(
            "Comment bank current index before updating: " +
                this.shuffled_comment_bank[category].current_index
        );

        comment_data.current_index++;
        console.debug(
            "Comment bank current index after updating: " +
                this.shuffled_comment_bank[category].current_index
        );

        comment.author = this.author_provider.getNextAuthor();

        return comment;
    }

    getCommentsForPost(post) {
        let numberComments = 2;
        let comments = [];

        for (let i = 0; i < numberComments; i++) {
            comments.push(this.getNextComment(post));
        }

        return comments;
    }
}

export class PracticeCommentProvider {
    constructor(practice_comment_bank, author_provider) {
        autoBind(this);

        this.author_provider = author_provider;
        this.shuffled_comment_bank = shuffle(
            practice_comment_bank.availableComments()
        );
        this.current_index = 0;
    }

    getNextComment(post) {
        let comment =
            this.shuffled_comment_bank[
                this.current_index % this.shuffled_comment_bank.length
            ];
        comment.author = this.author_provider.getNextAuthor();
        this.current_index++;
        return comment;
    }

    getCommentsForPost(post) {
        let numberComments = 2;
        let comments = [];

        for (let i = 0; i < numberComments; i++) {
            comments.push(this.getNextComment(post));
        }

        return comments;
    }
}
