DELETE FROM d1_authority ;
ALTER TABLE d1_authority  AUTO_INCREMENT = 1;

DELETE FROM d1_user;
DELETE FROM d1_category;

INSERT INTO d1_authority (auth) VALUES
('ADMIN'), ('MEMBER');

INSERT INTO d1_user (userKey,username,password,useralias,email,regtype,userimg,regDate,state,visitcnt,tradecnt,auth,emailVerified)
VALUES
('80A0001','ljs4180','$2a$10$bCjbdkovjRxGPpeKkW1o/eGURRmx7ayzmm6frqVgQnQVBltdBnCJa','이정식몰','ljs4180@naver.com','S','','2025-04-29 15:13:41','N',1,0,'MEMBER',1),
('9160001','alicegreen','$2a$12$Xv8t7jT/NYO/MxHl0y9bHezxHiUPyk0qHq9gwY/0IE0v1f2uqTxO6','AliceG','alicegreen@example.com','S','','2025-03-08 10:00:00','A',5,2,'MEMBER',1),
('9160002','bobwhite','$2a$12$Z3G9fPpxj2X7t0H7iw2a9o2BO6zZG1B7s2tF7Xak7M1l2IjaNhp0a','BobW','bobwhite@example.com','N','','2025-03-07 09:30:00','B',3,1,'MEMBER',1),
('9160003','charlieblue','$2a$12$9NbtL2OlMECUOYmxnkluaqSz5Z.A1hV8Tmf4z58pOjqB.8lgsFc9O','CharlieB','charlieblue@example.com','K','','2025-03-06 11:20:00','A',7,5,'MEMBER',1),
('9160004','davidred','$2a$12$K3MI7iW5VzyX34WGb43Jq5kPMUNqZy4Tk2bpNK0kNmBBNO8A6vVQO','DavidR','davidred@example.com','S','','2025-03-05 08:15:00','C',4,3,'MEMBER',1),
('9160005','emilypurple','$2a$12$34n2c7Dh2y6vFJgm3VRu8gaK5cCEpXZ1K.9XpZpHvvLl7U4g9D3gu','EmilyP','emilypurple@example.com','N','','2025-03-04 17:10:00','A',10,6,'MEMBER',1),
('9160006','frankyellow','$2a$12$M8xNzGbdYDiD6y1o.HxxmRHRZJj0Oe3RYtWpcEVoPn2vGhDoxcdiW','FrankY','frankyellow@example.com','K','','2025-03-03 12:30:00','B',2,0,'MEMBER',1),
('9160007','gracebrown','$2a$12$uK52J18hWLtTzJviuS7IlepaE8Me5IlA5Kn.j9icGUL7Zm4sRLOE2','GraceB','gracebrown@example.com','S','','2025-03-02 15:45:00','C',1,2,'MEMBER',1),
('9160008','hannahblack','$2a$12$9Cj6Zxe58DixQK1lB4LzK8fHjrEdAfkjdzg3MB7yQm.LC2EZZGzmO','HannahB','hannahblack@example.com','N','','2025-03-01 14:40:00','A',3,4,'MEMBER',1),
('9160009','ianwhite','$2a$12$B0R8gAXr5HGiyKdCFSf7p6jVsEFgAt5nA12d5e03d5P6kUzV7o5Z6','IanW','ianwhite@example.com','K','','2025-02-28 16:25:00','B',8,5,'MEMBER',1),
('9160010','jacksonblue','$2a$12$L2CTpYrh5M87OxCvZ9Jq8FpekszQfRh.V5w7HuaPGDvxwLO1dYbm6','JacksonB','jacksonblue@example.com','S','','2025-02-27 13:35:00','A',6,2,'MEMBER',1),
('9160011','katherinegreen','$2a$12$XwUr6Y6.DY9px8nE6jHFqczs5T1VHz13W2o94xDt.tsyNjTO7Fz8a','KatherineG','katherinegreen@example.com','N','','2025-02-26 14:05:00','B',4,1,'MEMBER',1),
('9160012','lisaorange','$2a$12$D99lx.nBGtPCkZmShl2iHDb8o5kxiPYZfXiO5yXgKbiVTe2Nynfz6','LisaO','lisaorange@example.com','K','','2025-02-25 10:50:00','C',3,4,'MEMBER',1),
('9160013','michaelsilver','$2a$12$9MYP9mF2CgkEvA7jm0gUofjwn4g59Ih9ShBdS1Ijgw9UN5sFz6yVW','MichaelS','michaelsilver@example.com','S','','2025-02-24 11:25:00','A',7,2,'MEMBER',1),
('9160014','nataliegold','$2a$12$T4o0W0HJZtkBzmDNBj3Vj.XdsB3fLt8e.tMyN1KDlY5VYOa4ElRny','NatalieG','nataliegold@example.com','N','','2025-02-23 09:30:00','B',9,3,'MEMBER',1),
('9160015','oliviarose','$2a$12$g6P7pvL2i.OzX5NGnFwDb54Ctb5W0lI7Ff5mr3wzq2yJh.jEwCuqO','OliviaR','oliviarose@example.com','K','','2025-02-22 16:40:00','A',4,5,'MEMBER',1),
('9160016','paulwhite','$2a$12$FpH13H8mUvM5frDQQJzBGwz.BfepUcmUkK2tiVd.CzD4kI0fLFfy2','PaulW','paulwhite@example.com','S','','2025-02-21 18:10:00','C',2,0,'MEMBER',1);

