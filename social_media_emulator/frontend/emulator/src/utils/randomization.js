export function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  let tempArray = [...array];

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = tempArray[currentIndex];
    tempArray[currentIndex] = tempArray[randomIndex];
    tempArray[randomIndex] = temporaryValue;
  }

  return tempArray;
}

export function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}