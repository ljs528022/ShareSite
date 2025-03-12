DELETE FROM d1_authority ;
ALTER TABLE d1_authority  AUTO_INCREMENT = 1;

DELETE FROM d1_user;

DELETE FROM d1_category;

INSERT INTO d1_authority (auth) VALUES
('ADMIN'), ('MEMBER');

INSERT INTO d1_user (userKey, username, userpass, useralias, tel, regtype, userimg, regDate, state, visitcnt, tradecnt, auth)
VALUES
(2025308001, 'alicegreen', '$2a$12$Xv8t7jT/NYO/MxHl0y9bHezxHiUPyk0qHq9gwY/0IE0v1f2uqTxO6', 'AliceG', '01012345678', 'S', '', '2025-03-08 10:00:00', 'A', 5, 2, 'MEMBER'),
(2025308002, 'bobwhite', '$2a$12$Z3G9fPpxj2X7t0H7iw2a9o2BO6zZG1B7s2tF7Xak7M1l2IjaNhp0a', 'BobW', '01023456789', 'N', '', '2025-03-07 09:30:00', 'B', 3, 1, 'MEMBER'),
(2025308003, 'charlieblue', '$2a$12$9NbtL2OlMECUOYmxnkluaqSz5Z.A1hV8Tmf4z58pOjqB.8lgsFc9O', 'CharlieB', '01034567890', 'K', '', '2025-03-06 11:20:00', 'A', 7, 5, 'MEMBER'),
(2025308004, 'davidred', '$2a$12$K3MI7iW5VzyX34WGb43Jq5kPMUNqZy4Tk2bpNK0kNmBBNO8A6vVQO', 'DavidR', '01045678901', 'S', '', '2025-03-05 08:15:00', 'C', 4, 3, 'MEMBER'),
(2025308005, 'emilypurple', '$2a$12$34n2c7Dh2y6vFJgm3VRu8gaK5cCEpXZ1K.9XpZpHvvLl7U4g9D3gu', 'EmilyP', '01056789012', 'N', '', '2025-03-04 17:10:00', 'A', 10, 6, 'MEMBER'),
(2025308006, 'frankyellow', '$2a$12$M8xNzGbdYDiD6y1o.HxxmRHRZJj0Oe3RYtWpcEVoPn2vGhDoxcdiW', 'FrankY', '01067890123', 'K', '', '2025-03-03 12:30:00', 'B', 2, 0, 'MEMBER'),
(2025308007, 'gracebrown', '$2a$12$uK52J18hWLtTzJviuS7IlepaE8Me5IlA5Kn.j9icGUL7Zm4sRLOE2', 'GraceB', '01078901234', 'S', '', '2025-03-02 15:45:00', 'C', 1, 2, 'MEMBER'),
(2025308008, 'hannahblack', '$2a$12$9Cj6Zxe58DixQK1lB4LzK8fHjrEdAfkjdzg3MB7yQm.LC2EZZGzmO', 'HannahB', '01089012345', 'N', '', '2025-03-01 14:40:00', 'A', 3, 4, 'MEMBER'),
(2025308009, 'ianwhite', '$2a$12$B0R8gAXr5HGiyKdCFSf7p6jVsEFgAt5nA12d5e03d5P6kUzV7o5Z6', 'IanW', '01090123456', 'K', '', '2025-02-28 16:25:00', 'B', 8, 5, 'MEMBER'),
(2025308010, 'jacksonblue', '$2a$12$L2CTpYrh5M87OxCvZ9Jq8FpekszQfRh.V5w7HuaPGDvxwLO1dYbm6', 'JacksonB', '01001234567', 'S', '', '2025-02-27 13:35:00', 'A', 6, 2, 'MEMBER'),
(2025308011, 'katherinegreen', '$2a$12$XwUr6Y6.DY9px8nE6jHFqczs5T1VHz13W2o94xDt.tsyNjTO7Fz8a', 'KatherineG', '01011223344', 'N', '', '2025-02-26 14:05:00', 'B', 4, 1, 'MEMBER'),
(2025308012, 'lisaorange', '$2a$12$D99lx.nBGtPCkZmShl2iHDb8o5kxiPYZfXiO5yXgKbiVTe2Nynfz6', 'LisaO', '01022334455', 'K', '', '2025-02-25 10:50:00', 'C', 3, 4, 'MEMBER'),
(2025308013, 'michaelsilver', '$2a$12$9MYP9mF2CgkEvA7jm0gUofjwn4g59Ih9ShBdS1Ijgw9UN5sFz6yVW', 'MichaelS', '01033445566', 'S', '', '2025-02-24 11:25:00', 'A', 7, 2, 'MEMBER'),
(2025308014, 'nataliegold', '$2a$12$T4o0W0HJZtkBzmDNBj3Vj.XdsB3fLt8e.tMyN1KDlY5VYOa4ElRny', 'NatalieG', '01044556677', 'N', '', '2025-02-23 09:30:00', 'B', 9, 3, 'MEMBER'),
(2025308015, 'oliviarose', '$2a$12$g6P7pvL2i.OzX5NGnFwDb54Ctb5W0lI7Ff5mr3wzq2yJh.jEwCuqO', 'OliviaR', '01055667788', 'K', '', '2025-02-22 16:40:00', 'A', 4, 5, 'MEMBER'),
(2025308016, 'paulwhite', '$2a$12$FpH13H8mUvM5frDQQJzBGwz.BfepUcmUkK2tiVd.CzD4kI0fLFfy2', 'PaulW', '01066778899', 'S', '', '2025-02-21 18:10:00', 'C', 2, 0, 'MEMBER'),
(2025308017, 'quinnyellow', '$2a$12$72pf2owgeLPXiF9QnMlOQ47tu8yyd2mbxHMSdrE.RuQHqk8xBP6ay', 'QuinnY', '01077889900', 'N', '', '2025-02-20 13:55:00', 'A', 6, 2, 'MEMBER'),
(2025308018, 'rachelblack', '$2a$12$5vlsbm6mVZJov9bc8r6N.Qjm3tCrEjvYPK3osW7/HzvEXXs/FuJ3K', 'RachelB', '01088990011', 'K', '', '2025-02-19 14:30:00', 'B', 3, 3, 'MEMBER'),
(2025308019, 'stevenblue', '$2a$12$eU6TLzA0I2rTL1duFi/U5Uq5VKbD7xK5.JBZZckA7kZaTOQCB8CBy', 'StevenB', '01099001122', 'S', '', '2025-02-18 12:45:00', 'A', 5, 1, 'MEMBER'),
(2025308020, 'tiffanypink', '$2a$12$TgK3kYcZn/qflfnXApJe0o6lqghddLgYVGhKlnntz7/3o7Pjws/7y', 'TiffanyP', '01010111223', 'N', '', '2025-02-17 11:20:00', 'C', 8, 6, 'MEMBER');

INSERT INTO d1_category (cateKey, catename) 
VALUES
(100, '전자기기/IT'),
(200, '의류/패션'),
(300, '가구/인테리어'),
(400, '스포츠/레저'),
(500, '책/문구'),
(600, '생활용품'),
(700, '유아/아동용품'),
(800, '자동차/오토바이'),
(900, '기타'),
(101, '스마트폰'),
(102, '컴퓨터/노트북'),
(103, '가전제품'),
(201, '남성의류'),
(202, '여성의류'),
(203, '아동복'),
(301, '소파/의자'),
(302, '침대/매트리스'),
(303, '책상/서랍'),
(401, '운동기구'),
(402, '캠핑용품'),
(403, '낚시용품'),
(501, '도서'),
(502, '문구류'),
(503, '학습용품'),
(601, '주방용품'),
(602, '청소용품'),
(603, '욕실용품'),
(701, '아동의류'),
(702, '유아용품'),
(703, '장난감'),
(801, '자동차용품'),
(802, '오토바이용품'),
(803, '자동차/오토바이 부품');