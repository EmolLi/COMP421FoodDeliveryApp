-- Q1
-- User(s) who made the most number of orders in each borough
-- is rewarded with extra money in their balance
-- Aggregation + modification

CREATE OR REPLACE FUNCTION reward(amount INTEGER)
RETURNS VOID AS $$

DECLARE bor VARCHAR(100);
DECLARE bcur CURSOR FOR
SELECT DISTINCT borough FROM addresses a
WHERE a.aid IN (SELECT o.aid FROM orders o);

BEGIN
OPEN bcur;

LOOP
FETCH NEXT FROM bcur INTO bor;
EXIT WHEN NOT FOUND;
UPDATE customers SET balance_amount=balance_amount+amount
WHERE cell_phone_number IN
(SELECT cell_phone_number FROM orders o, addresses a
WHERE o.aid=a.aid AND a.borough = bor
GROUP by cell_phone_number
HAVING count(cell_phone_number) >= ALL
(SELECT count(cell_phone_number) FROM orders o, addresses a
WHERE o.aid=a.aid AND a.borough = bor
GROUP BY cell_phone_number));
END LOOP;

CLOSE bcur;
END
$$ LANGUAGE plpgsql;
