import cherrypy

from digital_deception_emulator_backend.experiment.models import ExperimentEventRecord, ExperimentTestRecord
from cherrypy_utils import json_utils


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class ExperimentEventApi(object):
    def GET(self, test_id=None, event_type=None):
        if not test_id:
            raise cherrypy.HTTPError(status=400, message="No test id provided!")

        query = (
            cherrypy.request.databases["digital_deception"]
            .query(ExperimentEventRecord)
            .filter(ExperimentEventRecord.test_id == test_id)
        )

        if event_type:
            query = query.filter(ExperimentEventRecord.event_type == event_type)

        query.order_by(ExperimentEventRecord.timestamp)
        cherrypy.response.status = "200 OK"

        return [entity.to_dict() for entity in query.all()]

    def PUT(self):
        entities = json_utils.convert_request_to_entities(ExperimentEventRecord.from_dict)

        cherrypy.request.databases["digital_deception"].add_all(entities)
        cherrypy.request.databases["digital_deception"].flush()
        cherrypy.response.status = "201 Created"

        data = [entity.to_dict() for entity in entities]
        # cherrypy.log("Putting Experiment Event Records in database:")
        # cherrypy.log(json.dumps(data, indent=4, sort_keys=True))
        return data


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class ExperimentTestApi(object):
    results_per_page = 25

    def GET(self, subject_id=None, page=0):
        query = cherrypy.request.databases["digital_deception"].query(ExperimentTestRecord)

        if subject_id:
            query = query.filter(ExperimentTestRecord.subject_id == subject_id)

        query.order_by(ExperimentTestRecord.timestamp)
        cherrypy.response.status = "200 OK"

        return [entity.to_dict(include_posts=False) for entity in query.all()]

    def PUT(self):
        entities = json_utils.convert_request_to_entities(ExperimentTestRecord.from_dict)

        cherrypy.request.databases["digital_deception"].add_all(entities)
        cherrypy.request.databases["digital_deception"].flush()
        cherrypy.response.status = "201 Created"

        return [entity.to_dict() for entity in entities]
