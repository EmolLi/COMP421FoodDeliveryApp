-- Total number of orders being placed based on boroughs (from shipping address)
SELECT A.borough, count(*) AS numorders
FROM addresses A, orders O
WHERE A.aid = O.aid
GROUP BY A.borough
ORDER BY 1;

-- Restaurants that earned at least 20% more revenue than the average of all restaurants.
SELECT CONCAT(r.license_id, ', ', r.name) AS name, sum(quantity*price)
FROM restaurants r, contains c, dishes d
WHERE r.license_id=c.license_id AND c.license_id=d.license_id AND c.name=d.name
GROUP BY r.license_id
HAVING sum(quantity*price) > 1.2*(SELECT avg(sum) FROM
(SELECT r.license_id, r.name, sum(quantity*price) AS sum
FROM restaurants r, contains c, dishes d
WHERE r.license_id=c.license_id AND c.license_id=d.license_id AND c.name=d.name
GROUP BY r.license_id) AS t1)
ORDER BY sum DESC;
