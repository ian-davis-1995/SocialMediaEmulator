import cherrypy
import json

from digital_deception_emulator.backend.rspan.models.test_letter_response import (
    ReadingSpanLetterResponse,
)
from digital_deception_emulator.backend.rspan.models.test_result import (
    ReadingSpanResult,
)
from digital_deception_emulator.backend.rspan.models.test_sentence_response import (
    ReadingSpanSentenceResponse,
)

from digital_deception_emulator.backend.rspan.stimuli.sentences import SENTENCE_LIST

from cherrypy_utils import json_utils


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class RSPANTestApi:
    def GET(self, subject_id=None):
        return {"message": "GET api not yet implemented!"}

    def PUT(self):
        request_json = json_utils.get_request_json()
        session = cherrypy.request.databases["digital_deception"]

        with open("./last_upload_data.json", "w") as json_file:
            json.dump(request_json, json_file)

        if isinstance(request_json, dict):
            self.parse_entity(session, request_json)
        elif isinstance(request_json, list):
            for entity in request_json:
                self.parse_entity(session, entity)

        session.flush()
        cherrypy.response.status = "201 Created"

        return {"message": "put completed successfully"}

    def parse_entity(self, session, entity):
        result = ReadingSpanResult.from_dict(
            {
                "timestamp": entity["timestamp"],
                "subject_id": entity["subject_id"],
                "experiment_version": entity["experiment_version"],
            }
        )
        session.add(result)
        session.commit()
        session.refresh(result)
        sentence_result = entity["sentence_result"]
        letter_result = entity["letter_result"]

        for sentence, response, reading_time in zip(
            sentence_result["sentences"],
            sentence_result["responses"],
            sentence_result["reading_times"],
        ):
            sentence_id = SENTENCE_LIST.index(sentence)
            response = ReadingSpanSentenceResponse(
                test_id=result.id,
                sentence_id=sentence_id,
                response=response,
                reading_time=reading_time,
            )
            session.add(response)

        for proper_letters, chosen_letters in zip(
            letter_result["proper_letters"],
            letter_result["chosen_letters"],
        ):
            response = ReadingSpanLetterResponse(
                test_id=result.id,
                proper_letters=",".join(proper_letters),
                chosen_letters=",".join(chosen_letters),
                number_correct=letter_result["number_correct"],
                total_letters=letter_result["total_letters"],
            )
            session.add(response)
