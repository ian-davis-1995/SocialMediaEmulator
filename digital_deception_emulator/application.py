import argparse
import json
import os
import pathlib

import cherrypy


# noinspection PyUnresolvedReferences
from cherrypy_utils import authentication
from cherrypy_utils import url_utils
from cherrypy_utils.cherrypy_sqlalchemy_utils import SQLAlchemyTool, SQLAlchemyPlugin

# noinspection PyUnresolvedReferences
from digital_deception_emulator.backend import templating
from digital_deception_emulator.backend import domain
from digital_deception_emulator.backend.database import Base
from digital_deception_emulator.backend.experiment.api import ExperimentTestApi, ExperimentEventApi
from digital_deception_emulator.backend.home.views import HomeView, DashboardView, HeatmapView, PracticeView
from digital_deception_emulator.backend.export.api import ExperimentExportApi
from digital_deception_emulator.backend.login.views import LoginView
from digital_deception_emulator.backend.rspan.api import RSPANTestApi
from digital_deception_emulator.backend.rspan.models.test_sentences import ReadingSpanSentence
from digital_deception_emulator.backend.rspan.views import RSPANView
from digital_deception_emulator.backend.configuration import production_config, development_config


def initialize_db(session):
    ReadingSpanSentence.initialize_sentences(session)


def setup_server(subdomain="/", production=False):
    server_directory = pathlib.Path(__file__).parent.absolute()
    authentication.initialize(api_key_filepath=server_directory.joinpath("backend", "configuration", "api.key"))

    cherrypy._cpconfig.environments["production"]["log.screen"] = True

    if production:
        cherrypy.log("Using production configuration")
        active_file = production_config.get_config()
    elif not production:
        cherrypy.log("Using development configuration")
        active_file = development_config.get_config()

    cherrypy.config.update(active_file)

    cherrypy._cperror._HTTPErrorTemplate = cherrypy._cperror._HTTPErrorTemplate.replace(
        'Powered by <a href="http://www.cherrypy.org">CherryPy %(version)s</a>\n', ""
    )
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.tools.digital_deception_database = SQLAlchemyTool("digital_deception")

    domain.set_domain(subdomain)

    cherrypy.tree.mount(HomeView(), subdomain, active_file)
    cherrypy.tree.mount(PracticeView(), url_utils.combine_url(subdomain, "practice"), active_file)
    cherrypy.tree.mount(LoginView(), url_utils.combine_url(subdomain, "login"), active_file)
    cherrypy.tree.mount(HeatmapView(), url_utils.combine_url(subdomain, "heatmap"), active_file)
    cherrypy.tree.mount(DashboardView(), url_utils.combine_url(subdomain, "dashboard"), active_file)
    cherrypy.tree.mount(ExperimentTestApi(), url_utils.combine_url(subdomain, "api", "test"), active_file)
    cherrypy.tree.mount(ExperimentEventApi(), url_utils.combine_url(subdomain, "api", "event"), active_file)
    cherrypy.tree.mount(ExperimentExportApi(), url_utils.combine_url(subdomain, "api", "export"), active_file)
    cherrypy.tree.mount(RSPANTestApi(), url_utils.combine_url(subdomain, "rspan", "api", "result"), active_file)
    cherrypy.tree.mount(RSPANView(), url_utils.combine_url(subdomain, "rspan", "index"), active_file)

    mysql_filepath = str(server_directory.joinpath("mysql.credentials").resolve())

    # mysql connection:
    # mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
    if os.path.exists(mysql_filepath):
        with open(mysql_filepath, "r") as mysql_credentials_file:
            credentials = json.load(mysql_credentials_file)
            connection_string = str("mysql+pymysql://{username}:{password}@{host}/{db_name}").format_map(credentials)
    else:
        cherrypy.log("Using sqlite database file in lieu of mysql credentials!")
        database_filepath = str(server_directory.joinpath("digital_deception.db").resolve())
        connection_string = "sqlite:///" + database_filepath

    SQLAlchemyPlugin(
        "digital_deception",
        cherrypy.engine,
        Base,
        connection_string,
        echo=False,
        pool_recycle=20000,
        after_engine_setup=initialize_db,
    )

    cherrypy.log("Publishing db create for digital_deception")
    cherrypy.engine.publish("digital_deception.db.create")


def run(production=False):
    setup_server(production=production)

    cherrypy.engine.signals.subscribe()

    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Run the Digital Deception Emulator web server")
    parser.add_argument("--production", action="store_true", help="Enable production mode")
    args = parser.parse_args()
    run(production=args.production)
