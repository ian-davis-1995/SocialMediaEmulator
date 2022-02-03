import {Bloc} from "@felangel/bloc";
import {
    ExperimentEvent,
    ExperimentEventType,
    ISIDelayEvent,
    SetFinishedEvent,
    StartExperimentEvent,
    StartPracticeBothEvent,
} from "../events/ExperimentEvent";
import {ExperimentState, ISIDelayState, SetFeedbackState} from "../states/ExperimentState";
import {AppBloc} from "../AppBloc";
import {
    CombinedInstructions1State,
    CombinedInstructions2State,
    CombinedInstructions3State, ExperimentStartScreenState
} from "../states/InstructionsStates";
import {shuffle} from "../utils/array_shuffle";
import {SensePromptRespondedEvent, SentenceReadEvent, ShowSentenceEvent} from "../events/SentenceEvents";
import {ShowingSensePromptState, ShowingSentenceState} from "../states/SentenceStates";
import {SentenceResult} from "../results/SentenceResult";
import {LetterResult} from "../results/LetterResult";
import {GridConfirmedEvent, ShowGridEvent, ShowLetterEvent} from "../events/LetterEvents";
import {wait} from "../utils/async";
import {generateLetterSet} from "../stimuli/letters";
import {generateSentenceSets, SentenceSetDescription} from "../stimuli/sentences";
import {ShowingGridState, ShowingLetterState} from "../states/LetterStates";
import {FinishedExperimentEvent, FinishedPracticeBothEvent} from "../events/AppEvent";

// Practice shows 2 sets of 2 sentences and letters.
// Experiment shows 6 sets -- 2 of length 4, 2 of length 5 and 2 of length 6.
// Total number of individual trials for the exp: 30.
// Assuming an average reading time of 10 seconds (?) and average letter sequence choosing time of 5 seconds (?),
// experiment could take about 7.5 minutes.

export class ExperimentBloc extends Bloc<ExperimentEvent, ExperimentState> {
    private readonly appBloc: AppBloc;

    private maxReadingTime: number = -1;
    private practice: boolean = false;

    private sentenceSets: Array<Array<SentenceSetDescription>> = [];
    private letterSets: Array<Array<string>> = [];
    private currentSetIndex: number = 0;
    private currentSetOffset: number = 0;

    private sentencesResult: SentenceResult = new SentenceResult();
    private lettersResult: LetterResult = new LetterResult();

    private currentTrialSentenceErrors: number = 0;

    constructor(appBloc: AppBloc,
                initialState: ExperimentState = new CombinedInstructions1State(),) {
        super(initialState);
        this.appBloc = appBloc;
    }

    reset(practice: boolean, maxReadingTime: number) {
        this.maxReadingTime = maxReadingTime;
        console.debug("Max reading time for this portion: " + this.maxReadingTime);
        this.practice = practice;
        this.sentenceSets = [];
        this.letterSets = [];
        this.sentencesResult = new SentenceResult();
        this.lettersResult = new LetterResult();
        this.currentSetIndex = 0;
        this.currentSetOffset = 0;

        if (practice) {
            this.generatePracticeSets();
            this.add(new StartPracticeBothEvent());
        } else {
            this.generateExperimentSets();
            this.add(new StartExperimentEvent());
        }

        console.assert(this.sentenceSets.length === this.letterSets.length);
    }

