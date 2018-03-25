-- Drop the tables, start a fresh db

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

/** if Postgre version >= 9.3 **/
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;


SELECT r.license_id, r.name, r.opening_hour, r.closing_hour, r.contact_number, a.aid, a.zip_code, a.formatted_address, a.borough, rr.avgRating, rr.reviewCnt
FROM restaurants r, addresses a, (
    SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
    FROM reviews
    GROUP BY license_id
)rr
WHERE r.aid = a.aid AND r.license_id = rr.license_id
ORDER BY avgRating;






SELECT ca.license_id, c.cid, c.style, c.country, c.taste
FROM categorizedAs ca JOIN categories c
ON ca.cid = c.cid;







-- history order

SELECT o.oid, o.status, o.cell_phone_number, o.aid, c.license_id, c.name, c.quantity, d.price
FROM orders o, contains c, dishes d
WHERE o.oid = c.oid AND o.cell_phone_number = '5142455267'
AND d.license_id = c.license_id AND d.name = c.name;

SELECT p.oid, p.totalPrice, rr.avgRating, rr.reviewCnt
FROM (
    SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
    FROM reviews
    GROUP BY license_id
)rr RIGHT JOIN (
SELECT o.oid, SUM(d.price * c.quantity) totalPrice
FROM orders o, contains c, dishes d
WHERE o.oid = c.oid AND o.cell_phone_number = '5142455267'
AND d.license_id = c.license_id AND d.name = c.name
GROUP BY o.oid) p
ON exists (SELECT * FROM contains c1 WHERE c1.oid = p.oid AND c1.license_id = rr.license_id);

/** =p You do not actually need to write all of these manually
DROP TABLE registers;

DROP TABLE deliveredBy;
DROP TABLE saves;
DROP TABLE categorizedAs;
DROP TABLE reviews;
DROP TABLE contains;
DROP TABLE dishes;
DROP TABLE restaurants;
DROP TABLE deliveryStaffs;
DROP TABLE orders;
DROP TABLE addresses;
DROP TABLE categories;
DROP TABLE creditCards;
DROP TABLE customers;
DROP TABLE paymentMethods;
**/


UPDATE reviews
SET rating = 1, comment = 'sdfsd'
WHERE oid = '76ZqP9yTbB';

INSERT INTO reviews (oid, license_id, rating, comment)
       SELECT '76ZqP9yTbB', 'x6XKDLVsmX', 4, 'sfdsff'
       WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE oid = '76ZqP9yTbB');


    SELECT license_id, COUNT(*) reviewCnt, AVG(rating) avgRating
    FROM reviews
    WHERE license_id = 'x6XKDLVsmX'
    GROUP BY license_id;




SELECT name, description, price, type
FROM dishes
WHERE license_id = 'x6XKDLVsmX'