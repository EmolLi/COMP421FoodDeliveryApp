--Question 4: Find years in which the number of movies produced were less than the previous year. (15 Points)

--Output should contain year, number of movies produced that year and the number of movies produced the previous year.
--You need not consider the years in which there are no previous year's data available for it.
--You will use the PigStorage function to generate a CSV file where each line has
--the year, number of movies produced that year and the number of movies produced the previous year.
--The file need not be sorted. Write the query in any way you please.
--Store the results in HDFS storage under your home directory as 'q4'.

-- Load the data
movies = LOAD '/data/movies.csv' USING PigStorage(',') AS (movieid:INT, title:CHARARRAY, year:INT);

-- get number of movies produced in each year
grpd = GROUP movies BY year;
movieCount = FOREACH grpd GENERATE $0 AS year, COUNT(movies) AS nummovies;

--get number of movies produced in previous year
moviePrevCount = FOREACH grpd GENERATE $0+1 AS year, COUNT(movies) AS numPrevMovies;

--join movieCount and moviePrevCount
joined = JOIN movieCount by year, moviePrevCount by year;

-- filter movieCount
filtered = FILTER joined BY nummovies < numPrevMovies;

-- get output and store
yearInfo = FOREACH filtered GENERATE movieCount::year, nummovies, numPrevMovies;
STORE yearInfo INTO 'q4';
