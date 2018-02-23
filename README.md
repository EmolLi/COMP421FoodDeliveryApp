# COMP 421 Database Project

### Notices
Changes have been made to data structures and requirements. Please ask in the group before you change some table structure.

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

You could also use batch file to automate all the procedures (only tested in Ubuntu system with no password input required, may not work in your computer =p)
```sh
$ ./initDB.sh
# this build file will clean the database (drop all previous data), create the tables, insert data and provide a summary of the tables at the end
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
All the sql codes are under ```scripts/``` folder
it contains 3 parts
1. table_init.sql
2. simple_insert.sql
3. cleanup.sql
simple_inser.sql is just a simple example of how to insert statmetns into all
the tables
