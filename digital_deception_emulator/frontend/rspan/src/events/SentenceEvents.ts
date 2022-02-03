import {ExperimentEvent, ExperimentEventType} from "./ExperimentEvent";

export class SentencePracticeStartedEvent extends ExperimentEvent {
    constructor() {
        super(ExperimentEventType.SENTENCE_PRACTICE_STARTED);
    }
}

export class ShowSentenceEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;

    constructor(sentence: string, expectedResponse: boolean) {
        super(ExperimentEventType.SHOW_SENTENCE);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
    }
}

export class SentenceReadEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly readingTimeMillis: number;

    constructor(sentence: string, expectedResponse: boolean, readingTimeMillis: number) {
        super(ExperimentEventType.SENTENCE_READ);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.readingTimeMillis = readingTimeMillis;
    }
}

export class SentenceTimeoutEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;

    constructor(sentence: string, expectedResponse: boolean) {
        super(ExperimentEventType.SENTENCE_TIMED_OUT);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
    }
}

export class SensePromptRespondedEvent extends ExperimentEvent {
    readonly sentence: string;
    readonly expectedResponse: boolean;
    readonly response: boolean;
    readonly readingTimeMillis: number;

    constructor(sentence: string, expectedResponse: boolean, response: boolean, readingTimeMillis: number) {
        super(ExperimentEventType.SENSE_PROMPT_RESPONDED);
        this.sentence = sentence;
        this.expectedResponse = expectedResponse;
        this.response = response;
        this.readingTimeMillis = readingTimeMillis;
    }
}
