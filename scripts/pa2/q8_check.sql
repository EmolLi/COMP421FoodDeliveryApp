-- table creation with check constraints...
CREATE TABLE reviews (
    oid CHAR(10) NOT NULL,
    license_id CHAR(10) NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >=0 AND rating <= 5),
    comment VARCHAR(250),
    PRIMARY KEY (oid),
    FOREIGN KEY(oid) REFERENCES orders,
    FOREIGN KEY(license_id) REFERENCES restaurants
);

CREATE TABLE contains (
    oid CHAR(10) NOT NULL,
    license_id CHAR(10) NOT NULL,
    name VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    PRIMARY KEY(oid, license_id, name),
    FOREIGN KEY(oid) REFERENCES orders,
    FOREIGN KEY(license_id, name) REFERENCES dishes
);


CREATE TABLE dishes (
    license_id CHAR(10) NOT NULL,
    name  VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    price FLOAT CHECK(price >= 0),
    type VARCHAR(20),
    PRIMARY KEY (license_id, name),
    FOREIGN KEY (license_id) REFERENCES restaurants
);


CREATE TABLE customers (
    cell_phone_number  CHAR(10) NOT NULL,
    name VARCHAR(50),
    balance_amount FLOAT CHECK (balance_amount >= 0) DEFAULT 0,
    pid CHAR(10) NOT NULL,
    PRIMARY KEY(cell_phone_number),
    FOREIGN KEY(pid) REFERENCES paymentMethods
);
