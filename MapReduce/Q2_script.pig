--Question 2: Find the title of all 'Comedy' and 'Sci-Fi' movies from 2015

--load the data
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);
moviegenres = LOAD '/data/moviegenres.csv' USING PigStorage(',') AS (movieid:INT, genre:CHARARRAY);

--get all movies released in 2015
movies2015 = FILTER movies BY year == 2015;

--get movieids from moviegenres of movies that belong to either 'Comedy' or 'Sci-Fi'
filterGenre = FILTER moviegenres BY genre == 'Comedy' or genre == 'Sci-Fi';
filterGenre2 = FOREACH filterGenre GENERATE movieid;

--join by movieid
jnd = JOIN movies BY movieid, filterGenre2 BY movieid;
titles = FOREACH jnd GENERATE title;
distinctTitle = DISTINCT titles;

--order the output by title
orderTitle = ORDER distinctTitle BY title;
DUMP orderTitle;
