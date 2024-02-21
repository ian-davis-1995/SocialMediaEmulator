import os
import logging
import subprocess

from digital_deception_emulator.application import run

logger = logging.getLogger("social_media_emulator")


def enable_gcs_fuse(bucket, mount_dir):
    arguments = ["gcsfuse", "--implicit-dirs", bucket, mount_dir]
    print("gcsfuse command: {0}".format(arguments))
    process = subprocess.run(arguments, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if process.returncode != 0:
        print(process.stdout)
        print(process.stderr)

        raise RuntimeError(
            "GCS Fuse bucket failed to mount! stdout and stderr have been printed above for debugging purposes"
        )


def main():
    if "SME_LOG_LEVEL" in os.environ:
        log_level = os.environ["SME_LOG_LEVEL"]
    else:
        log_level = "DEBUG"

    if not hasattr(logging, log_level):
        logger.level = logging.WARN
    else:
        logger.level = getattr(logging, log_level)

    port = os.environ.get("PORT", "3000")

    bucket = os.environ.get("BUCKET", None)
    mount_dir = os.environ.get("MNT_DIR", "./")
    gcsfuse_enabled = os.environ.get("ENABLE_GCSFUSE", "0") == "1"

    if bucket and mount_dir and gcsfuse_enabled:
        print("mounting gcs fuse bucket {0} to {1}".format(bucket, mount_dir))

        if not os.path.exists(mount_dir):
            os.makedirs(mount_dir)

        enable_gcs_fuse(bucket, mount_dir)
        print("mounted gcs fuse bucket successfully")

    run(subdomain="/", port=int(port), shared_data_location=mount_dir, production=True,)


if __name__ == "__main__":
    main()
