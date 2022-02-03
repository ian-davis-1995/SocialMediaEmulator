import {Bloc} from "@felangel/bloc";
import {AppBloc} from "../AppBloc";
import {LetterResult} from "../results/LetterResult";
import {wait} from "../utils/async";
import {
    GridConfirmedEvent,
    HideLetterEvent,
    LetterPracticeStartedEvent,
    ShowGridEvent,
    ShowLetterEvent
} from "../events/LetterEvents";
import {
    HidingLetterState,
    ShowingGridState, ShowingLetterState, ShowingPracticeLetterFeedbackState
} from "../states/LetterStates";
import {FinishedPracticeLettersEvent} from "../events/AppEvent";
import {letters} from "../stimuli/letters";
import {ExperimentState} from "../states/ExperimentState";
import {
    LetterInstructions1State,
    LetterInstructions2State,
    LetterInstructions3State
} from "../states/InstructionsStates";
import {ExperimentEvent, ExperimentEventType} from "../events/ExperimentEvent";


export class PracticeLetterBloc extends Bloc<ExperimentEvent, ExperimentState> {
    private lettersToShow: number = 2;
    private cycles: number = 2;
    private result: LetterResult = new LetterResult();
    private properLetters: Array<String> = [];
    private appBloc: AppBloc;

    constructor(appBloc: AppBloc, initialState: ExperimentState = new LetterInstructions1State()) {
        super(initialState);
        this.appBloc = appBloc;
    }

    async* mapEventToState(event: ExperimentEvent): AsyncIterableIterator<ExperimentState> {
        console.debug("Practice Letter Bloc got new event: " + ExperimentEventType[event.eventType]);
        switch (event.eventType) {
            case ExperimentEventType.LETTER_INSTRUCTIONS1_CLICKED:
                yield new LetterInstructions2State();
                break;
            case ExperimentEventType.LETTER_INSTRUCTIONS2_CLICKED:
                yield new LetterInstructions3State();
                break;
            case ExperimentEventType.LETTER_PRACTICE_STARTED:
                this.mapPracticeEvent().then(() => {
                });
                break;
            case ExperimentEventType.SHOW_LETTER:
                yield new ShowingLetterState((event as ShowLetterEvent).letter);
                break;
            case ExperimentEventType.HIDE_LETTER:
                yield new HidingLetterState();
                break;
            case ExperimentEventType.SHOW_GRID:
                yield new ShowingGridState();
                break;
            case ExperimentEventType.GRID_CONFIRMED:
                console.debug("Adding inputs to result");
                let properEvent = (event as GridConfirmedEvent);
                let numberTotal = this.properLetters.length;
                let numberCorrect = 0;

                for (let i = 0; i < properEvent.letterOrder.length; i++) {
                    if (i >= numberTotal) {
                        break;
                    }

                    let selectedLetter = properEvent.letterOrder[i];
                    let properLetter = this.properLetters[i];

                    if (selectedLetter === properLetter) {
                        numberCorrect++;
                    }
                }

                this.mapGridConfirmedEvent(event).then(() => {
                });
                yield new ShowingPracticeLetterFeedbackState(numberCorrect, numberTotal);
                break;
        }
    }

    async mapPracticeEvent() {
        for (let i = 0; i < this.lettersToShow; i++) {
            console.debug("Creating events for letter index " + i);
            let letter = letters[Math.floor(Math.random() * letters.length)];
            this.properLetters.push(letter);
            console.debug("Adding Show Letter event for letter: " + letter + " at time " + new Date().getMilliseconds());
            this.add(new ShowLetterEvent(letter));
            await wait(1000);
            this.add(new HideLetterEvent());
            await wait(250);
        }

        this.add(new ShowGridEvent());
    }

    async mapGridConfirmedEvent(event: ExperimentEvent) {
        this.result.addInputs(this.properLetters, (event as GridConfirmedEvent).letterOrder);
        this.properLetters = [];

        await wait(1500);

        if (this.cycles > 1) {
            this.cycles--;
            console.debug("Still " + this.cycles + " left to go, starting again");
            this.add(new LetterPracticeStartedEvent());
        } else {
            console.debug("Going to practice sentence state");
            this.appBloc.add(new FinishedPracticeLettersEvent(this.result));
        }
    }
}
