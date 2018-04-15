-- Question 5: Find the 10 movies with the maximum number of user ratings. (15 Points)

/*
Output to the screen, the movie title and number the of ratings that it has,
order them by the number of ratings with movies with maximum number of ratings first.
*/

-- Load the data from HDFS
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);
ratings = LOAD '/data/ratings.csv' USING PigStorage(',') AS (userid:INT, movieid:INT, rating:DOUBLE, TIMESTAMP);

-- Join movies and ratings by movieid
jnd = JOIN movies BY movieid, ratings BY movieid;
grpd = GROUP jnd by movies::movieid;
-- read title and count the number of ratings it has
countRatings = FOREACH grpd GENERATE $0, COUNT($1) AS num_ratings;
-- order that by the number of ratings
strd = ORDER countRatings BY num_ratings DESC;
-- limit the top 10 movies
top10 = LIMIT strd 10;
-- join the countRatings with movies to get titles
jnd2 = JOIN top10 BY group, movies BY movieid;
titleRatings = FOREACH jnd2 GENERATE title, num_ratings;
-- order that by the number of ratings
q5 = ORDER titleRatings BY num_ratings DESC;
-- output to the screen;
DUMP q5;
