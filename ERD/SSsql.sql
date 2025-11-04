SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS d1_authority;
DROP TABLE IF EXISTS d1_like;
DROP TABLE IF EXISTS d1_review;
DROP TABLE IF EXISTS d1_item;
DROP TABLE IF EXISTS d1_category;
DROP TABLE IF EXISTS d1_location;
DROP TABLE IF EXISTS d1_payment;
DROP TABLE IF EXISTS d1_user;
DROP TABLE IF EXISTS d1_item_image;
DROP TABLE IF EXISTS d1_chatroom; 
DROP TABLE IF EXISTS d1_chatMessage;
DROP TABLE IF EXISTS d1_report;
DROP TABLE IF EXISTS d1_notice;

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

CREATE TABLE d1_chatroom
(
	roomKey varchar(50) NOT NULL,
	senderKey varchar(20) NOT NULL,
	receiverKey varchar(20) NOT NULL,
	createdAt datetime NOT NULL,
	senderLeft boolean,
	receiverLeft boolean,
	PRIMARY KEY (roomKey)
);

CREATE TABLE d1_chatMessage
(
	id int NOT NULL AUTO_INCREMENT,
	roomKey varchar(50) NOT NULL,
	senderKey varchar(20) NOT NULL,
	receiverKey varchar(20) NOT NULL,
	message longtext NOT NULL,
	readAt datetime,
	timestamp datetime NOT NULL,
	isRead boolean NOT NULL,
	PRIMARY KEY (id)
);


CREATE TABLE d1_item
(
	itemKey int NOT NULL AUTO_INCREMENT,
	userKey varchar(20) NOT NULL,
	cateKey int NOT NULL,
	subject varchar(200) NOT NULL,
	content longtext,
	price int,
	itemtype varchar(20) NOT NULL,
	purtype int NOT NULL,
	tradestatus boolean,
	writeDate datetime,
	viewcnt int,
	PRIMARY KEY (itemKey)
);

CREATE TABLE d1_item_image
(
	imageKey int NOT NULL AUTO_INCREMENT,
	itemKey int NOT NULL,
	imgUrl varchar(500),
	isMain boolean NOT NULL,
	PRIMARY KEY (imageKey)
);


CREATE TABLE d1_like
(
	wishKey int NOT NULL AUTO_INCREMENT,
	userKey varchar(20) NOT NULL,
	itemKey int NOT NULL,
	PRIMARY KEY (wishKey),
	UNIQUE KEY uq_user_item (userKey, itemKey)
);


CREATE TABLE d1_location
(
	userKey varchar(20) NOT NULL,
	itemKey int,
	useralias varchar(50) NOT NULL,
	address varchar(300) NOT NULL,
	zoneCode varchar(300) NOT NULL,
	main boolean,
	detail varchar(300),
	label varchar(100)
);


CREATE TABLE d1_payment
(
	orderKey varchar(100) NOT NULL,
	sellerKey varchar(20) NOT NULL,
	buyerKey varchar(20) NOT NULL,
	itemKey int NOT NULL,
	location varchar(300),
	tradeType int NOT NULL,
	purType varchar(50) NOT NULL,
	price int NOT NULL,
	purchaseDate datetime NOT NULL,
	confirmed boolean NOT NULL,
	PRIMARY KEY (orderKey)
);


CREATE TABLE d1_review
(
	reviewKey int NOT NULL AUTO_INCREMENT,
	sellerKey varchar(20) NOT NULL,
	buyerKey varchar(20) NOT NULL,
	reviewScore int NOT NULL,
	reviewDetail longtext,
	writeDate datetime NOT NULL,
	PRIMARY KEY (reviewKey)
);


CREATE TABLE d1_user
(
	userKey varchar(20) NOT NULL,
	username varchar(100) NOT NULL,
	password varchar(150),
	useralias varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	regtype varchar(10) NOT NULL,
	userimg varchar(600),
	regDate datetime,
	state varchar(1),
	visitcnt int,
	tradecnt int,
	auth varchar(10),
	emailVerified BOOLEAN DEFAULT FALSE,
	userIntro varchar(500),
	editedDate datetime,
	PRIMARY KEY (userKey),
	UNIQUE (userKey),
	UNIQUE (username)
);

CREATE TABLE d1_report
(
	reportKey varchar(50) NOT NULL,
	reporterKey varchar(20) NOT NULL,
	targetKey varchar(20) NOT NULL,
	reason int NOT NULL,
	content LONGTEXT NOT NULL,
	createdAt datetime,
	PRIMARY KEY (reportKey)
);

CREATE TABLE d1_notice
(
	noticeKey int NOT NULL AUTO_INCREMENT,
	subject varchar(200) NOT NULL,
	content LONGTEXT NOT NULL,
	noticeType int NOT NULL,
	writeDate datetime,
	PRIMARY KEY (noticeKey)
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

ALTER TABLE d1_item
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE CASCADE
	ON DELETE CASCADE
;

ALTER TABLE d1_item_image
	ADD FOREIGN KEY (itemKey)
	REFERENCES d1_item (itemKey)
	ON UPDATE CASCADE
	ON DELETE CASCADE
;


ALTER TABLE d1_like
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE CASCADE
	ON DELETE CASCADE
;


ALTER TABLE d1_location
	ADD FOREIGN KEY (userKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_location
	ADD FOREIGN KEY (itemKey)
	REFERENCES d1_item (itemKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;


ALTER TABLE d1_payment
	ADD FOREIGN KEY (sellerKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_payment
	ADD FOREIGN KEY (buyerKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_payment
	ADD FOREIGN KEY (itemKey)
	REFERENCES d1_item (itemKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_review
	ADD FOREIGN KEY (sellerKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE d1_review
	ADD FOREIGN KEY (buyerKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_chatroom
	ADD FOREIGN KEY (senderKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE d1_chatroom
	ADD FOREIGN KEY (receiverKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE d1_chatMessage
	ADD FOREIGN KEY (roomKey)
	REFERENCES d1_chatroom (roomKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_chatMessage
	ADD FOREIGN KEY (senderKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_chatMessage
	ADD FOREIGN KEY (receiverKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE CASCADE
;

ALTER TABLE d1_report
	ADD FOREIGN KEY (reporterKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;

ALTER TABLE d1_report
	ADD FOREIGN KEY (targetKey)
	REFERENCES d1_user (userKey)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;






