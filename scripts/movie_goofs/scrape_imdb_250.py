import csv

import requests
from bs4 import BeautifulSoup

request = requests.get("https://www.imdb.com/chart/top/?ref_=nv_mv_250")
parser = BeautifulSoup(request.content, 'html.parser')
movies_table = parser.find(name="tbody", attrs={"class": "lister-list"})
base_url = "https://www.imdb.com/"
title_url = base_url + "title/"
data = [
    ["Movie ID", "Movie Title", "IMDB Homepage", "IMDB Goofs", "Top Goof", "Top 2nd Goof", "Top 3rd Goof"],
]

for row in movies_table.find_all("tr"):
    title_element = row.find(name="td", attrs={"class": "titleColumn"})
    link_element = title_element.find(name="a")
    movie_id = link_element["href"].replace("/title/", "")[:-1]
    movie_title = link_element.text
    movie_url = title_url + str(movie_id) + "/"
    goofs_url = movie_url + "goofs/"
    goofs_request = requests.get(goofs_url)
    goofs_parser = BeautifulSoup(goofs_request.content, 'html.parser')
    goofs_list = goofs_parser.find(name="div", attrs={"class": "list"})
    goofs = []

    for goof_div in goofs_list.find_all("div"):
        goof_text_div = goof_div.find(name="div", attrs={"class": "sodatext"})
        if not goof_text_div:
            continue

        goof_text = goof_text_div.text
        goofs.append(goof_text)

    while len(goofs) < 3:
        goofs.append("")

    data.append([
        movie_id, movie_title, movie_url, goofs_url, goofs[0], goofs[1], goofs[2]
    ])


with open("imdb_goofs.csv", "w", newline='') as csv_file:
    writer = csv.writer(csv_file)

    for row in data:
        writer.writerow(row)
