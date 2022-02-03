from jinja2 import Environment, PackageLoader, select_autoescape

env = Environment(
    loader=PackageLoader('digital_deception.server.backend', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)
