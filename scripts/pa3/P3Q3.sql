-- a
CREATE INDEX restaurantName ON restaurants(name);
DROP INDEX restaurantName;

-- b
CREATE INDEX orderStatus ON orders(status, cell_phone_number);
DROP INDEX orderStatus;
