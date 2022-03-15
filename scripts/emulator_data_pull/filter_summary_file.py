import argparse
import csv
import os


def filter_summary_file(csv_filepath, patterns_to_keep):
    with open(csv_filepath) as input_file:
        reader = csv.reader(input_file)

        header = next(reader)
        indices_to_keep = []

        for index, column in enumerate(header):
            for pattern in patterns_to_keep:
                if pattern in column:
                    if index not in indices_to_keep:
                        indices_to_keep.append(index)

        with open(os.path.splitext(csv_filepath)[0] + "_filtered.csv", "w") as output_file:
            writer = csv.writer(output_file)
            writer.writerow(header[index] for index in indices_to_keep)

            for row in reader:
                if len(row) == 0:
                    continue

                writer.writerow(row[index] for index in indices_to_keep)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        "Utility script to filter out the columns of a CSV based on a list of column matching patterns"
    )
    parser.add_argument("csv_filepath", help="The path to the csv file to filter.")
    parser.add_argument(
        "patterns_to_keep", help="List of patterns to match to find what columns to keep, separated by comma."
    )
    args = parser.parse_args()
    filter_summary_file(args.csv_filepath, args.patterns_to_keep.split(","))
