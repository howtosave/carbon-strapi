#!/bin/bash

#
# init mongo database using mongo-shell
#

DB_USER='root'
DB_PASSWORD='strapi'
DB_PORT=27017
DB_HOST='localhost'

# create user
function create_user() {
  local db_name="$1"
  local admin_name='myroot'
  local admin_pw='root000'
  local cmd="db=db.getSiblingDB(\"${db_name}\");db.createUser({\
    user: \"${DB_USER}\",\
    pwd: \"${DB_PASSWORD}\",\
    roles: [ { role: \"readWrite\", db: \"${db_name}\" } ]\
  })"

  echo "CMD: ${cmd}"

  mongo ${DB_HOST}:${DB_PORT}/admin -u ${admin_name} -p ${admin_pw} --eval "${cmd}"
}

# remove user
function remove_user() {
  local db_name="$1"
  local admin_name='myroot'
  local admin_pw='root000'
  local cmd="db=db.getSiblingDB(\"${db_name}\");db.dropUser(\"${DB_USER}\")"

  echo "CMD: ${cmd}"

  mongo ${DB_HOST}:${DB_PORT}/admin -u ${admin_name} -p ${admin_pw} --eval "${cmd}"
}

# check db connection
function check_conn() {
  local db_name="$1"
  mongo ${DB_HOST}:${DB_PORT}/${db_name} -u ${DB_USER} -p ${DB_PASSWORD} --eval "printjson(db.getCollectionNames())"
}

#
# example database
#
DB_NAME='strapi'
#create_user $DB_NAME
#remove_user $DB_NAME
check_conn $DB_NAME

#
# test database
#
DB_NAME='strapi_test'
#create_user $DB_NAME
#remove_user $DB_NAME
#check_conn $DB_NAME

