/*
 * q5 - five queries
 * Write five queries on your project database, using the select-from-where construct of SQL.
 * The queries should be typical queries of the application domain.
 * To receive full credit, all but perhaps one of your queries must exhibit some interesting feature of SQL:
 * queries over more than one relation, subqueries,
 * aggregations, grouping et
 */

/* CreditCard(pid, card_number, expiry_date, holder_name) (pid ref PaymentMethod) */

SELECT * FROM creditCards WHERE holder_name = 'RACHEL DERRICK';
SELECT * FROM creditCards WHERE expiry_date > '2018-03-01' ORDER BY holder_name ASC;
