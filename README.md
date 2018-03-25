# COMP 421 Database Project

### Overview
Our application is a food delivery app inspired by UberEat and Foodara.

This reposistory contains all files from milestone 1 to milestone 3.

Application code for milestone 3 are in <i>src/</i> folder.

Our application use WeChat Mini-Program for front end (see code in <i>src/UI</i> ), and Node.js + Express for backend server (see code in <i>src/backEnd</i>).

As Mini-Program is subapplication within WeChat ecosystem and requires a lot of dependencies, it may be hard to set up.

However, the server is easy to set up.

### Project 3 Server Setup
#### requirements
* As the database is in comp421.cs.mcgill.ca, make sure you either on McGill Wifi or on McGill [VPN](http://kb.mcgill.ca/kb/?ArticleId=1212&source=article&c=12&cid=2#tab:homeTab:crumb:8:artId:1212:src:article).
* Make sure you have Node version v7.6.0+, and npm installed
```sh
$ cd src/backEnd
# install dependencies
$ npm install
# start server
$ npm start
```

When you can open a browser to test the server APIs.

Note: when you are testing the APIs, if you encounter error {"error":"Connection terminiated due to connection timeout"}, please check if you are on McGill VPN.

Following is the APIs details:

- user login
    - user/:phone_number
    - GET method
    - e.g visit http://localhost:3000/user/5140040461 on browser
    - return user profile data
    - simple query
- user add balance
    - user/addBalance
    - POST method
        ```sh
        # you could use postman or curl to post data
        # bash
        $ curl --data "balance_add_amount=1&cell_phone_number=5143809594" http://localhost:3000/user/addBalance
        ```
     - return new balance
     - simple update
- search restaurants
    -  /restaurants
    - GET method
    - e.g http://localhost:3000/restaurants
    - return list of restaurants
    - option contains multiple statements
- get dishes in a restaurant
    - /restaurants/:license_id
    - GET method
    - e.g http://localhost:3000/restaurants/dish/x6XKDLVsmX
    - return a list of dishes in this restaurant
    - simple query
- get user orders
    - orders/:phone
    - GET method
    - e.g http://localhost:3000/orders/5142455267
    - return a list of orders
    - option that contains multiple statements
- update review for a order
    - orders/review
    - POST method
    - e.g.
    ```
    curl --data "oid=4kjAYGX9O3&license_id=Ui4S8KNkbN&rating=3&comment=sdfs" http://localhost:3000/orders/review
    ```
    - return updated rating for the restaurant in the order
    - option that contains multiple statements & update statement

#### We added two more options for question 3, these two options are only available in server side, and are not included in UI
- get user current orders
    - orders/:phone
    - GET method
    - e.g http://localhost:3000/currentOrders/5142455267
    - return a list of orders (of status "WaitingForDelivery" or "OnTheWay")
    - option that contains multiple statements
- search restaurants by name
    -  /restaurants/name/:name
    - GET method
    - e.g http://localhost:3000/restaurants/name/Amir
    - return list of restaurants
    - option contains multiple statements

### environment setup
We are using PostgreSQL for this project.
The datbase is in server comp421.cs.mcgill.ca, type the following commands to enter the database.
```sh
$ ssh comp421.cs.mcgill.ca -l cs421g11
# input password
$ P@55wo2d
$ psql cs421
```


Restaurants and Montreal addresses information are fetched using Google Place API (<i>/scripts/dataGeneration/index.js</i>). Generated script is in <i>scripts/dataGeneration/insert.sql</i>. To insert all data in to database, simply run this script.

You could also use batch file to automate all the procedures (only tested in Ubuntu system with no password input required, may not work in your computer =p) This build file will clean the database (drop all previous data),create the tables, insert data and provide a summary of the tables at the end
```sh
$ ./initDB.sh
```

After you have inserted all data, run <i>scripts/tableSummary.sql</i> to make sure if you have import all data successfully. If there is no error, you should see the following output:


============Table Summary===========

| schemaname |    relname     | n_live_tup
|------------|:--------------:|----------:
| public     | dishes         |        365
| public     | addresses      |        300
| public     | saves          |        206
| public     | paymentmethods |        202
| public     | contains       |        199
| public     | categorizedas  |        149
| public     | registers      |        102
| public     | creditcards    |        102
| public     | orders         |        100
| public     | deliverystaffs |        100
| public     | restaurants    |        100
| public     | customers      |        100
| public     | deliveredby    |         68
| public     | reviews        |         22
| public     | categories     |         20
(15 rows)



Then you are ready to run queries on the data set. =p
### Part 1
https://docs.google.com/document/d/1aKX7pmf66VHpXxzdRgO8cLpD_CU5KPlZDHEGC0Qczhk/edit
###### For requirement analysis, refer to REQUIREMENT.md

### Part 2
https://docs.google.com/document/d/1owIY6CZNclabkzNZk0q5pUDvO0qjPCNmfTvHc7gsr6U/edit?usp=sharing

All the sql codes are under ```scripts/``` folder
it contains 3 parts
1. table_init.sql
2. simple_insert.sql
3. cleanup.sql
simple_inser.sql is just a simple example of how to insert statmetns into all
the tables

### Part 3
https://docs.google.com/document/d/1VnCmeKkqQXRETVIr4Ogl6nwX-NFZ5DN5m1PNESBZtA4/edit

