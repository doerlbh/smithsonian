
#!/usr/bin/bash

# extract records, takes long time
cut -d "," -f8,35,44 interactions.csv \
        | grep preysOn \
        | grep -v '^,' \
        | grep -v ',$' \
        > preys_data.csv 

# extract unique values for database building 
cut -d "," -f35 interactions.csv \
        | sort | uniq \
        > interactions_uniq.txt
cut -d "," -f1 preys_data.csv \
        | sort | uniq \
        > predators_uniq.txt
cut -d "," -f3 preys_data.csv \
        | sort | uniq \
        > preys_uniq.txt
cut -d "," -f1 preys_data.csv > predators_all.txt
cut -d "," -f3 preys_data.csv > preys_all.txt
cat predators_uniq.txt preys_uniq.txt \
        | sort | uniq \
        > species_uniq.txt

# count number of predators or preys for each entry

cat predators_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -k2nr \
        | awk '{printf("%s,%s\n",$2,$1)}END{print}' \
        | sort \
        > predators_count.csv
cat preys_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -k2nr \
        | awk '{printf("%s,%s\n",$2,$1)}END{print}' \
        | sort \
        > preys_count.csv

# painful aggregatio of predator and prey data

join -t, -j1 -a1 -e0 -o 1 predators_count.csv preys_count.csv > predator_prey_counta.csv
join -t, -j1 -a2 -e0 -o 1 predators_count.csv preys_count.csv > predator_prey_countb.csv
sort -u predator_prey_count?.csv > predator_prey_count.csv

sed 's/,R[1-9]\+\.csv:/,/g' <(awk -v HEADER="$(printf ",%s:" R{1..2}.csv)" -F, '
    { seen[$1]=seen[$1]","FILENAME":"$2; }
    END { print HEADER; for (x in seen) print x seen[x]}' R{1..2}.csv \
|awk -F, 'NR==1{split($0,arr,/,/);next} {SEP=""; fld=1;
    for (x in arr){printf ($0 ~ arr[x])?SEP""$(fld++):",0";SEP=","};print ""}') | sort

# create hashtable and json

awk '{printf "%s,%s\n", NR,$0}' species_uniq.txt > species_uniq_numbered.csv

jq -Rsn '
  {"preys":
    [inputs
     | . / "\n"
     | (.[] | select(length > 0) | . / ",") as $input
     | {"speciesID": $input[0], "preys": $input[1]}]}
' < preys_count.csv > preys_count.json

jq -Rsn '
  {"predators":
    [inputs
     | . / "\n"
     | (.[] | select(length > 0) | . / ",") as $input
     | {"speciesID": $input[0], "predators": $input[1]}]}
' < predators_count.csv > predators_count.json

jq -Rsn '
  {"predator_prey":
    [inputs
     | . / "\n"
     | (.[] | select(length > 0) | . / ",") as $input
     | {"source": $input[0], "target": $input[2]}]}
' < preys_data.csv > predator_prey.json

jq -Rsn '
  {"species":
    [inputs
     | . / "\n"
     | (.[] | select(length > 0) | . / ",") as $input
     | {"speciesID": $input[1], "predators": 0, "preys": 0}]}
' < species_uniq_numbered.csv > species.json

for file in species_uniq.txt; do
    {
        printf '[\n'
        while read -r line; do
            printf "    \"%s\",\n" "$line"
        done
        printf ']\n'
    } < "$file" > "${file/.txt/.json}"
done

# Extract top 10 predators and preys

cat preys_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -r | head -10 \
        | awk '{$1=""; print $0}' \
        | awk '{$1=$1;print}' \
        > top_preys.txt

cat predators_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -r | head -10 \
        | awk '{$1=""; print $0}' \
        | awk '{$1=$1;print}' \
        > top_predators.txt

cat preys_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -r | head -10 \
        > top_preys_numbers.txt

cat predators_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -r | head -10 \
        > top_predators_numbers.txt

cat preys_all.txt \
        | tr "" "\n" \
        | sort | uniq -c \
        | sort -r \
        | awk '{if($1==$1+0 && $1>10)print $0}' | wc

cat top_preys.txt | while read line 
do
   grep $line preys_data.csv >> filtered_top_links.csv
done

cat top_predators.txt | while read line 
do
   grep $line preys_data.csv >> filtered_top_links.csv
done

sort filtered_top_links.csv | uniq -u > filtered_top_links.csv

cut -d "," -f1 filtered_top_links.csv \
        | sort | uniq \
        > top_predators_uniq.txt
cut -d "," -f3 filtered_top_links.csv \
        | sort | uniq \
        > top_preys_uniq.txt
cat top_predators_uniq.txt top_preys_uniq.txt \
        | sort | uniq \
        > top_species_uniq.txt

# create hashtable and json for top ones

awk '{printf "%s,%s\n", NR,$0}' top_species_uniq.txt > top_species_uniq_numbered.csv

jq -Rsn '
  {"predator_prey":
    [inputs
     | . / "\n"
     | (.[] | select(length > 0) | . / ",") as $input
     | {"source": $input[0], "target": $input[2]}]}
' < filtered_top_links.csv > top_predator_prey.json

jq -Rsn '
  {"species":
    [inputs
     | . / "\n"
     | (.[] | select(length > 0) | . / ",") as $input
     | {"speciesID": $input[1], "predators": 1, "preys": 1}]}
' < top_species_uniq_numbered.csv > top_species.json

for file in top_species_uniq.txt; do
    {
        printf '[\n'
        while read -r line; do
            printf "    \"%s\",\n" "$line"
        done
        printf ']\n'
    } < "$file" > "${file/.txt/.json}"
done

# need to have:
# SpeciesNode :
# {
#     speciesID: i,
#     predators: n,
#     preys: m,
# }
# InteractionLink :
# {
#     predator: i,
#     prey: j,
# }

# 1,Abagrotis alternata
# 2,Abarenicola affinis
# 3,Abax ovalis
# 4,Abax parallelepipedus
# 5,Abax parallelus
# 6,Abedus indentatus
# 7,Ablabesmyia monilis
# 8,Ablennes hians
# 9,Abra alba
# 10,Abra longicallus

# declare -A dict
# fileName=species_uniq_numbered.csv
# OIFS=$IFS
# IFS=','
# while read value key
# do
#     dict+=( ["$key"]="$value" )
# done < $fileName
# IFS=$OIFS
# echo ${dict["Abagrotis alternata"]}
# echo ${dict["Abarenicola affinis"]}

