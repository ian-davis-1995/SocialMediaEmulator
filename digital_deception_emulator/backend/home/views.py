import cherrypy

from cherrypy_utils import url_utils
from cherrypy_utils.login import models

from digital_deception_emulator.backend.configuration.application_data import APP
from digital_deception_emulator.backend.experiment.models import ExperimentEventRecord


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class HomeView:
    def GET(self, test_id):
        if not test_id:
            test_id = 0

        return APP.template_engine.get_template("index.html.j2").render(
            domain=APP.template_domain(),
            practiceMode="false",
            showHeatmap="false",
            testId=test_id,
            heatmapData=[],
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class PracticeView:
    def GET(self, test_id):
        if not test_id:
            test_id = 0

        return APP.template_engine.env.get_template("index.html.j2").render(
            domain=APP.template_domain(),
            practiceMode="true",
            showHeatmap="false",
            testId=test_id,
            heatmapData=[],
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class DashboardView:
    def GET(self):
        if not models.ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(APP.subdomain, "login"))

        return APP.template_engine.env.get_template("researcher_dashboard.html.j2").render()


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class HeatmapView:
    def GET(self, test_id=None):
        if not models.ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(APP.subdomain, "login"))

        if not test_id:
            raise cherrypy.HTTPError(status=400, message="No test id provided!")

        query = (
            cherrypy.request.databases["digital_deception"]
            .query(ExperimentEventRecord)
            .filter(
                ExperimentEventRecord.test_id == test_id,
                ExperimentEventRecord.event_type == "heatmap_mouse_event",
            )
        )
        query.order_by(ExperimentEventRecord.timestamp)
        data = [entity.to_dict() for entity in query.all()]

        return (
            APP.template_engine
            .env.get_template("index.html.j2")
            .render(
                domain=APP.template_domain(),
                showHeatmap="true",
                heatmapData=data,
                testId=test_id,
            )
        )
