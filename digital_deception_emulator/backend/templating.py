import pathlib

from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader(pathlib.Path(__file__).parent.joinpath("frontend", "templates").resolve()),
    autoescape=select_autoescape(["html", "xml"]),
)
