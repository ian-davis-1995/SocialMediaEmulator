export const letters = [
    "F", "H", "J",
    "K", "L", "N",
    "P", "Q", "R",
    "S", "T", "Y",
];

export function generateLetterSet(length: number) {
    let set = [];

    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * letters.length);
        set.push(letters[index]);
    }

    console.assert(set.length === length);
    return set;
}