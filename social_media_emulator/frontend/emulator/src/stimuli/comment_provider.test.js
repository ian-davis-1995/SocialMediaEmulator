import {COMMENT_BANK} from "./stimuli/comment_bank";
import CommentProvider from "./comment_provider";
import {test} from "@jest/globals";

test("Comment Provider properly shuffles the comment bank", () => {
    for (let i=0; i < 150; i++) {
        // We do this 150 times just to truly check the randomization. It's probably heavy overkill.
        let comment_bank = COMMENT_BANK;
        let provider = new CommentProvider(comment_bank);
        let numberDifferent = 0;

        for (let i=0; i < comment_bank.length; i++) {
            let original_comment = comment_bank[i];
            let provider_comment = provider.getNextComment();

            if (provider_comment !== original_comment) {
                numberDifferent++;
            }
        }

        expect(numberDifferent).toBeGreaterThanOrEqual(comment_bank.length / 2);
    }
});

test("Comment Provider properly wraps around the comment bank", () => {
    let comment_bank = COMMENT_BANK;
    let provider = new CommentProvider(comment_bank);

    for (let i=0; i < comment_bank.length; i++) {
        provider.getNextComment();
    }

    expect(provider.getNextComment()).toEqual(provider.comment_bank[0]);
});

test("Comment Provider's first comment is the first element in the bank", () => {
    let provider = new CommentProvider(COMMENT_BANK);

    expect(provider.current_comment).toEqual(0);
    expect(provider.getNextComment()).toEqual(provider.comment_bank[0]);
    expect(provider.current_comment).toEqual(1);
});

test("Comment Provider's comments for post returns the first two elements in the bank", () => {
    let provider = new CommentProvider(COMMENT_BANK);
    let commentsForPost = provider.getCommentsForPost();

    expect(commentsForPost.length).toEqual(2);
    expect(commentsForPost[0]).toEqual(provider.comment_bank[0]);
    expect(commentsForPost[1]).toEqual(provider.comment_bank[1]);
});
