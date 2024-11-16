#!/bin/bash

mongoimport \
	--db photo-share-api-db \
	--collection photos \
	--file /docker-entrypoint-initdb.d/photos.json \
	--drop \
	--jsonArray

mongoimport \
	--db photo-share-api-db \
	--collection tags \
	--file /docker-entrypoint-initdb.d/tags.json \
	--drop \
	--jsonArray

mongoimport \
	--db photo-share-api-db \
	--collection users \
	--file /docker-entrypoint-initdb.d/users.json \
	--drop \
	--jsonArray
