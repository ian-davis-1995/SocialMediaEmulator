import datetime
import cherrypy
import io
import zipfile

from digital_deception_emulator.backend.configuration import application_data
from digital_deception_emulator.backend.export.export_emulator_data import (
    export_session_csv,
    export_session_summary,
)

from cherrypy.lib import static
from cherrypy_utils import url_utils


# noinspection PyPep8Naming, PyMethodMayBeStatic
@cherrypy.expose
class ExperimentExportApi:
    def GET(self, subject_ids=None, mouse_events="False"):
        if not subject_ids:
            raise cherrypy.HTTPError(status=400, message="No subject id(s) provided!")

        app = application_data.get_app()

        if not app.user_is_authenticated():
            app.set_login_redirect(
                "api",
                "export?subject_ids={0}&mouse_events={1}".format(
                    ",".join(subject_ids),
                    mouse_events,
                ),
            )
            raise cherrypy.HTTPRedirect(url_utils.combine_url(app.subdomain, "login"))

        include_mouse_events = mouse_events.lower() == "true"

        subject_ids = subject_ids.replace(" ", "").split(",")
        cherrypy.response.status = "200 OK"

        output = io.StringIO()
        export_session_csv(
            output,
            cherrypy.request.databases["digital_deception"],
            subject_ids,
            include_mouse_events=include_mouse_events,
        )

        summary_output = io.StringIO()
        export_session_summary(
            summary_output,
            cherrypy.request.databases["digital_deception"],
            subject_ids,
            include_mouse_events=include_mouse_events,
        )

        archive_io = io.BytesIO()

        with zipfile.ZipFile(archive_io, mode="w", compression=zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.writestr(self.get_main_filename(subject_ids), output.getvalue())
            zip_file.writestr(self.get_summary_filename(subject_ids), summary_output.getvalue())

        return self.serve_static(self.get_archive_filename(subject_ids), archive_io)

    def get_main_filename(self, subject_ids):
        return "dd_export_{0}_{1}.csv".format("-".join(subject_ids), datetime.datetime.now().strftime("%Y-%m-%d_%H-%M"))

    def get_summary_filename(self, subject_ids):
        return "dd_summary_{0}_{1}.csv".format(
            "-".join(subject_ids), datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
        )

    def get_archive_filename(self, subject_ids):
        return "dd_export_{0}_{1}.zip".format(
            "-".join(subject_ids[:4]),
            datetime.datetime.now().strftime("%Y-%m-%d_%H-%M"),
        )

    def serve_static(self, filename, data: io.BytesIO):
        cherrypy.log("Seeking stringio file-object back to beginning")
        data.seek(0)
        # encoded_output = io.BytesIO(data.read().encode("utf8"))
        # encoded_output.seek(0)
        return static.serve_fileobj(data, "application/x-download", "attachment", filename, debug=True)
