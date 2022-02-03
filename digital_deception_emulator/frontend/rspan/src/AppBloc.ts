import { Bloc } from "@felangel/bloc";
import {
  AppState,
  FinishedExperimentState,
  PracticeBothState,
  PracticeLettersState,
  PracticeSentenceState,
  RunningExperimentState,
  UploadingExperimentState,
} from "./states/AppState";
import {
  AppEvent,
  AppEventType,
  FinishedExperimentEvent,
  FinishedPracticeBothEvent,
  FinishedPracticeLettersEvent,
  FinishedPracticeSentenceEvent,
} from "./events/AppEvent";
import ServerDriver from "./network/server_driver";

export class AppBloc extends Bloc<AppEvent, AppState> {
  readonly experimentVersion: string;
  readonly subjectId: string;
  readonly timestamp: Date;
  readonly serverDriver: ServerDriver;
  readonly onExperimentFinished: Function;

  constructor(
    initialState: AppState = new PracticeLettersState(),
    experimentVersion: string,
    subjectId: string,
    timestamp: Date,
    serverDriver: ServerDriver,
    onExperimentFinished: Function
  ) {
    super(initialState);
    this.subjectId = subjectId;
    this.experimentVersion = experimentVersion;
    this.timestamp = timestamp;
    this.serverDriver = serverDriver;
    this.onExperimentFinished = onExperimentFinished;
  }

  async *mapEventToState(event: AppEvent): AsyncIterableIterator<AppState> {
    console.debug("AppBloc got new event: " + AppEventType[event.eventType]);
    switch (event.eventType) {
      case AppEventType.FINISHED_PRACTICE_LETTERS:
        console.debug((event as FinishedPracticeLettersEvent).result);
        yield new PracticeSentenceState();
        break;

      case AppEventType.FINISHED_PRACTICE_SENTENCE:
        console.debug((event as FinishedPracticeSentenceEvent).result);
        console.debug(`[SENTENCE_PRACTICE][PRACTICE_FINISHED] - Max Reading Time Calculated: 
                                ${(
                                  event as FinishedPracticeSentenceEvent
                                ).result.maxReadingTime()}`);
        yield new PracticeBothState(
          (event as FinishedPracticeSentenceEvent).result.maxReadingTime()
        );
        break;

      case AppEventType.FINISHED_PRACTICE_BOTH:
        let finishedPracticeEvent = event as FinishedPracticeBothEvent;
        console.debug("Finished practice both -- result:");
        console.debug(finishedPracticeEvent.letterResult);
        console.debug(finishedPracticeEvent.sentenceResult);
        console.debug(finishedPracticeEvent.maxReadingTime);
        yield new RunningExperimentState(finishedPracticeEvent.maxReadingTime);
        break;

      case AppEventType.FINISHED_EXPERIMENT:
        let finishedEvent = event as FinishedExperimentEvent;
        console.debug("Finished Experiment -- Results:");
        console.debug(finishedEvent.letterResult);
        console.debug(finishedEvent.sentenceResult);
        yield new UploadingExperimentState();
        await this.uploadExperiment(finishedEvent);
        this.onExperimentFinished();
        yield new FinishedExperimentState();
        break;
    }
  }

  uploadExperiment(event: FinishedExperimentEvent): Promise<Response> {
    return this.serverDriver.uploadTestResult(
      this.subjectId,
      this.experimentVersion,
      this.timestamp,
      event.letterResult,
      event.sentenceResult
    );
  }
}