INSERT INTO d1_category (cateKey, catename) 
VALUES
(100, '전자기기/IT'),
(200, '의류/패션'),
(300, '가구/인테리어'),
(400, '스포츠/레저'),
(500, '도서/문구/음반'),
(600, '생활용품'),
(700, '유아/아동용품'),
(800, '게임'),
(900, '기타'),
(101, '스마트폰'),
(102, '컴퓨터/노트북'),
(103, '가전제품'),
(105, '태블릿PC'),
(106, '스마트워치/밴드'),
(107, '배터리/충전기/케이블'),
(108, '기타'),
(201, '남성의류'),
(202, '여성의류'),
(203, '아동복'),
(204, '교복/체육복/단복'),
(301, '소파/의자'),
(302, '침대/매트리스'),
(303, '책상/서랍'),
(304, '학생/서재/서무용가구'),
(305, '화장대/협탁/거울'),
(401, '운동기구'),
(402, '캠핑용품'),
(403, '낚시용품'),
(404, '등산용품'),
(405, '기타 레저용품'),
(501, '유아용도서/음반'),
(502, '만화/소설'),
(503, '학습/교육'),
(504, '음반/DVD/굿즈'),
(505, '문구/사무'),
(601, '주방용품'),
(602, '청소/세탁용품'),
(603, '욕실용품'),
(604, '생활잡화'),
(701, '아동의류'),
(702, '유아용품'),
(703, '장난감'),
(801, 'PC게임'),
(802, '플레이스테이션'),
(803, 'PSP'),
(804, '닌텐도'),
(805, '기타'),
(901, '티켓/쿠폰'),
(902, '무료나눔');

INSERT INTO d1_item (userKey, cateKey, subject, content, price, itemtype, purtype, tradestatus, writeDate, viewcnt)
VALUES
('9160001', 101, '갤럭시 S22 팝니다', '상태 최상입니다.', 800000, 'NEW', 1, 1, '2025-03-10 14:30:00', 15),
('9160002', 102, 'LG그램 16인치 판매', '가볍고 성능 좋아요.', 950000, 'OLD', 2, 0, '2025-03-09 11:15:00', 20),
('9160003', 103, '55인치 LED TV', '깨끗한 상태입니다.', 600000, 'NEW', 1, 1, '2025-03-08 16:45:00', 18),
('9160004', 105, '아이패드 프로 5세대', '애플펜슬 포함', 950000, 'OLD', 2, 0, '2025-03-07 09:30:00', 12),
('9160005', 106, '갤럭시 워치5 44mm', '미개봉 새 상품', 280000, 'NEW', 1, 1, '2025-03-06 13:20:00', 10),
('9160006', 201, '남성용 가죽 지갑', '선물받았는데 사용 안 함', 50000, 'NEW', 3, 1, '2025-03-04 18:10:00', 14),
('9160007', 202, '여성용 핸드백', '한두 번 사용했습니다.', 70000, 'OLD', 2, 0, '2025-03-03 10:05:00', 9),
('9160008', 301, '4인용 소파 판매', '이사 관계로 급처', 200000, 'OLD', 3, 0, '2025-03-01 19:20:00', 22),
('9160009', 302, '퀸사이즈 침대 프레임', '깔끔한 상태', 250000, 'NEW', 1, 1, '2025-02-28 17:50:00', 11),
('9160010', 303, '책장 팝니다', '튼튼한 원목 책장', 90000, 'OLD', 2, 0, '2025-02-27 14:15:00', 8),
('9160011', 401, '운동기구 세트', '홈트용으로 좋아요', 300000, 'NEW', 1, 1, '2025-02-26 16:40:00', 10),
('9160012', 501, '영어 회화 책 세트', '공부할 때 유용함', 30000, 'NEW', 1, 1, '2025-02-24 09:10:00', 9),
('9160013', 601, '전자레인지', '정상 작동합니다.', 50000, 'OLD', 2, 0, '2025-02-23 12:15:00', 12),
('9160014', 602, '진공 청소기', '먼지 없이 깨끗', 75000, 'NEW', 1, 1, '2025-02-22 13:30:00', 10),
('9160015', 801, '닌텐도 스위치 OLED', '게임 포함', 320000, 'NEW', 1, 1, '2025-02-20 11:55:00', 5),
('9160016', 901, '뮤지컬 티켓 판매', '좌석 좋습니다.', 100000, 'OLD', 2, 0, '2025-02-19 17:10:00', 10),
('9160015', 702, '유모차 팝니다', '거의 새것입니다.', 220000, 'OLD', 2, 0, '2025-02-25 09:30:00', 14),
('9160012', 503, '토익 교재', '실전 문제집 포함', 45000, 'NEW', 1, 1, '2025-02-26 14:45:00', 11)
;