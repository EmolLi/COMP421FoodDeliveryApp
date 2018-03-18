/*
 * q5 - five queries
 * Write five queries on your project database, using the select-from-where construct of SQL.
 * The queries should be typical queries of the application domain.
 * To receive full credit, all but perhaps one of your queries must exhibit some interesting feature of SQL:
 * queries over more than one relation, subqueries,
 * aggregations, grouping etc
 */

-- queries
-- List seven tuples of credit cards with a holder name starts with “M”
SELECT * FROM creditCards
WHERE holder_name LIKE 'M%'
LIMIT 7;

-- List five tuples of credit cards were expired or about to expire as of'2018-03-31' in ascending order by the holder name.
SELECT * FROM creditCards
WHERE expiry_date < '2018-03-31' ORDER BY holder_name ASC
LIMIT 5;

-- List seven tuples of restaurants in Saint-Laurent.
SELECT r.name FROM restaurants r
WHERE EXISTS (SELECT addresses.aid = r.aid FROM addresses
			  	WHERE addresses.borough = 'Saint-Laurent')
LIMIT 7;

-- aggregations, exists, group by, subqueries
-- List seven tuples of license id and average rating of all restaurants opening at 10:00;
SELECT license_id, avg(rating) FROM reviews
WHERE EXISTS (SELECT restaurants.license_id FROM restaurants
			  WHERE restaurants.opening_hour = '10:00')
GROUP BY license_id
LIMIT 7;

-- aggregations, exists
-- count the total number of the delivery staffs in the following boroughs: Westmount, Saint-Laurent, Ville Marie, Mont Royal and Lachine group by the borough.
SELECT borough, count(*) AS TotalDeliveryStaffs FROM deliveryStaffs
WHERE borough IN ('Outremont', 'Saint-Laurent', 'Ville-Marie', 'Le Plateau-Mont-Royal', 'Lachine')
GROUP BY borough;
