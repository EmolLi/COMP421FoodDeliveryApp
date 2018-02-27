-- q7 - two create view commands

-- 1. shows all dishes from restaurants currently open, sorted by restaurant
-- notes: assumes opening hours are before closing hours on the same day
-- e.g. 11am - 1am the next day is not allowed

-- command
CREATE VIEW availableDishes AS
SELECT r.name as restaurant, d.name, description, price, type
FROM restaurants r, dishes d
WHERE r.license_id=d.license_id
AND CURRENT_TIME BETWEEN opening_hours AND Closing_hours
ORDER BY r.name

-- 2. customers sorted by their total spending on all orders
-- notes: does the table 'orders' have a total_cost attribute?

-- command if order has total_cost attribute
CREATE VIEW spendingPerPerson AS
SELECT cell_phone_number, sum(total_cost) FROM orders
GROUP BY cell_phone_number
ORDER BY sum(total_cost) DESC;

-- command if order does not have total_cost attribute
CREATE VIEW spendingPerPerson AS
SELECT cell_phone_number, sum(quantity*price) FROM orders o, contains c, dishes d
WHERE o.oid=c.oid AND c.license_id=d.license_id AND c.name=d.name
GROUP BY cell_phone_number
ORDER BY sum(total_cost) DESC;
