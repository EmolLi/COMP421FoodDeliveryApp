-- q6 - four data modification commands

-- 1. Insert result of query
-- new chain restaurant with license_id 'sPmqoBtmmK' needs to have the same dishes
-- as another restaurant in the database with license_id 'x4sO7niRuO'

INSERT INTO dishes
SELECT 'sPmqoBtmmK' AS license_id, d.name, description, price, type
FROM dishes d
WHERE d.license_id='x4sO7niRuO';

-- 2. Update several tuples at once
-- every dish in a restaurant with license_id 'YAhoTS12J2' became more expensive by a factor of 1.2

UPDATE dishes
SET price=price*1.2
WHERE license_id='YAhoTS12J2';

-- 3. Delete a set of tuples
-- delete all reviews from the customer with cell_phone_number '5147963102'
DELETE FROM reviews r
WHERE r.oid IN (SELECT o.oid FROM orders o WHERE cell_phone_number='5147963102');

-- 4. Update using a query
-- give $10 bonus to customers who made 3 or more orders

UPDATE customers c
SET balance_amount=balance_amount+10 WHERE
(SELECT count(*) FROM orders o
WHERE c.cell_phone_number=o.cell_phone_number)>=3;
