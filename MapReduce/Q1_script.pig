-- Question 1: How many movies were released in each year ? (10 Points)

--load the data from HDFS and define the schema
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);
moviesperyear = GROUP movies BY year;
yearcount = FOREACH moviesperyear GENERATE $0, COUNT($1) as nummovies;
-- Order that by year.
orderYears = ORDER yearcount BY group;

-- Send the output to the screen.
--dump orderYears;
STORE orderYears INTO 'q1';
ILLUSTRATE orderYears;
