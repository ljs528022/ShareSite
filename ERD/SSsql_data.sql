DELETE FROM d1_attachment;
ALTER TABLE d1_attachment AUTO_INCREMENT = 1;
DELETE FROM d1_authority ;
ALTER TABLE d1_authority  AUTO_INCREMENT = 1;

INSERT INTO d1_authority (auth) VALUES
('ADMIN'), ('MEMBER');

INSERT INTO d1_user (username, password,name, phoneNM, email, regDate, auth) VALUES