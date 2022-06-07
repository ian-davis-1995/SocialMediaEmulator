import argparse
import os
import pathlib

from cherrypy_utils import docker_utils


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Utility script to build the digital deception docker container")
    parser.add_argument(
        "--debug",
        default=False,
        action="store_true",
        help="Enable the debug build meant to be run from local host",
    )
    args = parser.parse_args()

    mount_source = "/home/mraUser/online_experiments_data"

    if args.debug:
        if not os.path.exists("./digital_deception_data"):
            os.makedirs("./digital_deception_data")

        mount_source = pathlib.Path(".").absolute().resolve()

    docker_utils.build_docker_container(
        "digital_deception_emulator",
        version_number=docker_utils.get_version_number().replace("-", "."),
        mount=True,
        mount_source=mount_source,
        mount_folder="digital_deception_data",
        mount_destination="/digital_deception_data",
        restart_policy="unless-stopped",
        port_mappings={"5001": "5001"},
    )
