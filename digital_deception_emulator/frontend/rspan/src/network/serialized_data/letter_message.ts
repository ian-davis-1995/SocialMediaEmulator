import { LetterResult } from "../../results/LetterResult";

export interface SerializedLetterResult {
    proper_letters: Array<Array<String>>;
    chosen_letters: Array<Array<String>>;
    number_correct: number;
    total_letters: number;
}

export function serializeLetterResult(result: LetterResult): SerializedLetterResult {
    return {
        "proper_letters": result.properLetters,
        "chosen_letters": result.chosenLetters,
        "number_correct": result.numberCorrect,
        "total_letters": result.totalLetters,
    }
}

export function deserializeLetterResult(result: SerializedLetterResult) {
    const letterResult = new LetterResult();
    letterResult.chosenLetters = result.chosen_letters;
    letterResult.properLetters = result.proper_letters;
    letterResult.numberCorrect = result.number_correct;
    letterResult.totalLetters = result.total_letters;
    return letterResult;
}
