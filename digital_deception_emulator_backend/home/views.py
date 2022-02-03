import cherrypy

from digital_deception_emulator_backend import templating
from digital_deception_emulator_backend.domain import get_domain
from digital_deception_emulator_backend.experiment.models import ExperimentEventRecord

from cherrypy_utils import url_utils
from cherrypy_utils.login import models


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class HomeView(object):
    def GET(self, test_id):
        if not test_id:
            test_id = 0

        return templating.env.get_template("index.html").render(
            practiceMode="false", showHeatmap="false", testId=test_id, heatmapData=[]
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class PracticeView(object):
    def GET(self, test_id):
        if not test_id:
            test_id = 0

        return templating.env.get_template("index.html").render(
            practiceMode="true", showHeatmap="false", testId=test_id, heatmapData=[]
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class DashboardView(object):
    def GET(self):
        if not models.ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(get_domain(), "login"))

        return templating.env.get_template("researcher_dashboard.html").render()


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class HeatmapView(object):
    def GET(self, test_id=None):
        if not models.ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(get_domain(), "login"))

        if not test_id:
            raise cherrypy.HTTPError(status=400, message="No test id provided!")

        query = (
            cherrypy.request.databases["digital_deception"]
            .query(ExperimentEventRecord)
            .filter(ExperimentEventRecord.test_id == test_id, ExperimentEventRecord.event_type == "heatmap_mouse_event")
        )
        query.order_by(ExperimentEventRecord.timestamp)
        data = [entity.to_dict() for entity in query.all()]

        return templating.env.get_template("index.html").render(showHeatmap="true", heatmapData=data, testId=test_id)
