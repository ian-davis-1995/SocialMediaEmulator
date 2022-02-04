from typing import Dict
from sqlalchemy import Column, DATETIME, Text, String

from digital_deception_emulator.backend.database import Base, BaseEventRecord
from digital_deception_emulator.backend.rspan.models.test_letter_response import (
    ReadingSpanLetterResponse,
)
from digital_deception_emulator.backend.rspan.models.test_sentence_response import (
    ReadingSpanSentenceResponse,
)
from digital_deception_emulator.backend.rspan.models.test_sentences import (
    ReadingSpanSentence,
)
from cherrypy_utils import timestamp_utils


class MappedReadingSpanResult:
    def __init__(self, subject_id, emulator_version, timestamp):
        self.subject_id = subject_id
        self.emulator_version = emulator_version
        self.timestamp = timestamp
        self.sentence_responses = []
        self.letter_responses = []


class ReadingSpanResult(Base, BaseEventRecord):
    __tablename__ = "ReadingSpanResult"

    timestamp = Column(
        DATETIME(timezone=True),
        nullable=False,
        server_default=timestamp_utils.default_timestamp().isoformat(),
    )
    subject_id = Column(Text, nullable=False)
    experiment_version = Column(String(512), server_default="1.0.0", nullable=False)

    @classmethod
    def _parse_dict(cls, data: Dict) -> Dict:
        return timestamp_utils.convert_dictionary_keys(
            data,
            [
                "timestamp",
            ],
        )

    def _to_dict(self):
        return {
            "timestamp": self.timestamp.isoformat(),
            "experiment_version": self.experiment_version,
            "subject_id": self.subject_id,
        }


def get_reading_span_results(session):
    return (
        MappedReadingSpanResult(
            entity.subject_id,
            entity.experiment_version,
            entity.timestamp,
        )
        for entity in (
            session.query(ReadingSpanResult)
            .join(
                ReadingSpanSentenceResponse,
                ReadingSpanResult.id == ReadingSpanSentenceResponse.test_id,
            )
            .join(
                ReadingSpanSentence,
                ReadingSpanSentenceResponse.sentence_id == ReadingSpanSentence.id,
            )
            .join(
                ReadingSpanLetterResponse,
                ReadingSpanResult.id == ReadingSpanLetterResponse.test_id,
            )
        ).all()
    )
