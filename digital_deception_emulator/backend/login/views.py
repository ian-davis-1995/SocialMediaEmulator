import cherrypy

from digital_deception_emulator.backend.configuration import application_data


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class LoginView:
    def GET(self):
        app = application_data.get_app()

        # This will unfortunately use a hardcoded ldap server ip address that can't be modified.
        # Use of a different authentication function would be required here.
        if app.user_is_authenticated():
            raise cherrypy.HTTPRedirect(app.login_redirect_url)
        else:
            return (
                application_data.get_app()
                .template_engine.get_template("login.html.j2")
                .render(invalid=False)
            )

    def POST(self, username=None, password=None):
        app = application_data.get_app()

        if not app.authenticate_user(username, password):
            return (
                application_data.get_app()
                .template_engine.get_template("login.html.j2")
                .render(invalid=True, username=username)
            )
        else:
            raise cherrypy.HTTPRedirect(app.login_redirect_url)
