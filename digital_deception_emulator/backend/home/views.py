import cherrypy

from cherrypy_utils import url_utils
from cherrypy_utils.login import models

from digital_deception_emulator.backend.configuration import application_data
from digital_deception_emulator.backend.experiment.models import ExperimentEventRecord


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class HomeView:
    def GET(self, test_id, debug="false"):
        if not test_id:
            test_id = 0

        return (
            application_data.get_app()
            .template_engine.get_template("index.html.j2")
            .render(
                domain=application_data.get_app().template_domain(),
                practiceMode="false",
                showHeatmap="false",
                testId=test_id,
                heatmapData=[],
                debug=debug,
            )
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class PracticeView:
    def GET(self, test_id):
        if not test_id:
            test_id = 0

        return (
            application_data.get_app()
            .template_engine.get_template("index.html.j2")
            .render(
                domain=application_data.get_app().template_domain(),
                practiceMode="true",
                showHeatmap="false",
                testId=test_id,
                heatmapData=[],
            )
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class DashboardView:
    def GET(self):
        if application_data.get_app().is_production_mode() and not models.ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(application_data.get_app().subdomain, "login"))

        return (
            application_data.get_app()
            .template_engine.get_template("researcher_dashboard.html.j2")
            .render(domain=application_data.get_app().template_domain())
        )


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class HeatmapView:
    def GET(self, test_id=None):
        if application_data.get_app().is_production_mode() and not models.ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(application_data.get_app().subdomain, "login"))

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
            application_data.get_app()
            .template_engine.get_template("index.html.j2")
            .render(
                domain=application_data.get_app().template_domain(),
                showHeatmap="true",
                heatmapData=data,
                testId=test_id,
            )
        )
