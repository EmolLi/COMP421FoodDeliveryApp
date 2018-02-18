**1. Requirement Analysis**

**Introduction**

_Purpose_

The purpose of this application is to liaise between restaurants and customers as a delivery specialist. This makes the process of ordering delivery more convenient for the customer by congregating a variety of options for restaurants into one place, eliminating the need for searches through individual restaurant websites. In addition, this application will allow restaurants to offer delivery without having to organize their own delivery service, making it both cost-efficient and convenient. This is especially useful for smaller restaurants in expanding their service and establishing a larger customer base.

_Scope and special requirements_

This application will be limited to the city of Montreal for both restaurants and customers so that efficient delivery can be guaranteed. The nineteen boroughs of Montreal will be used for location-based prompting of delivery staff, and the Google Maps API will be used to calculate distances between addresses.

**Data Requirements**

_Entities and their attributes_

1. **Customer:** A Customer orders food with the application. It has the primary key of cell phone number, and the attribute of name.
2. **DeliveryStaff:** A DeliveryStaff delivers food to customers. It has the primary key of cell phone number and the attributes name and borough.
3. **Order:** An Order is placed by the user for each delivery. It has a primary key called oid and also has the attributes status and total cost
4. **PaymentMethod:** A PaymentMethod is-a Credit Card or is-a Balance. It can be identified by its primary key, pid, and it has a covering constraint.
5. **CreditCard:** A CreditCard is a subcategory of the more general PaymentMethod entity. The database keeps track of its card number, holder name and expiry date.
6. **Balance:**  A Balance is also a subcategory of Payment entity. Balance has amount, which is default to 0 when the user account is created.
7. **Address:** An Address can be identified by the artificial key aid. It has zip code, street, apartment Number, and borough.
8. **Restaurant:** A Restaurant is identified by the primary key license id, which is unique for every physical location of the restaurant even if it&#39;s a chain restaurant. Its attributes include name, opening hours, contact number, and overall rating.
9. **Dish:** A Dish is a weak entity that is provided by the Restaurant entity, and has a partial key called name. It also has the attributes of type, description, and price.
10. **Category:** A Category is used to classify Restaurants. It has the primary key cid, and its other attributes are country, style, and taste.

_Relationships_

1. **Places:** A 4-way relationship between Customer, Address, Restaurant, and Order. Each order can be placed exactly once. Customers, restaurants, and address (where the order is to be delivered, selected by the Customer) can participate in the relationship many times.
2. **Paid by:** A order is **paid by** the payment method. If Credit Card is used, it has to be already registered by the Customer. This is a 1-many relationship. 1 payment method can pay many orders, but 1 order can only be paid by 1 payment method.
3. **Located at:** A 1-many mapping between restaurant and address. 1 restaurant must have exactly 1 address, but 1 address can only associate with more than one restaurant (e.g. mall, building).
4. **Has:** A _customer_ **has** a _balance._ A _customer_ has exactly one _balance_ and a _balance_ is associated with exactly one _customer_. Once a customer account is created, a _balance_ with default amount value of 0 is automatically created and assigned to him.
5. **Registers:  ** A _customer_ **registers** a _credit card_. This is a many-to-many relationship, because a _customer_ can register many credit cards and a _credit card_ can be registered by many customers (e.g. family members). A _customer_ has to register the credit card before using it to pay, but does not need to register any credit cards if he only uses _balance_ to pay.
6. **Reviews:** For each order, there can be a review to the restaurant. An order can only have at most 1 review to a restaurant and a restaurant can have many reviews. As review is associated with order, a customer can only review a restaurant if he orders food from the restaurant, and he can review the restaurant every time he orders food from the restaurant.
7. **Contains:** A many to 1 relationship. For an order, it must contain at least 1 dish, and for 1 dish, it can belong to several orders.
8. **Provides:** A relationship that specifies that Dish is a weak entity of Restaurant. Restaurants can provide many dishes, while a dish can only be identified by the restaurant that provides it together with the partial key of name.
9. **Delivered by:** An order can be delivered by at most one DeliveryStaff. There is no participation constraint because an order is first placed without a DeliveryStaff assigned yet.
10. **Categorized as:** A many-many relationship between Restaurant and Category. A restaurant must be categorized as at least one category (participation constraint). A category can be associated with many restaurants.
11. **Saves:** A many-many relationship between Customer and Address. Customers can save many addresses, and an address can be saved by many customers. Customers do not have to save an address to have an account, but a saved address is needed to place an order. If the customer wants to deliver food to a new place, he will be prompted to save it first.

