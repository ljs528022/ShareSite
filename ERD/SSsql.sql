

/* Drop Tables */

DROP TABLE IF EXISTS d1_attachment;
DROP TABLE IF EXISTS d1_authority;
DROP TABLE IF EXISTS d1_comment;
DROP TABLE IF EXISTS d1_like;
DROP TABLE IF EXISTS d1_post;
DROP TABLE IF EXISTS d1_category;
DROP TABLE IF EXISTS d1_location;
DROP TABLE IF EXISTS d1_user;




/* Create Tables */

CREATE TABLE d1_attachment
(
	id int NOT NULL AUTO_INCREMENT,
	post_id int NOT NULL,
	sourcename varchar(100),
	filename varchar(100),
	PRIMARY KEY (id)
);


CREATE TABLE d1_authority
(
	id int NOT NULL AUTO_INCREMENT,
	auth varchar(10) NOT NULL,
	PRIMARY KEY (id)
);


CREATE TABLE d1_category
(
	id int NOT NULL AUTO_INCREMENT,
	catename varchar(10) NOT NULL,
	PRIMARY KEY (id)
);


CREATE TABLE d1_comment
(
	id int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	post_id int NOT NULL,
	content longtext,
	writeDate datetime,
	PRIMARY KEY (id)
);


CREATE TABLE d1_like
(
	id int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	post_id int NOT NULL,
	PRIMARY KEY (id)
);


CREATE TABLE d1_location
(
	user_id int NOT NULL,
	arr1 varchar(100) NOT NULL,
	arr2 varchar(100),
	zipcode int
);


CREATE TABLE d1_post
(
	id int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	category_id int NOT NULL,
	subject varchar(200) NOT NULL,
	content longtext,
	price int,
	tradestatus boolean,
	writeDate datetime,
	viewcnt int,
	PRIMARY KEY (id)
);


CREATE TABLE d1_user
(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(20) NOT NULL,
	password varchar(100) NOT NULL,
	name varchar(20) NOT NULL,
	email varchar(100) NOT NULL,
	phoneNM varchar(20) NOT NULL,
	regDate datetime,
	sex int,
	visitcnt int,
	tradecnt int,
	auth varchar(10),
	PRIMARY KEY (id),
	UNIQUE (username)
);



/* Create Foreign Keys */

ALTER TABLE d1_post
	ADD FOREIGN KEY (category_id)
	REFERENCES d1_category (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_attachment
	ADD FOREIGN KEY (post_id)
	REFERENCES d1_post (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_comment
	ADD FOREIGN KEY (post_id)
	REFERENCES d1_post (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_like
	ADD FOREIGN KEY (post_id)
	REFERENCES d1_post (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_comment
	ADD FOREIGN KEY (user_id)
	REFERENCES d1_user (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_like
	ADD FOREIGN KEY (user_id)
	REFERENCES d1_user (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_location
	ADD FOREIGN KEY (user_id)
	REFERENCES d1_user (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE d1_post
	ADD FOREIGN KEY (user_id)
	REFERENCES d1_user (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



