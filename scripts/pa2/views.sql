-- q7 - two create view commands

-- 1. 
-- Description: shows all dishes from restaurants currently open, sorted by restaurant
-- notes: assumes opening hours are before closing hours on the same day
-- e.g. 11am - 1am the next day is not allowed

CREATE VIEW availableDishes AS
SELECT r.name as restaurant, d.name, description, price, type
FROM restaurants r, dishes d
WHERE r.license_id=d.license_id
AND CURRENT_TIME BETWEEN opening_hour AND closing_hour
ORDER BY r.name;

-- is this updatable? why/why not?


-- 2. 
-- Description: lists customers who have made orders sorted by their total spending on all orders
-- notes: customers who have not made any orders will not appear in this view

CREATE VIEW spendingPerPerson AS
SELECT cell_phone_number, sum(quantity*price) FROM orders o, contains c, dishes d
WHERE o.oid=c.oid AND c.license_id=d.license_id AND c.name=d.name
GROUP BY cell_phone_number
ORDER BY sum(quantity*price) DESC;

-- this view is not updatable because it uses aggregate functions such as sum and GROUP BY
