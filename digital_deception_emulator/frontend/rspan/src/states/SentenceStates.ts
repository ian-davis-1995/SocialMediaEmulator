import {ExperimentState, ExperimentStateType} from "./ExperimentState";

export class ShowingSentenceState extends ExperimentState {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly maxReadingTime: number;

    constructor(sentence: string, expectedResponse: boolean, maxReadingTime: number = -1) {
        super(ExperimentStateType.SHOWING_SENTENCE);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.maxReadingTime = maxReadingTime;
    }
}

export class ShowingSensePromptState extends ExperimentState {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly readingTimeMillis: number;

    constructor(sentence: string, expectedResponse: boolean, readingTimeMillis: number) {
        super(ExperimentStateType.SHOWING_SENSE_PROMPT);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.readingTimeMillis = readingTimeMillis;
    }
}

export class ShowingSentenceFeedbackState extends ExperimentState {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly response: boolean;
    readonly readingTimeMillis: number;

    constructor(sentence: string, expectedResponse: boolean, response: boolean, readingTimeMillis: number) {
        super(ExperimentStateType.SENTENCE_FEEDBACK);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.response = response;
        this.readingTimeMillis = readingTimeMillis;
    }
}
