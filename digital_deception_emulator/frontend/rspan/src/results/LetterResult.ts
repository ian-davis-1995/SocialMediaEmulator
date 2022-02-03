export class LetterResult {
    public properLetters: Array<Array<String>> = [];
    public chosenLetters: Array<Array<String>> = [];
    public numberCorrect: number = 0;
    public totalLetters: number = 0;

    addInputs(properLetters: Array<String>, chosenLetters: Array<String>) {
        console.debug("Adding inputs to practice letter result: " + properLetters + " -- " + chosenLetters);
        let numberCorrect = 0;

        for (let i=0; i < chosenLetters.length; i++) {
            if (i >= properLetters.length) {
                // For the case where they select more letters than were shown.
                break;
            }

            let selectedLetter = chosenLetters[i];
            let properLetter = properLetters[i];

            if (selectedLetter === properLetter) {
                numberCorrect++;
            }
        }

        this.properLetters.push(properLetters);
        this.chosenLetters.push(chosenLetters);
        this.numberCorrect += numberCorrect;
        this.totalLetters += chosenLetters.length;
    }
}
