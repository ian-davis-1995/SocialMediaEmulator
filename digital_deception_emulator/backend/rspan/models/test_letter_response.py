from digital_deception_emulator.backend.rspan.stimuli.sentences import SENTENCES

from typing import Dict
from sqlalchemy import Column, Text, Integer

from digital_deception_emulator.backend.database import Base, BaseEventRecord


class ReadingSpanLetterResponse(Base, BaseEventRecord):
    __tablename__ = "ReadingSpanLetterResponse"

    test_id = Column(Integer, nullable=False)
    proper_letters = Column(Text, nullable=False)
    chosen_letters = Column(Text, nullable=False)
    number_correct = Column(Integer, nullable=False)
    total_letters = Column(Integer, nullable=False)

    @classmethod
    def _parse_dict(cls, data: Dict) -> Dict:
        return data

    def _to_dict(self, *_, **__):
        return {
            "proper_letter": self.proper_letter,
            "chosen_letter": self.chosen_letter,
            "number_correct": self.number_correct,
            "total_letters": self.total_letters,
        }
