import csv
import datetime
import os
import subprocess

from pytube import YouTube

start = datetime.datetime.now()

videos_folder = "./goof-clips-{0}-untrimmed".format(datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S"))
trimmed_folder = "./goof-clips-{0}-trimmed".format(datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S"))

if not os.path.exists(videos_folder):
    os.makedirs(videos_folder)

if not os.path.exists(trimmed_folder):
    os.makedirs(trimmed_folder)

with open("movie-goofs-videos.csv", "r") as csv_file:
    reader = csv.reader(csv_file)
    row_id = 2
    next(reader)

    for row in reader:
        if all('' == element or element.isspace() for element in row):
            row_id += 1
            continue

        movie_name = row[0]
        goof_category = row[6]
        url = row[8]
        timestamp_start = row[9]
        clip_duration = row[10]

        if not clip_duration:
            # Default clip duration of 1 minute for videos that don't specify a duration but do have a start timestamp.
            # If no timestamp start is specified, the video will not be trimmed.
            clip_duration = "1:00"

        if not movie_name or movie_name.isspace():
            print("Ignoring row {0} because the movie name was missing".format(row_id))
            row_id += 1
            continue
        elif not url or url.isspace():
            print("Ignoring row {0} ({1}) because there was no youtube url".format(row_id, movie_name))
            row_id += 1
            continue

        if not url.startswith("https://www.youtube.com/watch?v="):
            print("Ignoring url {0}, row {1} ({2}) because it is not youtube".format(url, row_id, movie_name))
            row_id += 1
            continue

        if not goof_category or goof_category.isspace():
            print("Row {0} ({1}) has no goof category, continuing anyway".format(row_id, movie_name))

        video_id = url.replace("https://www.youtube.com/watch?v=", "")
        video_filename = "{0}-{1}-{2}-row{3}".format(movie_name, goof_category, video_id, row_id)
        video_filepath = ""

        try:
            video_filepath = YouTube(url).streams.get_highest_resolution().download(output_path=videos_folder, filename=video_filename)
            print("Row {0} ({1}) saved to {2}".format(row_id, movie_name, os.path.abspath(video_filepath)))
        except Exception as err:
            print("Could not download youtube video at {0} (row {1} - {2}) due to error -- "
                  "the video is probably unavailable (maybe DMCA?)".format(url, row_id, movie_name))

        if video_filepath and timestamp_start and clip_duration:
            if "," in timestamp_start:
                # In case the timestamp field contains more than one timestamp, just use the first one.
                timestamp_start = timestamp_start.split(",")[0]

            trimmed_filepath = os.path.abspath(os.path.join(trimmed_folder, os.path.basename(video_filepath)))
            subprocess.run(["ffmpeg", "-i", video_filepath, "-ss", timestamp_start, "-t", clip_duration, trimmed_filepath],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        elif video_filepath:
            print("Row {0} ({1}) did not include a timestamp, so no trimmed video was made".format(row_id, movie_name))

        row_id += 1

print("Youtube Download now finished, all raw clips can be found in {0} "
      "and trimmed versions based on timestamps specified can be found in {1}".format(videos_folder, trimmed_folder))
print("All Downloads took {0}".format(datetime.datetime.now() - start))
