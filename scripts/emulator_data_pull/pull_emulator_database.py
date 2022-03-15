import argparse
import csv
import json

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from digital_deception.server.backend.database import Base
from digital_deception.server.backend.experiment.models import ExperimentEventRecord, ExperimentTestRecord


def export_csv(output_file, experiment_test_records, get_experiment_event_records, include_mouse_events=False):
    header = [
        "Test ID",
        "Event ID",
        "Subject ID",
        "Event Time",
        "Event Type",
        "Element ID",
        "Mouse Position (X)",
        "Mouse Position (Y)",
        "Time Entered Element",
        "Scroll Time Offset (ms)",
        "Scroll Offset X",
        "Scroll Offset Y",
        "Answer (Prior Knowledge, Distractor, etc)",
        "Read Time (ms)",
        "Story Segment",
        "Story ID",
        "Story Title",
        "Story Author",
        "Story Profile Picture",
        "Story Post Date",
        "Comment One Body",
        "Comment One Author",
        "Comment One Profile Picture",
        "Comment One Post Date",
        "Comment Two Body",
        "Comment Two Author",
        "Comment Two Profile Picture",
        "Comment Two Post Date",
        "Distractor Question",
        "Distractor Image",
        "Distractor Answers",
        "Advertisement Style",
        "Error Message",
        "Source File",
        "Source Line No.",
        "Source Column Number",
        "Application Version",
        "Browser Type",
        "Browser Width",
        "Browser Height",
    ]
    fieldnames = [
        "test_id",
        "event_id",
        "subject_id",
        "timestamp",
        "event_type",
        "element_id",
        "mouse_position_x",
        "mouse_position_y",
        "timestamp_entered",
        "scroll_time_offset",
        "scroll_offset_x",
        "scroll_offset_y",
        "answer",
        "read_time_millis",
        "segment_number",
        "story_id",
        "story_title",
        "story_author",
        "story_profile_picture",
        "story_post_date",
        "comment_one_body",
        "comment_one_author",
        "comment_one_profile_picture",
        "comment_one_post_date",
        "comment_two_body",
        "comment_two_author",
        "comment_two_profile_picture",
        "comment_two_post_date",
        "distractor_question",
        "distractor_image",
        "distractor_answers",
        "advertisement_style",
        "message",
        "source_script",
        "line_number",
        "column_number",
        "app_version",
        "user_agent",
        "browser_width",
        "browser_height",
    ]

    writer = csv.DictWriter(
        output_file,
        fieldnames=fieldnames,
        restval="N/A",
        extrasaction="ignore",
    )

    writer.writerow(dict(zip(fieldnames, header)))

    for experiment_test_record in experiment_test_records:
        write_test_description(writer, experiment_test_record)
        experiment_event_records = get_experiment_event_records(experiment_test_record, include_mouse_events)

        for experiment_event_record in experiment_event_records:
            write_rows(writer, experiment_test_record, experiment_event_record)


def export_session_csv(output_file, session, subject_ids, include_mouse_events=False):
    experiment_test_records = (
        session.query(ExperimentTestRecord).filter(ExperimentTestRecord.subject_id.in_(subject_ids)).all()
    )
    export_csv(
        output_file,
        experiment_test_records,
        lambda experiment_test_record, include_mouse_events: query_experiment_events(
            session,
            experiment_test_record,
            include_mouse_events,
        ),
        include_mouse_events=include_mouse_events,
    )


def export_database_csv(output_file, database_type, db_hostname_filename, subject_ids, **kwargs):
    db_user = kwargs.pop("db_user", "")
    db_pass = kwargs.pop("db_pass", "")
    db_name = kwargs.pop("db_name", "")
    include_mouse_events = kwargs.pop("include_mouse_events", False)

    connection_string = ""

    if database_type == "sqlite":
        connection_string = "sqlite:///{db_hostname_filename}".format(db_hostname_filename=db_hostname_filename)
    else:
        connection_string = "{database_type}://{db_user}:{db_pass}@{db_hostname_filename}/{db_name}".format(
            database_type=database_type,
            db_user=db_user,
            db_pass=db_pass,
            db_hostname_filename=db_hostname_filename,
            db_name=db_name,
        )

    engine = create_engine(connection_string)
    Base.metadata.create_all(engine)
    session = Session(engine)
    export_session_csv(output_file, session, subject_ids, include_mouse_events=include_mouse_events)