**Requirements to be Handled by Application Logic**

1. Customer can only order dishes from one restaurant per order. However our ER diagram does not enforce the relationship that all dishes in an order comes from the same restaurant.
2. Customer can only use credit card registered by him to pay a order he placed, but the ER diagram does not enforce that the credit card customer used to pay a order belongs to him.
3. The ER diagram does not enforce that the Address (for delivery for an Order) is saved by the Customer who placed the order.
4. A customer cannot pay using Balance if the Order&#39;s total cost exceeds the current amount in his balance. This will be forbidden by application logic.
5. The ER diagram does not enforce that the Review will be written for the same Restaurant that the Order was placed from.

**Functional Requirements**

_User Flow of the application_

- Customer

1. Customer registers with his phone and becomes a customer. His account will be created with a balance automatically set up, initiated at 0.
2. (Optional) Customer sets up additional payment methods
  1. (Optional) Customer adds money to his account balance
  2. (Optional) Customer registers a credit card
3. Customer adds delivery address(es) to his address book.
4. Customer uses the app to lookup the restaurant he wants.
  1. User optionally select some conditions to filter the restaurants (see below)
  2. Customer selects a restaurant.
5. Customer picks the dishes he likes, selects the delivery address (if he wants the food delivered to an address that has not been registered before, he has to enter the new address, which will be added to his address book after the order is placed), selects the payment method (either registered credit card or balance) and places the order.
  1. Order status can be monitored once the order is placed. (Possible order status: &quot;Not Assigned To a Delivery Staff&quot;, &quot;Waiting For Delivery Staff To Pick Up&quot;, &quot;On The Way&quot;, &quot;Completed&quot;).
6. After the order is delivered, the status changes to &#39;Completed&#39; and Customer will be prompted to submit an optional review/rating for the restaurant

- Delivery Staff

1. Delivery Staff registers with his phone and becomes a delivery staff, selecting exactly one borough that is most convenient for him to serve.
2. Delivery Staff will be shown a list of orders, whose status is &quot;Not Assigned To a Delivery Staff&quot;, placed at restaurants located in the same borough that he has chosen.
3. Delivery Staff selects some orders and takes them. The status of these orders will be changed to &quot;On The Way&quot;.

_Algorithm description_

- Restaurant filtering: restaurants can be filtered by distance from customer&#39;s address, rating, category, or combination of all
  - Filter by distance
    - ■■If customer chooses to filter by distance, he will first be prompted to select an address (that he has registered) or to register and select a new address
    - ■■The customer will then select a radius, since larger delivery distances will have a higher delivery fee.
    - ■■The distance between each restaurant&#39;s address and the selected address will be calculated using the Google Maps API, and only restaurants within the selected radius will be displayed to the customer
  - Filter by category
    - ■■Customer will be prompted to select one or more categories. Only restaurants that are categorized as at least one of the categories selected will be displayed to the customer
  - Filter by restaurant rating
    - ■■Customer can choose to filter by rating (e.g. above 3 stars)
    - ■■Each restaurant will have a overall rating that is calculated from all reviews
    - ■■Rating = sum(rating from each review) / number of reviews
- Location-based order prompts for delivery staff
  - When each new order is placed, it will have a status of &quot;Not Assigned To a Delivery Staff&quot;
  - Unassigned orders from restaurants that are within the borough that a delivery staff serves will be prompted to that delivery staff
  - The delivery staff can choose orders that he wants to deliver.
