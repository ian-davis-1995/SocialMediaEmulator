import argparse
import json
import os
import pathlib

import cherrypy

from cherrypy_utils import url_utils
from cherrypy_utils.cherrypy_sqlalchemy_utils import SQLAlchemyTool, SQLAlchemyPlugin

from oswald_reading_span.application import setup_server as setup_reading_span

from digital_deception_emulator.backend.database import Base
from digital_deception_emulator.backend.experiment.api import (
    ExperimentTestApi,
    ExperimentEventApi,
)
from digital_deception_emulator.backend.home.views import (
    HomeView,
    DashboardView,
    HeatmapView,
    PracticeView,
)
from digital_deception_emulator.backend.export.api import ExperimentExportApi
from digital_deception_emulator.backend.login.views import LoginView
from digital_deception_emulator.backend.configuration import (
    production_config,
    development_config,
    application_data,
)


def setup_server(subdomain="/", shared_data_location=None, production=True):
    server_directory = pathlib.Path(__file__).parent.absolute()
    cherrypy.log("looking for digital deception assets at {0}".format(server_directory))
    template_location = server_directory.joinpath("frontend", "templates").resolve()
    api_key_filepath = server_directory.joinpath("backend", "configuration", "api.key").resolve()

    if not shared_data_location:
        shared_data_location = server_directory

    cherrypy.log("=" * 100)
    cherrypy.log("DIGITAL DECEPTION EMULATOR INIT SECTION")
    cherrypy.log("-" * 100)
    cherrypy.log("server_root found at {0}".format(server_directory))
    cherrypy.log("using shared data root {0}".format(shared_data_location))

    application_data.initialize(
        subdomain=subdomain,
        application_location=server_directory,
        shared_data_location=server_directory,
        template_location=template_location,
        api_key_filepath=api_key_filepath,
        production=production,
    )

    cherrypy._cpconfig.environments["production"]["log.screen"] = True

    if production:
        cherrypy.log("Using production configuration")
        active_file = production_config.get_config()
    else:
        cherrypy.log("Using development configuration")
        active_file = development_config.get_config()

    cherrypy.config.update(active_file)

    cherrypy._cperror._HTTPErrorTemplate = cherrypy._cperror._HTTPErrorTemplate.replace(
        'Powered by <a href="http://www.cherrypy.org">CherryPy %(version)s</a>\n', ""
    )
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.tools.digital_deception_database = SQLAlchemyTool("digital_deception")

    cherrypy.tree.mount(HomeView(), subdomain, active_file)
    cherrypy.tree.mount(PracticeView(), url_utils.combine_url(subdomain, "practice"), active_file)
    cherrypy.tree.mount(LoginView(), url_utils.combine_url(subdomain, "login"), active_file)
    cherrypy.tree.mount(HeatmapView(), url_utils.combine_url(subdomain, "heatmap"), active_file)
    cherrypy.tree.mount(DashboardView(), url_utils.combine_url(subdomain, "dashboard"), active_file)
    cherrypy.tree.mount(ExperimentTestApi(), url_utils.combine_url(subdomain, "api", "test"), active_file)
    cherrypy.tree.mount(ExperimentEventApi(), url_utils.combine_url(subdomain, "api", "event"), active_file)
    cherrypy.tree.mount(ExperimentExportApi(), url_utils.combine_url(subdomain, "api", "export"), active_file)

    mysql_filepath = str(server_directory.joinpath("backend", "configuration", "mysql.credentials").resolve())

    # mysql connection:
    # mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
    if os.path.exists(mysql_filepath):
        with open(mysql_filepath, "r") as mysql_credentials_file:
            credentials = json.load(mysql_credentials_file)
            connection_string = str("mysql+pymysql://{username}:{password}@{host}/{db_name}").format_map(credentials)
    else:
        cherrypy.log("Using sqlite database file in lieu of mysql credentials!")
        database_filepath = str(pathlib.Path(shared_data_location, "digital_deception.db").resolve())
        connection_string = "sqlite:///" + database_filepath

    SQLAlchemyPlugin(
        "digital_deception",
        cherrypy.engine,
        Base,
        connection_string,
        echo=False,
        pool_recycle=20000,
    )

    rspan_domain = url_utils.combine_url(subdomain, "rspan")
    cherrypy.log("setting up rspan application at {0}".format(rspan_domain))
    setup_reading_span(subdomain=rspan_domain, production=production)

    cherrypy.log("Publishing db create for digital_deception")
    cherrypy.engine.publish("digital_deception.db.create")

    cherrypy.log("END DIGITAL DECEPTION EMULATOR INIT")
    cherrypy.log("=" * 100)


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
