### This serves as the entrypoint to the application from within the docker container.
import os
import logging

from digital_deception_emulator.application import run

logger = logging.getLogger("social_media_emulator")


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
    mount_dir = os.environ.get("MNT_DIR", "./")

    if not os.path.exists(mount_dir):
        os.makedirs(mount_dir)

    run(
        subdomain="/",
        port=int(port),
        shared_data_location=mount_dir,
        production=True,
    )


if __name__ == "__main__":
    main()
