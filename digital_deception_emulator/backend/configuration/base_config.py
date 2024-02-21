import cherrypy
import pathlib


def get_simple_config():
    return {
        "/": {
            "tools.encode.on": True,
            "tools.encode.encoding": "utf-8",
            "tools.digital_deception_database.on": True,
            "request.dispatch": cherrypy.dispatch.MethodDispatcher(),
            "tools.sessions.on": True,
            "request.show_tracebacks": True,
        },
    }


def get_global_config():
    return {
        "engine.autoreload.on": False,
    }


def get_api_config():
    config = get_simple_config()
    config["/"].update(
        {
            "tools.response_headers.on": True,
            "tools.response_headers.headers": [("Content-Type", "application/json")],
        },
    )
    return config


def get_root_config():
    config = get_simple_config()
    config["/"].update(
        {
            "tools.staticdir.root": pathlib.Path(__file__)
            .parent.parent.parent.joinpath("frontend")
            .resolve(),
        }
    )
    config.update(
        {
            "/assets": {
                "tools.staticdir.on": True,
                "tools.staticdir.dir": pathlib.Path("assets"),
            },
            "/static": {
                "tools.staticdir.on": True,
                "tools.staticdir.dir": pathlib.Path("emulator").joinpath("dist"),
            },
            "/api/test": {
                "tools.require_api_key.on": True,
                "tools.json_in.on": True,
                "tools.json_out.on": True,
            },
            "/api/event": {
                "tools.require_api_key.on": True,
                "tools.json_in.on": True,
                "tools.json_out.on": True,
            },
        }
    )
    return config
