import cherrypy

from cherrypy_utils import url_utils
from cherrypy_utils.login.models import authenticate_user, ldap_user_authenticated

from digital_deception_emulator.backend.configuration import application_data


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class LoginView:
    def GET(self):
        if ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(
                url_utils.combine_url(cherrypy.request.app.config["global"]["root_url"], "dashboard")
            )
        else:
            return application_data.get_app().template_engine.get_template("login.html.j2").render(invalid=False)

    def POST(self, username=None, password=None):
        if not authenticate_user(username, password):
            return (
                application_data.get_app()
                .template_engine.get_template("login.html.j2")
                .render(invalid=True, username=username)
            )
        else:
            raise cherrypy.HTTPRedirect(
                url_utils.combine_url(cherrypy.request.app.config["global"]["root_url"], "dashboard")
            )
