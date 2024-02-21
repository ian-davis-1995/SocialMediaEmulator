# Mount the GCS bucket
echo "Mounting GCS bucket $BUCKET to $MNT_DIR."
gcsfuse --implicit-dirs $BUCKET $MNT_DIR
echo "Mounting completed."