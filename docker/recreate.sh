#!/bin/bash

docker-compose stop; \
dkclean.sh; \
docker-compose build; \
docker-compose up -d; \
sleep 15; \
./clean.sh \
cn "done";
