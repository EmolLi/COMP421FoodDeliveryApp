-- q6 - four data modification commands

-- 1. Insert result of query
-- new chain restaurant with license_id 'e1bRcWCXV4' needs to have the same dishes
-- as another restaurant in the database with license_id 'x4sO7niRuO'

-- test data
INSERT INTO addresses VALUES('vV6NVyTsCJ', 'H4R1Y8', '3131 Boulevard Cote-Vertu Ouest, Saint-Laurent, QC', NULL, 'Saint-Laurent');
INSERT INTO addresses VALUES('AHWbM02669', 'H4R1R3', '3330 Boulevard Cote-Vertu Ouest, Montreal, QC', NULL, 'Saint-Laurent');
INSERT INTO restaurants VALUES('e1bRcWCXV4', 'vV6NVyTsCJ', 'McDonald''s', '9:00', '21:00', '5148549657');
INSERT INTO restaurants VALUES('x4sO7niRuO', 'AHWbM02669', 'McDonald''s', '8:00', '18:00', '5141415471');
INSERT INTO dishes VALUES('x4sO7niRuO', 'Curly Fries', NULL, '22', 1);
INSERT INTO dishes VALUES('x4sO7niRuO', 'Blizzard', NULL, '33', 2);
INSERT INTO dishes VALUES('x4sO7niRuO', 'Frosty', NULL, '16', 3);

-- command
INSERT INTO dishes
SELECT 'e1bRcWCXV4' AS license_id, d.name, description, price, type
FROM dishes d
WHERE d.license_id='x4sO7niRuO';

-- 2. Update several tuples at once
-- every dish in a restaurant with license_id 'YAhoTS12J2' became more expensive by a factor of 1.2

-- test data
INSERT INTO addresses VALUES('Cxs0xQ24AV', 'H1J1K2', '9201 Boul Métropolitain E', '500', 'Anjou');
INSERT INTO restaurants VALUES('YAhoTS12J2', 'Cxs0xQ24AV', 'Amir', '9:00', '18:00', '5140257589');
INSERT INTO dishes VALUES('YAhoTS12J2', 'Curly Fries', NULL, '14', 1);
INSERT INTO dishes VALUES('YAhoTS12J2', 'Blizzard', NULL, '10', 2);

-- command
UPDATE dishes
SET price=price*1.2
WHERE license_id='YAhoTS12J2';

-- 3. Delete a set of tuples
-- delete all credit cards that are expired

-- test data
INSERT INTO paymentMethods VALUES('Q16uH2QdVZ');
INSERT INTO paymentMethods VALUES('ShLNSbi1i8');
INSERT INTO paymentMethods VALUES('WYK9y2koBH');
INSERT INTO paymentMethods VALUES('wTJSwkCloG');
INSERT INTO creditCards VALUES('Q16uH2QdVZ', '063809472468', '2017-8-15', 'Dana Gutkowski');
INSERT INTO creditCards VALUES('ShLNSbi1i8', '693562503623', '2020-12-9', 'Verda West');
INSERT INTO creditCards VALUES('WYK9y2koBH', '963328330878', '2019-4-16', 'Verda West');
INSERT INTO creditCards VALUES('wTJSwkCloG', '633625000508', '2016-11-11', 'Shanelle Mertz');

-- command
DELETE FROM creditCards
WHERE expiry_date < CURRENT_DATE;

-- 4. Update using a query
-- give $10 bonus to customers who made 5 or more orders

-- test
INSERT INTO addresses VALUES('hKNyjBVy5L', 'H1J3A4', '200-8100 Boulevard du Golf, Anjou, QC', NULL, 'Anjou');
INSERT INTO paymentMethods VALUES('h1OPkauQlV');
INSERT INTO customers VALUES('5143809594', 'Dana Gutkowski', 0, 'h1OPkauQlV');
INSERT INTO orders VALUES('sIgTOIpj36', 0, '0.0', 'h1OPkauQlV', '5143809594', 'hKNyjBVy5L');
INSERT INTO orders VALUES('u8W93U7MvJ', 0, '0.0', 'h1OPkauQlV', '5143809594', 'hKNyjBVy5L');
INSERT INTO orders VALUES('NHywXBXU8f', 0, '0.0', 'h1OPkauQlV', '5143809594', 'hKNyjBVy5L');
INSERT INTO orders VALUES('mPJirTdy70', 0, '0.0', 'h1OPkauQlV', '5143809594', 'hKNyjBVy5L');
INSERT INTO orders VALUES('0NvLoYzfKt', 0, '0.0', 'h1OPkauQlV', '5143809594', 'hKNyjBVy5L');

-- command
UPDATE customers c
SET balance_amount=balance_amount+10 WHERE
(SELECT count(*) FROM orders o
WHERE c.cell_phone_number=o.cell_phone_number)>=5;