- Total cost of order
  - Calculated from dishes and quantity of each dish
  - Additional delivery fee, which is proportional to the distance between the restaurant address and the delivery address (calculated using Google Maps API)
- Calculate balance
  - When account is created, the customer&#39;s balance is automatically created and initialized at $0
  - Customer can choose to deposit money in his balance
  - Balance updates whenever user uses balance to pay for an order or when additional money is added to the balance

**3. Relations**

[**https://drive.google.com/file/d/1lg\_b5TuQNWtolQQhTRYq2Zh3ZdghyRBN/view?usp=sharing**](https://drive.google.com/file/d/1lg_b5TuQNWtolQQhTRYq2Zh3ZdghyRBN/view?usp=sharing)

Terminology: A ref B suggest A is the foreign key referencing entity B

**Entities (including weak entity)**

1. CreditCard(pid, card\_number, expiry\_date, holder\_name) (pid ref PaymentMethod)
2. Customer(cell\_phone\_number, name, pid, balanceAmount)        (pid ref PaymentMethod)
3. DeliveryStaff(cell\_phone\_number, name, borough)
4. PaymentMethod(pid)
5. Address(aid, zip\_code, street, apt\_number, borough)
6.
6.
#
[ANNOTATION:

BY &#39;Duan Li&#39;
ON &#39;2018-02-18T19:51:10&#39;
NOTE: &#39;removed restaurant from place relationship according to prof&#39;s advice&#39;]
Order(oid, status, pid, cell\_phone\_number, aid)        (pid ref PaymentMethod) (cell\_phone\_number ref Customer) (aid ref Address)
7. Category(cid, style, country, taste)
8. Restaurants(license\_id, aid, name, opening\_hours, closing\_hours, contact\_number, overall\_rating)  (aid ref Address)
9. Dish(license\_id, name, description, price, type)         (license\_id ref Restaurant)

**Relationships** :

1. registers(pid, cell\_phone\_number) (pid ref CreditCard)        (cell\_phone\_number ref Customer)
2. deliveredBy(id, cell\_phone\_number)         (oid ref Order) (cell\_phone\_number ref DeliveryStaff)
3. saves(cell\_phone\_number, aid)         (cell\_phone\_number ref Customer) (aid ref Address)
4. categorizedAs(cid, license\_id)         (cid ref Category) (license\_id ref Restaurant)
5. reviews(id, license\_id, rating, comment)                (oid ref Order) (license\_id ref Restaurant)
6. contains(id,license\_id, name, quantity)                (oid ref Order) (license\_id, name ref Dish)

**Constraints not expressed in Relational model:**

1. Each restaurant has at least one category. The participation constraint from restaurant to category is not enforced. This will be handled by application logic.
2. In our ER, every customer has and only has one balance, and every balance belongs to one and only one customer. The participation constraint from balance is not expressed in the relations. This will be handled by application logic.
3. In our ER, every order must have at least one dish. The participation constraint from orders to dish is not enforced in relationship. This will be handled by application logic.
4. In our ER, every credit card must be registered by at least one customer. (It&#39;s possible for multiple customers to register the same credit card, for example, parent and child may register the same card.) However, the participation constraint from credit card to customer is not enforced in the relations. This will be handled by application logic.

**4. Creativity and Complexity**

Our application stands out as a delivery service due to several creative features that are incorporated in the design.

First, a useful feature is that anyone can sign up to be a delivery staff, so that a fixed number of hired delivery staff is not needed. This helps eliminate costs, because delivery staff will be paid on a order-by-order basis instead of hourly, and delivery staff would have a lot of flexibility because they can choose orders according to their schedules and availability.

Second, the location-based prompting allow delivery staff to select orders closest to them, allowing delivery to be performed as fast as possible so that customers can have a short wait time.

Third, the application provides the feature of order status that helps our customers track their order. If their order is not assigned at all, or already on the way. This gives our customers a better idea about food arrival time, and they can actually contact the customer support if they found their order is not even assigned after 30 mins.

Finally, the Balance feature allows customers a convenient and direct method of payment so they do not have to use their credit card every time; this is especially useful for customers who frequently order delivery.

**5. Websites that inspired the design**

[https://www.ubereats.com/montreal/](https://www.ubereats.com/montreal/)

-------------------------------------------------------------

Script

# Post questions here, so we can ask the prof next week.

// Q: varchar vs char

// Q: change group password

**// Q: card number unique?**
```sql
-- Drop the tables, start a fresh db

DROP TABLE creditCards;

DROP TABLE customer;

DROP TABLE deliveryStaff;

DROP TABLE paymentMethods;

DROP TABLE address;

DROP TABLE deliveredBy;

DROP TABLE saves;

DROP TABLE categorizedAs;

DROP TABLE reviews;

DROP TABLE contains;

CREATE TABLE deliveryStaffs(

  cell\_phone\_number CHAR(10) NOT NULL PRIMARY KEY,

  name VARCHAR(20) NOT NULL ,

  borough VARCHAR(20)

);

CREATE TABLE addresses(

  aid CHAR(10) NOT NULL PRIMARY KEY,

  zip\_code CHAR(6),

  street VARCHAR(100) NOT NULL ,

  apt\_number INTEGER,

  borough VARCHAR(20)

);

CREATE TABLE paymentMethods(

  pid CHAR(10) NOT NULL PRIMARY KEY

);

**CREATE TABLE creditCards(**

**  pid CHAR(10) NOT NULL PRIMARY KEY,**

**  card\_number CHAR(16) NOT NULL,**

**  expiry\_date DATE NOT NULL,**

**  holder\_name VARCHAR(20) NOT NULL,**

**  FOREIGN KEY(pid) REFERENCES paymentMethods**

** );        // Q: card number unique?**

 CREATE TABLE customers(

   cell\_phone\_number  CHAR(10) NOT NULL PRIMARY KEY,

   name VARCHAR(20) NOT NULL,

   balanceAmount FLOAT CHECK(balanceAmount &gt;= 0) DEFAULT 0,

   pid CHAR(10) NOT NULL,

   FOREIGN KEY(pid) REFERENCES paymentMethods

 );

 CREATE TABLE orders

 (

     oid CHAR(10) NOT NULL ,

     status INT DEFAULT 0,

     pid CHAR(10) NOT NULL,

     cell\_phone\_number CHAR(10) NOT NULL,

     aid CHAR(10) NOT NULL,

     PRIMARY KEY (oid),

     FOREIGN KEY (cell\_phone\_number) REFERENCES customers,

     FOREIGN KEY (aid) REFERENCES addresses

);

 CREATE TABLE categories

 (

     cid CHAR(10) NOT NULL,

     style INT,

     country INT,

     taste INT,

     PRIMARY KEY (cid)

 );

 CREATE TABLE restaurants

 (

     license\_id CHAR(10) NOT NULL,

     aid CHAR(10) NOT NULL,

     name VARCHAR(30) NOT NULL,

     opening\_hours TIME NOT NULL,

     Closing\_hours TIME NOT NULL,

     contact\_number CHAR(10) NOT NULL,

     overall\_rating FLOAT CHECK (overall\_rating &gt;= 0 AND overall\_rating &lt;= 5),

     PRIMARY KEY (license\_id),

     FOREIGN KEY (aid) REFERENCES addresses

 );

 CREATE TABLE dishes

 (

     license\_id NOT NULL CHAR(10),

     name NOT NULL VARCHAR(30),

     description VARCHAR(200),

     price FLOAT CHECK(price &gt;= 0),

     type INT,

     PRIMARY KEY (license\_id, name),

     FOREIGN KEY (license\_id) REFERENCES restaurants

 );

 CREATE TABLE registers

 (

     pid CHAR(9) NOT NULL,

     cell\_phone\_number CHAR(10) NOT NULL,

     PRIMARY KEY (pid, cell\_phone\_number),

     FOREIGN KEY (pid) REFERENCES creditCards,

     FOREIGN KEY (cell\_phone\_number) REFERENCES customers

 );

CREATE TABLE deliveredBy;

(

    oid CHAR(10) NOT NULL

  , cell\_phone\_number CHAR(10) NOT NULL

  , PRIMARY KEY(oid)

  , FOREIGN KEY(cell\_phone\_number) REFERENCES deliveryStaffs

);

CREATE TABLE saves;

(
   cell_phone_number CHAR(10) NOT NULL
  ,aid CHAR(10) NOT NULL
  ,PRIMARY KEY(cell_phone_number, aid)
  ,FOREIGN KEY(cell_phone_number) REFERENCES customers
  ,FOREIGN KEY(aid) REFERENCES addresses
);

CREATE TABLE categorizedAs;

(
   cid CHAR(10) NOT NULL
  ,license_id CHAR(10) NOT NULL
, PRIMARY KEY(cid, license_id)
  ,FOREIGN KEY(cid) REFERENCES categories
  ,FOREIGN KEY(license_id) REFERENCES restaurant
);

CREATE TABLE reviews;
(
   oid CHAR(10) NOT NULL
  ,license_id CHAR(10) NOT NULL
, PRIMARY KEY (oid)
  ,FOREIGN KEY(oid) REFERENCES orders
  ,FOREIGN KEY(license_id) REFERENCES restaurants
);

CREATE TABLE contains;

(
  oid CHAR(10) NOT NULL
 ,license_id CHAR(10) NOT NULL
 ,name VARCHAR(15) NOT NULL
 ,quantity INTEGER NOT NULL CHECK(quantity &gt; 0)
 ,PRIMARY KEY(oid, license_id, name)
 ,FOREIGN KEY(oid) REFERENCES orders
 ,FOREIGN KEY(license_id, name) REFERENCES dishes
);

INSERT INTO paymentMethods (pid) VALUES (&#39;10-3456789&#39;);
INSERT INTO paymentMethods (pid) VALUES (&#39;11-3456789&#39;);
INSERT INTO paymentMethods (pid) VALUES (&#39;12-3456789&#39;);
INSERT INTO paymentMethods (pid) VALUES (&#39;13-3456789&#39;);
INSERT INTO paymentMethods (pid) VALUES (&#39;14-3456789&#39;);
SELECT \* FROM paymentMethods;
INSERT INTO deliveryStaff (cell\_phone\_number, name, borough)
VALUES (&#39;5142315261&#39;, &#39;sdiwjskedi sidjwksidk&#39;, &#39;whateversdsadsd&#39;);
INSERT INTO addresses(aid, street, street, apt\_number)
VALUES(&#39;012-3456789&#39;, &#39;sjdiojsaojdisoa&#39;, 20);

INSERT INTO restaurants (license\_id, aid, name, opening\_hours, closing\_hours, contact\_number)
VALUES（&#39;0123456789&#39;，&#39;0123456789&#39;, &#39;randomname&#39;, &#39;10:00&#39;, &#39;17:00&#39;, &#39;5142637263&#39;);

INSERT INTO deliveryStaffs(cell\_phone\_number, name, borough)
VALUES (&#39;5142737263&#39;, &#39;Josephine Moore&#39;, &#39;Westmount&#39;);

INSERT INTO addresses(aid, street)
VALUES (&#39;0123456789&#39;, &#39;Docteur-Penfield&#39;);

INSERT INTO paymentMethods(pid)
VALUES （&#39;0123456789&#39;);

INSERT INTO creditCards(pid, card\_number, expiry\_date, holder\_name)
VALUES (&#39;012345679&#39;, &#39;3182948293829384&#39;, &#39;2018-07-07&#39;, &#39;Josephine Moore&#39;);

INSERT INTO customers(cell\_phone\_number, name, balenceAmount, pid)
VALUES (&#39;5147372937&#39;, &#39;Kelsey&#39;, &#39;192.2&#39;, &#39;01235273928&#39;);
```
