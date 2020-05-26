#!/bin/sh

docker exec -i mongo_dev sh -c 'mongoimport -c Categories -d feednext --drop --jsonArray' < ./.dumps/categories.json
docker exec -i mongo_dev sh -c 'mongoimport -c Conversations -d feednext --drop --jsonArray' < ./.dumps/conversations.json
docker exec -i mongo_dev sh -c 'mongoimport -c Entries -d feednext --drop --jsonArray' < ./.dumps/entries.json
docker exec -i mongo_dev sh -c 'mongoimport -c Messages -d feednext --drop --jsonArray' < ./.dumps/messages.json
docker exec -i mongo_dev sh -c 'mongoimport -c Titles -d feednext --drop --jsonArray' < ./.dumps/titles.json
docker exec -i mongo_dev sh -c 'mongoimport -c Users -d feednext --drop --jsonArray' < ./.dumps/users.json