import requests
import argparse

LOGIN_URL = "https://online-experiments.mindmodeling.org/digital-deception/login"
EXPORT_URL = "https://online-experiments.mindmodeling.org/digital-deception/api/export?subject_ids={0}"
API_KEY = "9463d2d2-8560-40ea-8f4e-739ac9afed2c"

# pilot data subject ids: 35668,11312,35543,32976,15751,40437,21123,20146,32517,36285,48567,36611,37044,10186,49460,42524,37275,14436,19354


def create_mm_session(username, password):
    session = requests.Session()
    response = session.post(LOGIN_URL, data={"username": username, "password": password})
    response.raise_for_status()
    return session


def download_file(url, session, local_filename):
    with session.get(url, stream=True, headers={"X-HTTP-APIKEY": API_KEY}) as r:
        r.raise_for_status()

        with open(local_filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    return local_filename


def export_subject_ids(username, password, subject_ids):
    return download_file(
        EXPORT_URL.format(
            ",".join(subject_ids),
        ),
        create_mm_session(username, password),
        "./export_test.zip",
    )


def main():
    parser = argparse.ArgumentParser("Utility script to export CSVs from MM remotely")
    parser.add_argument("subject_ids", help="List of subject ids, separated by comma")
    parser.add_argument("username", help="MM username")
    parser.add_argument("password", help="MM password")
    args = parser.parse_args()
    print(export_subject_ids(args.username, args.password, args.subject_ids.split(",")))


if __name__ == "__main__":
    main()
