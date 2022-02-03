import cherrypy

from digital_deception_emulator_backend import templating
from digital_deception_emulator_backend import domain
from cherrypy_utils import url_utils
from cherrypy_utils.login.models import authenticate_user, ldap_user_authenticated


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class LoginView(object):
    def GET(self):
        if ldap_user_authenticated():
            raise cherrypy.HTTPRedirect(url_utils.combine_url(domain.get_domain(), "dashboard"))
        else:
            return templating.env.get_template("login.html").render(invalid=False)

    def POST(self, username=None, password=None):
        if not authenticate_user(username, password):
            return templating.env.get_template("login.html").render(invalid=True, username=username)
        else:
            raise cherrypy.HTTPRedirect(url_utils.combine_url(domain.get_domain(), "dashboard"))
