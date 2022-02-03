import {ExperimentState, ExperimentStateType} from "./ExperimentState";

export class ShowingLetterState extends ExperimentState {
    readonly letter: string;

    constructor(letter: string) {
        super(ExperimentStateType.SHOWING_LETTER);
        this.letter = letter;
    }
}

export class HidingLetterState extends ExperimentState {
    constructor() {
        super(ExperimentStateType.HIDING_LETTER);
    }
}

export class ShowingGridState extends ExperimentState {
    constructor() {
        super(ExperimentStateType.SHOWING_GRID);
    }
}

export class ShowingPracticeLetterFeedbackState extends ExperimentState {
    readonly numberCorrect: number;
    readonly numberTotal: number;

    constructor(numberCorrect: number, numberTotal: number) {
        super(ExperimentStateType.SHOWING_LETTER_PRACTICE_FEEDBACK);
        this.numberCorrect = numberCorrect;
        this.numberTotal = numberTotal;
    }
}
