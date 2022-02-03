import { LetterResult } from "../../results/LetterResult";
import { SentenceResult } from "../../results/SentenceResult";
import { deserializeLetterResult, SerializedLetterResult, serializeLetterResult } from "./letter_message";
import { deserializeSentenceResult, SerializedSentenceMessage, serializeSentenceResult } from "./sentence_message";

export interface SerializedResultMessage {
    subject_id: string;
    experiment_version: string;
    timestamp: string;
    letter_result: SerializedLetterResult;
    sentence_result: SerializedSentenceMessage;
}

export interface ResultMessage {
    subject_id: string;
    experiment_version: string;
    timestamp: Date;
    letter_result: LetterResult;
    sentence_result: SentenceResult;
}

export function serializeResultMessage(subjectId: string, experimentVersion: string, timestamp: Date, letterResult: LetterResult, sentenceResult: SentenceResult): SerializedResultMessage {
    return {
        subject_id: subjectId,
        experiment_version: experimentVersion,
        timestamp: timestamp.toISOString(),
        letter_result: serializeLetterResult(letterResult),
        sentence_result: serializeSentenceResult(sentenceResult),
    };
}

export function deserializeResultMessage(result: SerializedResultMessage): ResultMessage {
    return {
        subject_id: result.subject_id,
        experiment_version: result.experiment_version,
        timestamp: new Date(result.timestamp),
        letter_result: deserializeLetterResult(result.letter_result),
        sentence_result: deserializeSentenceResult(result.sentence_result),
    };
}