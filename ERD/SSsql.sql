SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS d1_authority;
DROP TABLE IF EXISTS d1_like;
DROP TABLE IF EXISTS d1_review;
DROP TABLE IF EXISTS d1_item;
DROP TABLE IF EXISTS d1_category;
DROP TABLE IF EXISTS d1_location;
DROP TABLE IF EXISTS d1_purchase;
DROP TABLE IF EXISTS d1_user;




/* Create Tables */

CREATE TABLE d1_authority
(
	authKey int NOT NULL AUTO_INCREMENT,
	auth varchar(10) NOT NULL,
	PRIMARY KEY (authKey)
);


CREATE TABLE d1_category
(
	cateKey int NOT NULL,
	catename varchar(20) NOT NULL,
	PRIMARY KEY (cateKey)
);


CREATE TABLE d1_item
(
	itemKey int NOT NULL AUTO_INCREMENT,
	userKey int NOT NULL,
	cateKey int NOT NULL,
	subject varchar(200) NOT NULL,
	content longtext,
	price int,
	location varchar(30),
	itemtype varchar(20) NOT NULL,
	purtype int NOT NULL,
	tradestatus boolean,
	writeDate datetime,
	viewcnt int,
	img1 varchar(600),
	img2 varchar(600),
	img3 varchar(600),
	img4 varchar(600),
	img5 varchar(600),
	PRIMARY KEY (itemKey)
);


CREATE TABLE d1_like
(
	wishKey int NOT NULL AUTO_INCREMENT,
	userKey int NOT NULL,
	itemKey int NOT NULL,
	PRIMARY KEY (wishKey)
);


CREATE TABLE d1_location
(
	userKey int NOT NULL,
	zipcode int,
	addr varchar(300) NOT NULL,
	addrDetail varchar(100)
);


CREATE TABLE d1_purchase
(
	purchaseKey int NOT NULL AUTO_INCREMENT,
	userKey int NOT NULL,
	bank varchar(20) NOT NULL,
	bankNum varchar(50) NOT NULL,
	PRIMARY KEY (purchaseKey)
);


CREATE TABLE d1_review
(
	reviewKey int NOT NULL AUTO_INCREMENT,
	userKey int NOT NULL,
	itemKey int NOT NULL,
	reviewtag varchar(20) NOT NULL,
	content longtext,
	PRIMARY KEY (reviewKey)
);


CREATE TABLE d1_user
(
	userKey int NOT NULL,
	username varchar(20) NOT NULL,
	userpass varchar(150) NOT NULL,
	useralias varchar(50) NOT NULL,
	tel varchar(15) NOT NULL,
	regtype varchar(10) NOT NULL,
	userimg varchar(600),
	regDate datetime,
	state varchar(1),
	visitcnt int,
	tradecnt int,
	auth varchar(10),
	PRIMARY KEY (userKey),
	UNIQUE (userKey),
	UNIQUE (username)
);



/* Create Foreign Keys */

ALTER TABLE d1_item
	ADD FOREIGN KEY (cateKey)
	REFERENCES d1_category (cateKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_like
	ADD FOREIGN KEY (itemKey)
	REFERENCES d1_item (itemKey)
	ON UPDATE CASCADE
	ON DELETE CASCADE
;


ALTER TABLE d1_review
	ADD FOREIGN KEY (itemKey)
	REFERENCES d1_item (itemKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_item
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_like
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE CASCADE
	ON DELETE NO ACTION
;


ALTER TABLE d1_location
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;


ALTER TABLE d1_purchase
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_review
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



