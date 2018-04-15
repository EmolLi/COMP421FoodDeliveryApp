--Question 6: Find the 5 Sci-Fi movies from 2015 with the maximum number of user ratings. (15 Points)

/*
Output to the screen the movie title and the number of ratings it has,
order them by the number of ratings with movies with maximum number of ratings first.
Do not output more than 5 movies.
*/

-- Load the data of movies from HDFS
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);
moviegenres = LOAD '/data/moviegenres.csv' USING PigStorage(',') AS (movieid:INT, genre:CHARARRAY);
-- get the movies from 2015
movies2015 = FILTER movies BY year == 2015;
moviesAllGenre2015 = JOIN movies2015 BY movieid, moviegenres BY movieid;
sci2015 = FILTER moviesAllGenre2015 BY genre == 'Sci-Fi';
-- Load the data of ratings from HDFS
ratings = LOAD '/data/ratings.csv' USING PigStorage(',') AS (userid:INT, movieid:INT, rating:DOUBLE, TIMESTAMP);
-- Join movies and ratings by movieid
jnd = JOIN sci2015 BY movies2015::movieid, ratings BY movieid;
DESCRIBE jnd;
grpd = GROUP jnd by ratings::movieid;
DESCRIBE grpd;

-- read title and count the number of ratings it has
countRatings = FOREACH grpd GENERATE group, COUNT($1) AS num_ratings;
-- order that by the number of ratings
strd = ORDER countRatings BY num_ratings DESC;
-- limit the top 5 movies
top5 = LIMIT strd 5;
-- join with movies again to get the titles
top5Titles = JOIN top5 BY group, movies BY movieid;
q6 = FOREACH top5Titles GENERATE title, num_ratings;
-- output to the screen;
DUMP q6;
