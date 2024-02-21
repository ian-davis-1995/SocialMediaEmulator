#!/bin/bash
echo "Server listening on port $PORT"

# Create mount directory for service
mkdir -p $MNT_DIR

# Must create all intermediate directories intended to exist in the bucket, 
# so that gcs fuse will list their contents.
# this is problem if the folders are created outside of the application 
# via the cloud storage user interface.
# more info here https://github.com/GoogleCloudPlatform/gcsfuse/blob/master/docs/semantics.md#implicit-directories

# Mount the GCS bucket
echo "Mounting GCS Fuse from $BUCKET to $MNT_DIR"
gcsfuse $BUCKET $MNT_DIR 
echo "Mounting completed."

python -m digital_deception_emulator.application --shared_data_location $MNT_DIR --port $PORT --subdomain / --production