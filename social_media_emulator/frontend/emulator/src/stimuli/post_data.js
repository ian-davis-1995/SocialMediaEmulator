export const POST_DATA = require("./post_data.json");

export function findLongestSection() {
    let longestLength = 0;

    for (let i = 0; i < POST_DATA.length; i++) {
        let post = POST_DATA[i];
        let storySegments = post["storySegments"];

        if (storySegments === undefined || storySegments === null) {
            continue;
        }

        for (let i = 0; i < storySegments.length; i++) {
            let segment = storySegments[i];

            if (segment.length > longestLength) {
                longestLength = segment.length;
            }
        }
    }

    return longestLength;
}