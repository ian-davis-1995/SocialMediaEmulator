import argparse
import json
import pathlib
import cherrypy

from cherrypy_utils.url_utils import combine_url
from cherrypy_utils.cherrypy_sqlalchemy_utils import SQLAlchemyTool, SQLAlchemyPlugin
from social_media_emulator.backend.configuration.base_config import (
    get_api_config,
    get_global_config,
    get_root_config,
    get_simple_config,
)

from social_media_emulator.backend.database import Base
from social_media_emulator.backend.experiment.api import (
    ExperimentTestApi,
    ExperimentEventApi,
)
from social_media_emulator.backend.home.views import (
    HomeView,
    DashboardView,
    HeatmapView,
    PracticeView,
)
from social_media_emulator.backend.export.api import ExperimentExportApi
from social_media_emulator.backend.login.views import LoginView
from social_media_emulator.backend.configuration import (
    application_data,
)


def setup_server(subdomain="/", shared_data_location=None, production=True):
    server_directory = pathlib.Path(__file__).parent.absolute()
    template_location = server_directory.joinpath("frontend", "templates").resolve()
    api_key_filepath = server_directory.joinpath(
        "backend", "configuration", "api.key"
    ).resolve()

    if not shared_data_location:
        shared_data_location = server_directory

    cherrypy.log("=" * 100)
    cherrypy.log("DIGITAL DECEPTION EMULATOR INIT SECTION")
    cherrypy.log("-" * 100)
    cherrypy.log("looking for digital deception assets at {0}".format(server_directory))
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
        cherrypy.config.update({"environment": "production"})
    else:
        cherrypy.log("Using development configuration")

    cherrypy.config.update(get_global_config())
    root_config = get_root_config()
    route_config = get_simple_config()
    api_config = get_api_config()

    cherrypy._cperror._HTTPErrorTemplate = cherrypy._cperror._HTTPErrorTemplate.replace(
        'Powered by <a href="http://www.cherrypy.org">CherryPy %(version)s</a>\n', ""
    )
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.tools.digital_deception_database = SQLAlchemyTool("digital_deception")

    cherrypy.tree.mount(HomeView(), subdomain, root_config)
    cherrypy.tree.mount(
        PracticeView(),
        combine_url(subdomain, "practice"),
        route_config,
    )
    cherrypy.tree.mount(LoginView(), combine_url(subdomain, "login"), route_config)
    cherrypy.tree.mount(HeatmapView(), combine_url(subdomain, "heatmap"), route_config)
    cherrypy.tree.mount(
        DashboardView(),
        combine_url(subdomain, "dashboard"),
        route_config,
    )
    cherrypy.tree.mount(
        ExperimentTestApi(),
        combine_url(subdomain, "api", "test"),
        api_config,
    )
    cherrypy.tree.mount(
        ExperimentEventApi(),
        combine_url(subdomain, "api", "event"),
        api_config,
    )
    cherrypy.tree.mount(
        ExperimentExportApi(),
        combine_url(subdomain, "api", "export"),
        api_config,
    )

    mysql_filepath = pathlib.Path(
        server_directory,
        "backend",
        "configuration",
        "mysql.credentials",
    ).resolve()

    # mysql connection:
    # mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
    if production and mysql_filepath.exists():
        with open(mysql_filepath, "r") as mysql_credentials_file:
            credentials = json.load(mysql_credentials_file)
            connection_string = str(
                "mysql+pymysql://{username}:{password}@{host}/{db_name}"
            ).format_map(credentials)
    else:
        cherrypy.log(
            "Using sqlite database file as we aren't in production or mysql credentials doesn't exist!"
        )
        database_filepath = str(
            pathlib.Path(shared_data_location, "digital_deception.db").resolve()
        )
        connection_string = "sqlite:///" + database_filepath

    SQLAlchemyPlugin(
        "digital_deception",
        cherrypy.engine,
        Base,
        connection_string,
        echo=False,
        pool_recycle=20000,
    )

    cherrypy.log("Publishing db create for digital_deception")
    cherrypy.engine.publish("digital_deception.db.create")

    cherrypy.log("END DIGITAL DECEPTION EMULATOR INIT")
    cherrypy.log("=" * 100)


def run(subdomain="/", production=False, shared_data_location=None, port=8080):
    setup_server(
        subdomain=subdomain,
        production=production,
        shared_data_location=shared_data_location,
    )

    cherrypy.log("setting server port to:" + str(port))
    cherrypy.config.update({"server.socket_port": port})
    cherrypy.engine.signals.subscribe()

    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Run the Digital Deception Emulator web server")
    parser.add_argument(
        "--subdomain", default="/", help="The sub domain to mount the app at"
    )
    parser.add_argument(
        "--production",
        default=False,
        action="store_true",
        help="Enable production mode",
    )
    parser.add_argument(
        "--shared_data_location", help="The location of the root shared data folder"
    )
    parser.add_argument("--port", type=int, help="The port to listen on", default=8080)
    args = parser.parse_args()
    run(
        subdomain=args.subdomain,
        production=args.production,
        shared_data_location=args.shared_data_location,
        port=args.port,
    )
