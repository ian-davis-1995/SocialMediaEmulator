import { LetterResult } from "../results/LetterResult";
import { SentenceResult } from "../results/SentenceResult";

export enum AppEventType {
    FINISHED_PRACTICE_LETTERS,
    FINISHED_PRACTICE_SENTENCE,
    FINISHED_PRACTICE_BOTH,
    FINISHED_EXPERIMENT,
}

export abstract class AppEvent {
    readonly eventType: AppEventType;

    protected constructor(eventType: AppEventType) {
        this.eventType = eventType;
    }
}

export class FinishedPracticeLettersEvent extends AppEvent {
    readonly result: LetterResult;

    constructor(result: LetterResult) {
        super(AppEventType.FINISHED_PRACTICE_LETTERS);

        this.result = result;
    }
}

export class FinishedPracticeSentenceEvent extends AppEvent {
    readonly result: SentenceResult;

    constructor(result: SentenceResult) {
        super(AppEventType.FINISHED_PRACTICE_SENTENCE);
        this.result = result;
    }
}

export class FinishedPracticeBothEvent extends AppEvent {
    readonly sentenceResult: SentenceResult;
    readonly letterResult: LetterResult;
    readonly maxReadingTime: number;

    constructor(sentenceResult: SentenceResult, letterResult: LetterResult, maxReadingTime: number) {
        super(AppEventType.FINISHED_PRACTICE_BOTH);

        this.sentenceResult = sentenceResult;
        this.letterResult = letterResult;
        this.maxReadingTime = maxReadingTime;
    }
}

export class FinishedExperimentEvent extends AppEvent {
    readonly sentenceResult: SentenceResult;
    readonly letterResult: LetterResult;

    constructor(sentenceResult: SentenceResult, letterResult: LetterResult) {
        super(AppEventType.FINISHED_EXPERIMENT);

        this.sentenceResult = sentenceResult;
        this.letterResult = letterResult;
    }
}
