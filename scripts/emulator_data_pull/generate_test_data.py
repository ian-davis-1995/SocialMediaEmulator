import argparse
from digital_deception.server.backend.export.export_emulator_data import export_database_summary
import time

from pull_emulator_database import export_database_csv


def generate_test_data(subject_id):
    csv_filepath_mouse_events = "./test_data_with_mouse_events-{date}.csv".format(date=time.strftime("%m-%d-%Y"))
    csv_filepath_no_mouse = "./test_data_no_mouse_events-{date}.csv".format(date=time.strftime("%m-%d-%Y"))
    summary_filepath = "./test_summary_no_mouse_events-{date}.csv".format(date=time.strftime("%m-%d-%Y"))
    csv_file_mouse_events = open(csv_filepath_mouse_events, "w", newline="")
    csv_file_no_mouse = open(csv_filepath_no_mouse, "w", newline="")
    summary_file = open(summary_filepath, "w", newline="")

    export_database_csv(
        output_file=csv_file_mouse_events,
        database_type="sqlite",
        db_hostname_filename="../../server/backend/digital_deception.db",
        subject_ids=[subject_id],
        include_mouse_events=True,
    )
    export_database_csv(
        output_file=csv_file_no_mouse,
        database_type="sqlite",
        db_hostname_filename="../../server/backend/digital_deception.db",
        subject_ids=[subject_id],
    )
    export_database_summary(
        output_file=summary_file,
        database_type="sqlite",
        db_hostname_filename="../../server/backend/digital_deception.db",
        subject_ids=[subject_id],
    )

    csv_file_mouse_events.flush()
    csv_file_mouse_events.close()

    csv_file_no_mouse.flush()
    csv_file_no_mouse.close()

    summary_file.flush()
    summary_file.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Generate test export data")
    parser.add_argument("subject_id", help="The subject id to export")
    args = parser.parse_args()
    generate_test_data(args.subject_id)
