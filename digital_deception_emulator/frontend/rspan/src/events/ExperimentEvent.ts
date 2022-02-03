export enum ExperimentEventType {
    LETTER_INSTRUCTIONS1_CLICKED,
    LETTER_INSTRUCTIONS2_CLICKED,
    LETTER_PRACTICE_STARTED,
    SHOW_LETTER,
    HIDE_LETTER,
    SHOW_GRID,
    GRID_CONFIRMED,
    SENTENCE_INSTRUCTIONS1_CLICKED,
    SENTENCE_INSTRUCTIONS2_CLICKED,
    SENTENCE_PRACTICE_STARTED,
    SHOW_SENTENCE,
    SENTENCE_READ,
    SENTENCE_TIMED_OUT,
    SENSE_PROMPT_RESPONDED,
    COMBINED_INSTRUCTIONS1_CLICKED,
    COMBINED_INSTRUCTIONS2_CLICKED,
    COMBINED_INSTRUCTIONS3_CLICKED,
    ISI_DELAY,
    SET_FINISHED,
    START_PRACTICE_BOTH,
    START_EXPERIMENT,
    EXPERIMENT_START_CLICKED,
}

export class ExperimentEvent {
    readonly eventType: ExperimentEventType;

    constructor(eventType: ExperimentEventType) {
        this.eventType = eventType;
    }
}

export class ISIDelayEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.ISI_DELAY);
    }
}

export class SetFinishedEvent extends ExperimentEvent {
    readonly percentCorrect: number;
    readonly lettersCorrect: number;
    readonly setSize: number;
    readonly sentenceErrors: number;

    constructor(percentCorrect: number, lettersCorrect: number, setSize: number, sentenceErrors: number) {
        super(ExperimentEventType.SET_FINISHED);
        this.percentCorrect = percentCorrect;
        this.lettersCorrect = lettersCorrect;
        this.setSize = setSize;
        this.sentenceErrors = sentenceErrors;
    }
}

export class StartPracticeBothEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.START_PRACTICE_BOTH);
    }
}

export class StartExperimentEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.START_EXPERIMENT);
    }
}