def query_experiment_events(session, experiment_test_record, include_mouse_events=False):
    statement = session.query(ExperimentEventRecord).filter(ExperimentEventRecord.test_id == experiment_test_record.id)

    if not include_mouse_events:
        statement = (
            statement.filter(ExperimentEventRecord.event_type != "mouse_move_event")
            .filter(ExperimentEventRecord.event_type != "mouse_entered_element")
            .filter(ExperimentEventRecord.event_type != "mouse_left_element")
        )

    return statement.all()


def write_test_description(writer, test_record):
    posts = test_record.posts

    for post_id, post in posts.items():
        data = {
            "test_id": test_record.id,
            "subject_id": test_record.subject_id,
            "event_type": "Post Data",
            "story_id": post["id"],
            "advertisement_style": post.get("advertisementStyle", False),
        }

        if post_id.startswith("distractor-task"):
            data["distractor_question"] = post.get("question", "???")
            data["distractor_image"] = post.get("image", "???")
            data["distractor_answers"] = ", ".join(
                [answer.get("text", "???") for answer in post.get("answers", [{"text": "???"}])]
            )
        else:
            data["story_id"] = post.get("id", "???")
            data["story_title"] = post.get("title", "???")
            data["story_author"] = post.get("author", "???")
            data["story_profile_picture"] = post.get("profilePicture", "???")
            data["story_post_date"] = post.get("postDate", "???")
            data["comment_one_body"] = post["comments"][0]["body"]
            data["comment_one_author"] = post["comments"][0]["author"]
            data["comment_one_profile_picture"] = post["comments"][0]["profilePicture"]
            data["comment_one_post_date"] = post["comments"][0]["postDate"]
            data["comment_two_body"] = post["comments"][1]["body"]
            data["comment_two_author"] = post["comments"][1]["author"]
            data["comment_two_profile_picture"] = post["comments"][1]["profilePicture"]
            data["comment_two_post_date"] = post["comments"][1]["postDate"]

        writer.writerow(data)


def write_rows(writer, test_record, event_record):
    event_data = event_record.event_data
    writer.writerow(
        {
            "test_id": test_record.id,
            "event_id": event_record.id,
            "event_type": event_record.event_type,
            "subject_id": test_record.subject_id,
            "timestamp": event_record.timestamp,
            "element_id": event_data.get("element_id", "N/A"),
            "mouse_position_x": event_data.get("x", "N/A"),
            "mouse_position_y": event_data.get("y", "N/A"),
            "timestamp_entered": event_data.get("timestamp_entered", "N/A"),
            "scroll_time_offset": event_data.get("time_offset", "N/A"),
            "scroll_offset_x": event_data.get("offset_x", "N/A"),
            "scroll_offset_y": event_data.get("offset_y", "N/A"),
            "answer": event_data.get("answer", "N/A"),
            "read_time_millis": event_data.get("read_time_millis", "N/A"),
            "segment_number": event_data.get("segment_number", "N/A"),
            "message": event_data.get("message", "N/A"),
            "source_script": event_data.get("source_script", "N/A"),
            "line_number": event_data.get("line_number", "N/A"),
            "column_number": event_data.get("column_number", "N/A"),
            "app_version": event_data.get("app_version", "N/A"),
            "user_agent": event_data.get("user_agent", "N/A"),
            "browser_width": event_data.get("browser_width", "N/A"),
            "browser_height": event_data.get("browser_height", "N/A"),
        }
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Script to facilitate pulling the database data from the server")
    parser.add_argument("output_file", help="The file to output exported data to")
    parser.add_argument(
        "database_type",
        help="The SQLAlchemy database type (sqlite, mysql, etc) -- used to connect to the database for data pull -- also should include the driver name if necessary (e.g. pymysql)",
    )
    parser.add_argument("database_hostname", help="The database hostname to connect to (or a filename if using SQLite)")
    parser.add_argument("subject_ids", help="A list of subject ids to export data for, separated by comma")
    parser.add_argument(
        "--include_mouse_events",
        help="Flag to include mouse movement data in the export",
        default=False,
        action="store_true",
    )
    parser.add_argument(
        "--database_username", help="The username to use when connecting to the database server", default=""
    )
    parser.add_argument(
        "--database_password", help="The password to use when connecting to the database server", default=""
    )
    parser.add_argument("--database_name", help="The database name to connect to on the server", default="")
    args = parser.parse_args()
    csv_file = open(args.output_file, "w", newline="")
    subject_ids = args.subject_ids.replace(" ", "").split(",")

    export_database_csv(
        args.output_file,
        args.database_type,
        args.database_hostname,
        subject_ids,
        db_user=args.database_username,
        db_pass=args.database_password,
        include_mouse_events=args.include_mouse_events,
    )

    csv_file.flush()
    csv_file.close()