    async* mapEventToState(event: ExperimentEvent): AsyncIterableIterator<ExperimentState> {
        switch (event.eventType) {
            case ExperimentEventType.START_PRACTICE_BOTH:
                yield new CombinedInstructions1State();
                break;
            case ExperimentEventType.COMBINED_INSTRUCTIONS1_CLICKED:
                yield new CombinedInstructions2State();
                break;
            case ExperimentEventType.COMBINED_INSTRUCTIONS2_CLICKED:
                yield new CombinedInstructions3State();
                break;
            case ExperimentEventType.START_EXPERIMENT:
                yield new ExperimentStartScreenState();
                break;
            case ExperimentEventType.COMBINED_INSTRUCTIONS3_CLICKED:
            case ExperimentEventType.EXPERIMENT_START_CLICKED:
                this.nextTrial().then();
                break;
            case ExperimentEventType.SHOW_SENTENCE:
                let sentenceEvent = (event as ShowSentenceEvent);
                yield new ShowingSentenceState(
                    sentenceEvent.sentence,
                    sentenceEvent.expectedResponse,
                    this.maxReadingTime);
                break;
            case ExperimentEventType.SENTENCE_READ:
                let readEvent = (event as SentenceReadEvent);
                yield new ShowingSensePromptState(
                    readEvent.sentence,
                    readEvent.expectedResponse,
                    readEvent.readingTimeMillis);
                break;
            case ExperimentEventType.SENTENCE_TIMED_OUT:
                // let timedOutEvent = (event as SentenceTimeoutEvent);
                // TODO: Add the timeout event to the sentences result.
                this.showLetter().then();
                break;
            case ExperimentEventType.SENSE_PROMPT_RESPONDED:
                let sensePromptEvent = (event as SensePromptRespondedEvent);
                console.debug("adding sentence input to result");
                this.sentencesResult.addInput(
                    sensePromptEvent.sentence,
                    sensePromptEvent.response,
                    sensePromptEvent.expectedResponse,
                    sensePromptEvent.readingTimeMillis);

                if (sensePromptEvent.response !== sensePromptEvent.expectedResponse) {
                    console.debug("Incorrect response, upping number of sentence errors");
                    this.currentTrialSentenceErrors++;
                }

                this.showLetter().then();
                break;
            case ExperimentEventType.ISI_DELAY:
                yield new ISIDelayState();
                break;
            case ExperimentEventType.SHOW_LETTER:
                let letterEvent = (event as ShowLetterEvent);
                yield new ShowingLetterState(letterEvent.letter);
                break;
            case ExperimentEventType.SHOW_GRID:
                yield new ShowingGridState();
                break;
            case ExperimentEventType.GRID_CONFIRMED:
                let gridEvent = (event as GridConfirmedEvent);
                this.confirmGrid(gridEvent).then();
                break;
            case ExperimentEventType.SET_FINISHED:
                yield new SetFeedbackState((event as SetFinishedEvent));
                break;
        }
    }

    async nextTrial() {
        if (this.currentSetIndex >= this.sentenceSets.length) {
            if (this.practice) {
                this.appBloc.add(new FinishedPracticeBothEvent(this.sentencesResult, this.lettersResult, this.maxReadingTime));
            } else {
                this.appBloc.add(new FinishedExperimentEvent(this.sentencesResult, this.lettersResult));
            }
            return;
        }

        if (this.currentSetOffset >= this.sentenceSets[this.currentSetIndex].length) {
            this.add(new ShowGridEvent());
            return;
        }

        await this.showSentence().then();
    }

    async showSentence() {
        let sentenceDescription = this.sentenceSets[this.currentSetIndex][this.currentSetOffset];
        this.add(new ShowSentenceEvent(sentenceDescription.sentence, sentenceDescription.expectedResponse));
    }

    async showLetter() {
        let letter = this.letterSets[this.currentSetIndex][this.currentSetOffset];

        this.add(new ISIDelayEvent());
        await wait(200);

        this.add(new ShowLetterEvent(letter));
        await wait(1000);

        this.add(new ISIDelayEvent());
        await wait(250);

        this.currentSetOffset++;
        await this.nextTrial();
    }

    async confirmGrid(event: GridConfirmedEvent) {
        let chosenLetters = event.letterOrder;
        let expectedLetters = this.letterSets[this.currentSetIndex];
        this.lettersResult.addInputs(expectedLetters, chosenLetters);

        this.currentSetOffset = 0;
        this.currentSetIndex++;

        let numberCorrectLetters = 0;

        let length = Math.min(chosenLetters.length, expectedLetters.length);

        for (let i=0; i < length; i++) {
            let chosenLetter = chosenLetters[i];
            let expectedLetter = expectedLetters[i];

            if (chosenLetter === expectedLetter) {
                numberCorrectLetters++;
            }
        }

        console.debug("number sentence trial errors: " + this.currentTrialSentenceErrors);

        this.add(new SetFinishedEvent(
            this.sentencesResult.percentCorrect(),
            numberCorrectLetters,
            expectedLetters.length,
            this.currentTrialSentenceErrors));

        this.currentTrialSentenceErrors = 0;

        await wait(2000);
        this.add(new ISIDelayEvent());
        await wait(1000);
        await this.nextTrial();
    }

    generatePracticeSets() {
        this.sentenceSets = generateSentenceSets([2, 2]);

        console.debug(this.sentenceSets);

        for (let i=0; i < 2; i++) {
            this.letterSets.push(generateLetterSet(2));
        }

        this.sentenceSets = shuffle(this.sentenceSets);
        this.letterSets = shuffle(this.letterSets);
    }

    generateExperimentSets() {
        let setLengths = [4, 4, 5, 5, 6, 6];
        setLengths = shuffle(setLengths);

        this.sentenceSets = generateSentenceSets(setLengths);

        console.debug(this.sentenceSets);

        for (let i=0; i < 6; i++) {
            let setLength = setLengths[i];
            this.letterSets.push(generateLetterSet(setLength));
        }
    }
}
