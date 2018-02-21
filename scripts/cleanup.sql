-- Drop the tables, start a fresh db

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

/** if Postgre version >= 9.3 **/
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;




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
