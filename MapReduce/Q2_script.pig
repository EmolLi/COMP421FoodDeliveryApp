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
--***have your join step run with 4 reduce tasks
jnd = JOIN movies BY movieid, filterGenre2 BY movieid PARALLEL 4;

--Project only the names (title) of the movies from this join.
titles = FOREACH jnd GENERATE title;

--Remove the duplicate titles and sort the output on title.
distinctTitle = DISTINCT titles;
orderTitle = ORDER distinctTitle BY title;

DUMP orderTitle;
