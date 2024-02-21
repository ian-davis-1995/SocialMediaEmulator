#! python
import argparse
import os
import subprocess
import urllib.parse


def main(version):
    process = subprocess.run("gcloud auth print-access-token", shell=True, stdout=subprocess.PIPE)
    access_token = process.stdout.splitlines()[-1]
    access_token = urllib.parse.quote(access_token)
    artifact_url = "https://oauth2accesstoken:{0}@us-central1-python.pkg.dev/afrl-il4-sbx-rhmindmodel-dk29/online-experiment-python-utilities/simple/".format(access_token)

    os.chdir("../../")
    os.system("docker build --build-arg ARTIFACT_URL={0} -t social_media_emulator:{1} -f dockerfile.gcp.secure .".format(artifact_url, version))


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Utility script to build the digital deception GCP container")
    parser.add_argument("version", help="The version number for this deployment")
    args = parser.parse_args()
    main(args.version)
