import argparse
import json
import csv
import import_author_bank
import import_emulator_comments


def convert_json_string(value):
    if value.isnumeric():
        return int(value)
    else:
        return value


def add_object_to_parent(parent, parsed_key, value):
    if isinstance(parent, list):
        parent.append(value)
    else:
        parent[parsed_key] = value


def setup_object_for_keys(parent, sub_keys, value):
    current_parent = parent

    if value is None or value == "":
        return

    for index in range(len(sub_keys) - 1):
        key = sub_keys[index]
        parsed_key = convert_json_string(key)
        child_key = sub_keys[index + 1]

        if parsed_key in current_parent:
            my_object = current_parent[parsed_key]
        elif child_key.isnumeric():
            my_object = []
        else:
            my_object = {}

        if isinstance(parsed_key, int):
            current_parent.append(my_object)
        else:
            current_parent[parsed_key] = my_object

        current_parent = my_object

    parsed_key = convert_json_string(sub_keys[-1])

    if isinstance(parsed_key, int):
        current_parent.append(value)
    else:
        current_parent[parsed_key] = value


def import_csv(csv_filepath):
    rows = []

    with open(csv_filepath, "r") as csv_file:
        reader = csv.DictReader(csv_file)

        for row in reader:
            filtered = {}

            for key, value in row.items():
                if key is None or key.replace('"', "").replace("'", "") == "":
                    continue
                if value is None or value == "":
                    continue

                parsed_value = value

                if value.isnumeric():
                    parsed_value = int(value)
                elif value == "TRUE":
                    parsed_value = True
                elif value == "FALSE":
                    parsed_value = False

                if "/" in key:
                    sub_keys = key.split("/")
                    setup_object_for_keys(filtered, sub_keys, parsed_value)
                else:
                    filtered[key] = parsed_value

            if filtered:
                rows.append(filtered)

    print(json.dumps(rows, indent=4))
    return rows


def export_json(data, output_filepath):
    with open(output_filepath, "w") as output_file:
        json.dump(data, output_file, indent=4)


def main(
    post_data_filepath,
    comment_bank_filepath=None,
    author_bank_filepath=None,
    post_data_output="./post_data.json",
    comment_bank_output="./comment_bank.json",
    author_bank_output="./author_bank.json",
):
    post_data = import_csv(post_data_filepath)

    if comment_bank_filepath:
        import_emulator_comments.main(comment_bank_filepath, comment_bank_output)

    if author_bank_filepath:
        import_author_bank.main(author_bank_filepath, author_bank_output)

    export_json(post_data, post_data_output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        "Script to import emulator stimuli data from CSV generated by google sheet into post data JSON format."
    )
    parser.add_argument(
        "post_data_file",
        help="The csv file to import post data from",
    )
    parser.add_argument(
        "--comment_bank_file",
        default=None,
        help="The csv file to import comment bank from (if needed)",
    )
    parser.add_argument(
        "--author_bank_file",
        default=None,
        help="The csv file to import author bank from (if needed)",
    )
    parser.add_argument(
        "--post_data_output",
        help="The output path for the post data file",
        default="./post_data.json",
    )
    parser.add_argument(
        "--comment_bank_output",
        help="The output path for the comment bank data",
        default="./comment_bank.json",
    )
    parser.add_argument(
        "--author_bank_output",
        help="The output path for the author bank data",
        default="./author_bank.json",
    )

    args = parser.parse_args()
    main(
        args.post_data_file,
        args.comment_bank_file,
        args.author_bank_file,
        args.post_data_output,
        args.comment_bank_output,
        args.author_bank_output,
    )