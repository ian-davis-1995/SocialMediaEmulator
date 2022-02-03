import cherrypy
import pathlib


def get_config():
    return {
        "/": {
            "tools.encode.on": True,
            "tools.encode.encoding": "utf-8",
            "tools.digital_deception_database.on": True,
            "request.dispatch": cherrypy.dispatch.MethodDispatcher(),
            "tools.sessions.on": True,
            "request.show_tracebacks": True,
            "tools.staticdir.root": pathlib.Path(__file__).parent.parent.parent.joinpath("frontend").resolve(),
        },
        "/api": {
            "tools.response_headers.on": True,
            "tools.response_headers.headers": [("Content-Type", "application/json")],
        },
        "global": {
            "engine.autoreload.on": False,
        },
        "/assets": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": pathlib.Path("assets"),
        },
        "/static": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": pathlib.Path("emulator").joinpath("dist"),
        },
        "/ospan/static": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": pathlib.Path("ospan").joinpath("dist"),
            "tools.staticdir.index": "operation_span_web_english.html",
        },
        "/rspan/static": {
            "tools.staticdir.on": True,
            "tools.staticdir.dir": pathlib.Path("rspan").joinpath("dist"),
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
        "/rspan/api/result": {
            "tools.require_api_key.on": True,
            "tools.json_in.on": True,
            "tools.json_out.on": True,
        },
    }
