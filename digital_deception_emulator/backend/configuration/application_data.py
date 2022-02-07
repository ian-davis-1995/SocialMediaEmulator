from cherrypy_utils import templating
from cherrypy_utils import authentication


class ApplicationData:
    def __init__(self, subdomain, template_location, api_key_filepath):
        self.subdomain = subdomain
        self.api_key_filepath = api_key_filepath
        self.template_location = template_location
        self.template_engine = templating.create_environment(template_location=template_location)
        authentication.initialize(api_key_filepath=self.api_key_filepath)

    def template_domain(self):
        return self.subdomain if self.subdomain != "/" else ""


APP = None  # type: ApplicationData


def initialize(subdomain, template_location, api_key_filepath):
    global APP
    APP = ApplicationData(
        subdomain=subdomain,
        template_location=template_location,
        api_key_filepath=api_key_filepath,
    )
    return APP
