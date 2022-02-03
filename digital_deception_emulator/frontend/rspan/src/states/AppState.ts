export enum AppStateType {
    PRACTICE_LETTERS,
    PRACTICE_SENTENCE,
    PRACTICE_BOTH,
    RUNNING_EXPERIMENT,
    UPLOADING_EXPERIMENT,
    FINISHED_EXPERIMENT,
}

export abstract class AppState {
    readonly stateType: AppStateType;

    protected constructor(stateType: AppStateType) {
        this.stateType = stateType;
    }
}

export class PracticeLettersState extends AppState {
    constructor() {
        super(AppStateType.PRACTICE_LETTERS);
    }
}

export class PracticeSentenceState extends AppState {
    constructor() {
        super(AppStateType.PRACTICE_SENTENCE);
    }
}

export class PracticeBothState extends AppState {
    readonly maxReadingTime: number;

    constructor(maxReadingTime: number = -1) {
        super(AppStateType.PRACTICE_BOTH);

        this.maxReadingTime = maxReadingTime;
    }
}

export class RunningExperimentState extends AppState {
    readonly maxReadingTime: number;

    constructor(maxReadingTime: number = -1) {
        super(AppStateType.RUNNING_EXPERIMENT);

        this.maxReadingTime = maxReadingTime;
    }
}

export class UploadingExperimentState extends AppState {
    constructor() {
        super(AppStateType.UPLOADING_EXPERIMENT);
    }
}

export class FinishedExperimentState extends AppState {
    constructor() {
        super(AppStateType.FINISHED_EXPERIMENT);
    }
}
