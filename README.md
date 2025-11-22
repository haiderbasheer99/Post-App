# Post REST API With JWT-TOKEN Project

## A Fully Functional Post Project written in Nestjs showing how to create CRUD REST API based on RBAC system

This project showing how to create a simple REST API in Nestjs that serves CRUD system. Every part of this project is asample code which show you how to do the following:

* Create a custom web server with Nestjs using HTTP requests
* Create a simple REST API using CRUD system
* Authenticate Both User And Admin Based On their Requests
* Allow Authenticated Users to Create and Get their Posts
* Allow Autherized Users to Update their Posts Based on their Role
* Allow Autherized Admins to Delete the Posts 

## How to install this Post Project on your computer

1. Clone this Project
2. install missing packeges using `npm install`
3. run `npm run start:dev` after you set env file bellow 

## How to setup enviroment file

1. for the `PORT` variable you need to provide a port number for your app to run locally
2. for the `DB_HOST` write `localhost`
3. for the `DB_PORT` write the defalut port number `5432`
4. for the `DB_USERNAME` write `postgres`
5. for the `DB_PASSWORD` write your password on your pgAdmin server
6. for the `DB_NAME` write your database name on your pgAdmin server
7. for the `DB_SYNC` set it to `true` and false when you are in production
8. for the `JWT_TOKEN_SECRET` go to this link (https://jwtsecrets.com/#generator)
9. for the `JWT_TOKEN_EXPIRESIN` write time you want in milliseconds [example: 3600] = 1hour
10. for the `REFRESH_TOKEN_EXPIRESIN`  write time you want in milliseconds [example: 86400] === 1day

## How to tweak this Project for your own uses 

Since this is an example Post project , I'd encourge you to clone and rename this project for your own purpose. It's a good starter boilerplate

## Find a bug?

If you found an issue or would like to submit an improvement  to this project , please submit an issue using the issues tab above. And if you like to submit an issue with a fix, reference the issue you created!


