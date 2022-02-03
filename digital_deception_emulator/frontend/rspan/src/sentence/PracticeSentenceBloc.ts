import { Bloc } from "@felangel/bloc";
import { SentenceResult } from "../results/SentenceResult";
import { wait } from "../utils/async";
import { AppBloc } from "../AppBloc";

import {
  SensePromptRespondedEvent,
  SentencePracticeStartedEvent,
  SentenceReadEvent,
  ShowSentenceEvent,
} from "../events/SentenceEvents";
import {
  ShowingSensePromptState,
  ShowingSentenceFeedbackState,
  ShowingSentenceState,
} from "../states/SentenceStates";

import { FinishedPracticeSentenceEvent } from "../events/AppEvent";
import { expectedResponses, sentences } from "../stimuli/practice-sentences";
import { ExperimentState } from "../states/ExperimentState";

import {
  SentenceInstructions1State,
  SentenceInstructions2State,
  SentenceInstructions3State,
} from "../states/InstructionsStates";
import {
  ExperimentEvent,
  ExperimentEventType,
} from "../events/ExperimentEvent";

export class PracticeSentenceBloc extends Bloc<
  ExperimentEvent,
  ExperimentState
> {
  private sentencesToShow: number = 15;
  private sentencesResult: SentenceResult = new SentenceResult();
  private appBloc: AppBloc;

  constructor(
    appBloc: AppBloc,
    initialState: ExperimentState = new SentenceInstructions1State()
  ) {
    super(initialState);
    this.appBloc = appBloc;
  }

  async *mapEventToState(
    event: ExperimentEvent
  ): AsyncIterableIterator<ExperimentState> {
    console.debug(
      "Practice Sentence Bloc got new event: " +
        ExperimentEventType[event.eventType]
    );
    switch (event.eventType) {
      case ExperimentEventType.SENTENCE_INSTRUCTIONS1_CLICKED:
        yield new SentenceInstructions2State();
        break;
      case ExperimentEventType.SENTENCE_INSTRUCTIONS2_CLICKED:
        yield new SentenceInstructions3State();
        break;
      case ExperimentEventType.SENTENCE_PRACTICE_STARTED:
        this.mapPracticeEvent().then(() => {});
        break;
      case ExperimentEventType.SHOW_SENTENCE:
        let sentenceEvent = event as ShowSentenceEvent;
        yield new ShowingSentenceState(
          sentenceEvent.sentence,
          sentenceEvent.expectedResponse
        );
        break;
      case ExperimentEventType.SENTENCE_READ:
        let readEvent = event as SentenceReadEvent;
        console.debug(
          `[SENTENCE_PRACTICE][SENTENCE_READ] - READING TIME = ${readEvent.readingTimeMillis}`
        );
        yield new ShowingSensePromptState(
          readEvent.sentence,
          readEvent.expectedResponse,
          readEvent.readingTimeMillis
        );
        break;
      case ExperimentEventType.SENSE_PROMPT_RESPONDED:
        let sensePromptEvent = event as SensePromptRespondedEvent;
        this.mapSensePromptResponded(sensePromptEvent).then(() => {});
        yield new ShowingSentenceFeedbackState(
          sensePromptEvent.sentence,
          sensePromptEvent.expectedResponse,
          sensePromptEvent.response,
          sensePromptEvent.readingTimeMillis
        );
        break;
    }
  }

  async mapPracticeEvent() {
    if (this.sentencesToShow <= 0) {
      return;
    }

    this.sentencesToShow--;
    await wait(500);
    let index = Math.floor(Math.random() * sentences.length);
    let sentence = sentences[index];
    let expectedResponse = expectedResponses[index];

    while (this.sentencesResult.sentences.indexOf(sentence) !== -1) {
      index = Math.floor(Math.random() * sentences.length);
      sentence = sentences[index];
      expectedResponse = expectedResponses[index];
    }

    this.add(new ShowSentenceEvent(sentence, expectedResponse));
  }

  async mapSensePromptResponded(event: SensePromptRespondedEvent) {
    this.sentencesResult.addInput(
      event.sentence,
      event.response,
      event.expectedResponse,
      event.readingTimeMillis
    );

    if (this.sentencesToShow > 0) {
      this.add(new SentencePracticeStartedEvent());
    } else {
      this.appBloc.add(new FinishedPracticeSentenceEvent(this.sentencesResult));
    }
  }
}
