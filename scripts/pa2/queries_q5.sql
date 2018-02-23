/*
 * q5 - five queries
 * Write five queries on your project database, using the select-from-where construct of SQL.
 * The queries should be typical queries of the application domain.
 * To receive full credit, all but perhaps one of your queries must exhibit some interesting feature of SQL:
 * queries over more than one relation, subqueries,
 * aggregations, grouping etc
 */

-- queries
SELECT * FROM creditCards
WHERE holder_name = 'RACHEL DERRICK';

SELECT * FROM creditCards
WHERE expiry_date > '2018-03-01' ORDER BY holder_name ASC
LIMIT 5;

-- aggregations
SELECT avg(overall_rating) FROM restaurants
WHERE opening_hours = '10:00';

-- group by, aggregations
SELECT borough, count(*) AS TotalDeliveryStaffs FROM deliveryStaffs
WHERE borough IN ('Outremont', 'Saint-Laurent')
GROUP BY borough
LIMIT 5;

-- subqueries
SELECT c.name FROM customers c
WHERE EXISTS (SELECT d.cell_phone_number FROM deliveryStaffs d
              WHERE d.cell_phone_number = c.cell_phone_number);
