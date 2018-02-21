/*
 * q3 - five INSERT commands
 */

/* CreditCard(pid, card_number, expiry_date, holder_name) (pid ref PaymentMethod) */

/* Create paymentMethods */
INSERT INTO paymentMethods(pid)
VALUES ('0074399583');
INSERT INTO paymentMethods(pid)
VALUES ('3778745455');
INSERT INTO paymentMethods(pid)
VALUES ('7793685782');
INSERT INTO paymentMethods(pid)
VALUES ('0184621949');
INSERT INTO paymentMethods(pid)
VALUES ('0981042957');

/* Create creditCards */
INSERT INTO creditCards(pid, card_number, expiry_date, holder_name)
VALUES ('0074399583',
        '5569465448476660',
        '2018-05-29',
        'RACHEL DERRICK');

INSERT INTO creditCards(pid, card_number, expiry_date, holder_name)
VALUES ('3778745455',
        '4556339227888775',
        '2019-01-10',
        'MORGAN FARRELL');

INSERT INTO creditCards(pid, card_number, expiry_date, holder_name)
VALUES ('7793685782',
        '4556706017473226',
        '2019-04-18',
        ' GRACE BLACK');

INSERT INTO creditCards(pid, card_number, expiry_date, holder_name)
VALUES ('0184621949',
        '4069789138809619',
        '2018-03-11',
         'SARAH LAMBERTS');

INSERT INTO creditCards(pid, card_number, expiry_date, holder_name)
VALUES ('0981042957',
        '4765156358556485',
        '2019-04-19',
        'MEGAN KENNETT');
