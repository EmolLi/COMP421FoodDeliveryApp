
INSERT INTO deliveryStaffs(cell_phone_number, name, borough)
VALUES ('5142737263',
        'Josephine Moore',
        'Westmount');


INSERT INTO addresses(aid, street)
VALUES ('0123456789',
        'Docteur-Penfield');


INSERT INTO paymentMethods(pid)
VALUES ('0123456789');


INSERT INTO paymentMethods(pid)
VALUES ('1123456789');


INSERT INTO restaurants (license_id, aid, name, opening_hours, closing_hours, contact_number)
VALUES('0123456789',
       '0123456789',
       'randomname',
       '10:00',
       '17:00',
       '5142637263');


INSERT INTO dishes (license_id, name)
VALUES ('0123456789',
        'pancake');


INSERT INTO customers(cell_phone_number, name, balance_amount, pid)
VALUES ('5147283728',
        'Kelsey',
        '192.2',
        '0123456789');


INSERT INTO orders (oid, pid, cell_phone_number, aid)
VALUES ('0123456789',
        '0123456789',
        '5147283728',
        '0123456789');


INSERT INTO categories (cid, style)
VALUES ('0182736273',
        2);


INSERT INTO creditCards(pid, card_number, expiry_date, holder_name)
VALUES ('1123456789',
        '3182948293829384',
        '2018-07-07',
        'Josephine Moore');


INSERT INTO contains(oid, license_id, name, quantity)
VALUES ('0123456789',
        '0123456789',
        'pancake',
        10);


INSERT INTO reviews(oid, license_id)
VALUES ('0123456789',
        '0123456789');


INSERT INTO categorizedAs (cid, license_id)
VALUES ('0182736273',
        '0123456789');


INSERT INTO saves (cell_phone_number, aid)
VALUES ('5147283728',
        '0123456789');


INSERT INTO deliveredBy (oid, cell_phone_number)
VALUES ('0123456789',
        '5142737263');


INSERT INTO registers (pid, cell_phone_number)
VALUES ('1123456789',
        '5147283728');
