import pathlib
import cherrypy

from jinja2 import Environment, FileSystemLoader, select_autoescape

template_location = (
    pathlib.Path(__file__).parent.parent.joinpath("frontend", "templates").resolve()
)
cherrypy.log(
    "Loading jinja template engine using filesystem location: {0}".format(
        template_location
    )
)
env = Environment(
    loader=FileSystemLoader(template_location),
    autoescape=select_autoescape(["html", "xml"]),
)


def get_domain_for_templates():
    domain = cherrypy.request.app.config["global"]["root_url"]
    return domain if domain != "/" else ""
