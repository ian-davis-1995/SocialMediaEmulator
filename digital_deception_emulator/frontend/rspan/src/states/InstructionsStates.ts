import {ExperimentState, ExperimentStateType} from "./ExperimentState";

export class LetterInstructions1State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.LETTER_INSTRUCTIONS1);
    }
}

export class LetterInstructions2State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.LETTER_INSTRUCTIONS2);
    }
}

export class LetterInstructions3State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.LETTER_INSTRUCTIONS3);
    }
}

export class SentenceInstructions1State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.SENTENCE_INSTRUCTIONS1);
    }
}

export class SentenceInstructions2State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.SENTENCE_INSTRUCTIONS2);
    }
}

export class SentenceInstructions3State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.SENTENCE_INSTRUCTIONS3);
    }
}

export class CombinedInstructions1State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.COMBINED_INSTRUCTIONS1);
    }
}

export class CombinedInstructions2State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.COMBINED_INSTRUCTIONS2);
    }
}

export class CombinedInstructions3State extends ExperimentState {
    constructor() {
        super(ExperimentStateType.COMBINED_INSTRUCTIONS3);
    }
}

export class ExperimentStartScreenState extends ExperimentState {
    constructor() {
        super(ExperimentStateType.EXPERIMENT_START_SCREEN);
    }
}