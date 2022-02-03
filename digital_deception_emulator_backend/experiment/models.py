import json
from typing import Dict

from sqlalchemy import Column, DATETIME, Text, String, Integer

from digital_deception_emulator_backend.database import Base, BaseEventRecord
from cherrypy_utils import timestamp_utils


class ExperimentTestRecord(Base, BaseEventRecord):
    __tablename__ = "ExperimentTests"

    timestamp = Column(
        DATETIME(timezone=True), nullable=False, server_default=timestamp_utils.default_timestamp().isoformat()
    )
    subject_id = Column(String(512), nullable=False)
    emulator_version = Column(String(512), server_default="1.0.0", nullable=False)
    posts_ = Column(Text(), nullable=False)

    @classmethod
    def _parse_dict(cls, data: Dict) -> Dict:
        data = timestamp_utils.convert_dictionary_keys(
            data,
            [
                "timestamp",
            ],
        )
        data["posts_"] = json.dumps(data["posts"])
        del data["posts"]
        return data

    def _to_dict(self, events=None, include_posts=True):
        if include_posts:
            data = {
                "timestamp": self.timestamp.isoformat(),
                "emulator_version": self.emulator_version,
                "subject_id": self.subject_id,
                "posts": json.loads(self.posts_),
            }
        else:
            data = {
                "timestamp": self.timestamp.isoformat(),
                "emulator_version": self.emulator_version,
                "subject_id": self.subject_id,
            }

        if events:
            json_events = []

            for event in events:
                json_events.append(event.to_dict())

            data["events"] = json_events

        return data

    @property
    def posts(self):
        return json.loads(self.posts_)


class ExperimentEventRecord(Base, BaseEventRecord):
    __tablename__ = "ExperimentEvents"

    timestamp = Column(
        DATETIME(timezone=True), nullable=False, server_default=timestamp_utils.default_timestamp().isoformat()
    )
    test_id = Column(Integer, nullable=False)
    event_type = Column(String(512), nullable=False)
    event_data_ = Column(String(4096), nullable=False)

    @classmethod
    def _parse_dict(cls, data: Dict) -> Dict:
        # We dump the data into a JSON string so that it can be stored in the database properly.
        data = timestamp_utils.convert_dictionary_keys(
            data,
            [
                "timestamp",
            ],
        )
        data["event_data_"] = json.dumps(data["event_data"])
        del data["event_data"]
        return data

    def _to_dict(self):
        return {
            "timestamp": self.timestamp.isoformat(),
            "event_type": self.event_type,
            "event_data": self.event_data,
        }

    @property
    def event_data(self):
        return json.loads(self.event_data_)
