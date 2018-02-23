
-- fake data used for testing q5
INSERT INTO customers(cell_phone_number, name, balance_amount, pid)
VALUES ('5147283728', 'RACHEL DERRICK', '192.2', '0074399583');
INSERT INTO customers(cell_phone_number, name, balance_amount, pid)
VALUES ('5142731827', 'MORGAN FARRELL', '100.0', '3778745455');
INSERT INTO customers(cell_phone_number, name, balance_amount, pid)
VALUES ('5146382937', 'GRACE BLACK', '100.0', '7793685782');

INSERT INTO deliveryStaffs(cell_phone_number, name, borough)
VALUES ('5142731827', 'MORGAN FARRELL', 'Outremont');
INSERT INTO deliveryStaffs(cell_phone_number, name, borough)
VALUES ('5143732132', 'DANIEL FARRELL', 'Outremont');
INSERT INTO deliveryStaffs(cell_phone_number, name, borough)
VALUES ('5143331234', 'HENRISON MILAD', 'Saint-Laurent');

/* -- delete
DELETE FROM customers
WHERE name = 'RACHEL DERRICK' OR name = 'MORGAN FARRELL' OR name = 'GRACE BLACK';

DELETE FROM deliveryStaffs
WHERE name = 'RACHEL DERRICK' OR name ='MORGAN FARRELL' OR name = 'HENRISON MILAD';
*/
