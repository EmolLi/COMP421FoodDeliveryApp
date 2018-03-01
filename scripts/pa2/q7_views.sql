-- q7 - two create view commands

-- 1.
-- Description: shows all dishes from restaurants currently open, sorted by restaurant
-- If opening_hour is after closing hour (e.g. restaurant is open from 11am to 1am), then
-- it is assumed that closing_hour refers to the next day.

-- create view statement
CREATE VIEW availableDishes AS
SELECT r.name as restaurant, d.name, description, price, type
FROM (SELECT * from restaurants WHERE opening_hour < closing_hour) AS r, dishes d
WHERE r.license_id=d.license_id
AND CURRENT_TIME BETWEEN opening_hour AND closing_hour
UNION
SELECT r.name as restaurant, d.name, description, price, type
FROM (SELECT * from restaurants WHERE opening_hour > closing_hour) AS r, dishes d
WHERE r.license_id=d.license_id
AND CURRENT_TIME NOT BETWEEN closing_hour AND opening_hour
ORDER BY restaurant;

-- query involving the view
SELECT * FROM availableDishes LIMIT 5;

-- attempt to update view
UPDATE availableDishes SET price=price*2;
-- this view is not updatable because it uses set operations (union)
-- summary of conditions that must hold for a view to be updatable:
--     Only columns from one base table is being modified;
--     No aggregate functions or computations (incl set operators);
--     No GROUP BY, DISTINCT, or HAVING clauses


-- 2.
-- Description: lists all customers sorted by their total spending on all orders
-- For customers who have made orders, their total spending will be calculated by
-- summing the cost of every order they have made.
-- For customers who have not made any orders, their total spending will be 0.

-- create view statement
CREATE VIEW spendingPerPerson AS
SELECT cell_phone_number, sum(quantity*price) FROM orders o, contains c, dishes d
WHERE o.oid=c.oid AND c.license_id=d.license_id AND c.name=d.name
GROUP BY cell_phone_number
UNION
SELECT c.cell_phone_number, 0 FROM customers c WHERE c.cell_phone_number NOT IN
(SELECT o.cell_phone_number FROM orders o)
ORDER BY sum DESC;

-- query involving the view
SELECT * FROM spendingPerPerson LIMIT 5;

-- attempt to update view
UPDATE spendingPerPerson SET sum=100 WHERE cell_phone_number='5143809594';
-- this view is not updatable because it uses aggregate functions (sum), GROUP BY, and set operations (union)
