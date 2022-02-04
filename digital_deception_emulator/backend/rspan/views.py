# noinspection PyPep8Naming, PyMethodMayBeStatic
import cherrypy

from digital_deception_emulator.backend import templating


@cherrypy.expose
class RSPANView:
    def GET(self, subjectId="missing-subject-id", qualtrics=False):
        return templating.env.get_template("rspan.html.j2").render(
            subjectId=subjectId, qualtrics=str(qualtrics).lower()
        )
