--Question 3: For each genre, how many movies were produced in the years 2015 and 2016 ? (15 Points)

--Output genre and the number of movies. Order the output by genre and then by year.

-- Load the data
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);
moviegenres = LOAD '/data/moviegenres.csv' USING PigStorage(',') AS (movieid:INT, genre:CHARARRAY);

-- get all movies released from 2015 or 2016
movies2015_2016 = FILTER movies BY year == 2015 OR year == 2016;

-- join movie and moviegenres by movieid
jnd = JOIN movies2015_2016 BY movieid, moviegenres BY movieid;

-- group by genre name
grpd = GROUP jnd BY (genre, year);

-- Output genre and the number of movies.
movieCount = FOREACH grpd GENERATE FLATTEN($0), COUNT($1) as num_movies;

-- Order the output by genre and then by year
orderMovie = ORDER movieCount BY genre, year;
--DESCRIBE orderMovie;
DUMP orderMovie;
