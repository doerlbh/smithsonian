import csv

data = []
with open("species_uniq.txt", newline="") as csvfile1:
    reader1 = csv.reader(csvfile1, delimiter=",")
    line_count = 0
    for row in reader1:
        print(row)
        d = {}
        d["id"] = row[0]
        d["predators"] = 0
        d["preys"] = 0
        with open("predators_count.csv", newline="") as csvfile2:
            reader2 = csv.reader(csvfile2, delimiter=",")
            line_count = 0
            for prow in reader2:
                if d["id"].strip() == prow[0].strip():
                    print(d["id"].strip(), prow[0].strip())
                    d["predators"] = prow[1]
        with open("preys_count.csv", newline="") as csvfile3:
            reader3 = csv.reader(csvfile3, delimiter=",")
            line_count = 0
            for prow in reader3:
                if d["id"] == prow[0]:
                    d["preys"] = prow[1]
        data.append(d)

import json

with open("species_nodes.json", "w") as fout:
    json.dump(data, fout)
