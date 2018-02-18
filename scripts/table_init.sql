-- initializing all the tables


CREATE TABLE deliveryStaffs(
  cell_phone_number  CHAR(10) NOT NULL,
  name VARCHAR(20) NOT NULL,
  borough VARCHAR(20),
  PRIMARY KEY(cell_phone_number)
);

CREATE TABLE addresses(
  aid CHAR(10) NOT NULL,
  zip_code CHAR(6),
  street VARCHAR(100) NOT NULL ,
  apt_number INTEGER,
  borough VARCHAR(20),
  PRIMARY KEY(aid)
);

CREATE TABLE categories
(
    cid CHAR(10) NOT NULL,
    style INT,
    country INT,
    taste INT,
    PRIMARY KEY (cid)
);

CREATE TABLE paymentMethods(
  pid CHAR(10) NOT NULL,
  PRIMARY KEY(pid)
);

CREATE TABLE customers(
  cell_phone_number  CHAR(10) NOT NULL,
  name VARCHAR(20),
  balance_amount FLOAT CHECK (balance_amount >= 0) DEFAULT 0,
  pid CHAR(10) NOT NULL,
  PRIMARY KEY(cell_phone_number),
  FOREIGN KEY(pid) REFERENCES paymentMethods
);
CREATE TABLE creditCards(
  pid CHAR(10) NOT NULL PRIMARY KEY,
  card_number CHAR(16) NOT NULL,
  expiry_date DATE NOT NULL,
  holder_name VARCHAR(20) NOT NULL,
  FOREIGN KEY(pid) REFERENCES paymentMethods
 );


CREATE TABLE restaurants
(
    license_id CHAR(10) NOT NULL,
    aid CHAR(10) NOT NULL,
    name VARCHAR(30) NOT NULL,
    opening_hours TIME NOT NULL,
    Closing_hours TIME NOT NULL,
    contact_number CHAR(10) NOT NULL,
    overall_rating FLOAT CHECK (overall_rating >= 0 AND overall_rating <= 5),
    PRIMARY KEY (license_id),
    FOREIGN KEY (aid) REFERENCES addresses
);

CREATE TABLE dishes
(
    license_id CHAR(10) NOT NULL ,
    name  VARCHAR(30) NOT NULL ,
    description VARCHAR(200),
    price FLOAT CHECK(price >= 0),
    type INT,
    PRIMARY KEY (license_id, name),
    FOREIGN KEY (license_id) REFERENCES restaurants
);


CREATE TABLE orders
(
    oid CHAR(10) NOT NULL,
    status INT DEFAULT 0,
    total_cost FLOAT CHECK (total_cost >= 0),
    pid CHAR(10) NOT NULL,
    cell_phone_number CHAR(10) NOT NULL,
    aid CHAR(10) NOT NULL,
    PRIMARY KEY (oid),
    FOREIGN KEY (pid) REFERENCES paymentMethods,
    FOREIGN KEY (cell_phone_number) REFERENCES customers,
    FOREIGN KEY (aid) REFERENCES addresses
);

CREATE TABLE registers
(
    pid CHAR(10) NOT NULL,
    cell_phone_number CHAR(10) NOT NULL,
    PRIMARY KEY (pid, cell_phone_number),
    FOREIGN KEY (pid) REFERENCES creditCards,
    FOREIGN KEY (cell_phone_number) REFERENCES customers
);

CREATE TABLE deliveredBy
(
   oid CHAR(10) NOT NULL
 , cell_phone_number CHAR(10) NOT NULL
 , PRIMARY KEY(oid)
 , FOREIGN KEY(cell_phone_number) REFERENCES deliveryStaffs
);

CREATE TABLE saves
(
  cell_phone_number CHAR(10) NOT NULL
 ,aid CHAR(10) NOT NULL
 ,PRIMARY KEY(cell_phone_number, aid)
 ,FOREIGN KEY(cell_phone_number) REFERENCES customers
 ,FOREIGN KEY(aid) REFERENCES addresses
);

CREATE TABLE categorizedAs
(
  cid CHAR(10) NOT NULL
 ,license_id CHAR(10) NOT NULL
, PRIMARY KEY(cid, license_id)
 ,FOREIGN KEY(cid) REFERENCES categories
 ,FOREIGN KEY(license_id) REFERENCES restaurants
);

CREATE TABLE reviews
(
  oid CHAR(10) NOT NULL
 ,license_id CHAR(10) NOT NULL
, PRIMARY KEY (oid)
 ,FOREIGN KEY(oid) REFERENCES orders
 ,FOREIGN KEY(license_id) REFERENCES restaurants
);

CREATE TABLE contains
(
 oid CHAR(10) NOT NULL
,license_id CHAR(10) NOT NULL
,name VARCHAR(15) NOT NULL
,quantity INTEGER NOT NULL CHECK(quantity > 0)
,PRIMARY KEY(oid, license_id, name)
,FOREIGN KEY(oid) REFERENCES orders
,FOREIGN KEY(license_id, name) REFERENCES dishes
);
