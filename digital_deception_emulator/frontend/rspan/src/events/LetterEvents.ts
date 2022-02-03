import {ExperimentEvent, ExperimentEventType} from "./ExperimentEvent";

export class LetterPracticeStartedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.LETTER_PRACTICE_STARTED);
    }
}

export class ShowLetterEvent extends ExperimentEvent {
    readonly letter: string;

    constructor(letter: string) {
        super(ExperimentEventType.SHOW_LETTER);
        this.letter = letter;
    }
}

export class HideLetterEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.HIDE_LETTER);
    }
}

export class ShowGridEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.SHOW_GRID);
    }
}

export class GridConfirmedEvent extends ExperimentEvent {
    readonly letterOrder: Array<string>;

    constructor(letterOrder: Array<string>) {
        super(ExperimentEventType.GRID_CONFIRMED);
        this.letterOrder = letterOrder;
    }
}
