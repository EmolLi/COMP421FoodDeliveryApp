--Question 7: For all the movies released in 2016, output the movieid, title, number of genres to which the movie belongs and the number of user ratings it has received. (15 Points)

/*
You can ignore movies without any genres and ratings explicitly recorded in the corresponding data sets. Store the results in HDFS under your home directory as 'q7', in CSV format, similar to Q4.
Next, generate the explain (you do not have to excecute the script to do this) for the entire Q7 script, save them locally as Q7_explain.txt . How to do this described in the link provided for diagnositc info
*/

-- Load the data of movies from HDFS
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);
moviegenres = LOAD '/data/moviegenres.csv' USING PigStorage(',') AS (movieid:INT, genre:CHARARRAY);

-- get the movies from 2016
movies2016 = FILTER movies BY year == 2016;

-- Load the data of ratings from HDFS
ratings = LOAD '/data/ratings.csv' USING PigStorage(',') AS (userid:INT, movieid:INT, rating:DOUBLE, TIMESTAMP);

-- Join movies2016 with user ratings
jnd = JOIN movies2016 BY movieid, ratings BY movieid;
grpd = GROUP jnd by movies2016::movieid;
-- generate a ratingCount in format (movieid, title, num_ratings)
ratingCount = FOREACH grpd {
                title = DISTINCT jnd.title;
                GENERATE $0, FLATTEN(title), COUNT($1) as numratings;
}

-- join ratingCount with movie genres
ratingJoinGenre = JOIN ratingCount BY group, moviegenres BY movieid;
grpd2 = GROUP ratingJoinGenre by group;

-- generate the expected res
q7 = FOREACH grpd2 {
                title = DISTINCT ratingJoinGenre.title;
                num_ratings = DISTINCT ratingJoinGenre.numratings;
                GENERATE $0, FLATTEN(title), COUNT($1) as num_genres, FLATTEN(num_ratings);
}

/*
--DESCRIBE q7;
-- print top 5
t3 = LIMIT q7 5;
-- output to the screen;
DUMP t3;
*/

STORE q7 INTO 'q7';
EXPLAIN q7;
