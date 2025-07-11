DELETE FROM d1_authority ;
ALTER TABLE d1_authority  AUTO_INCREMENT = 1;

DELETE FROM d1_user;
DELETE FROM d1_category;

INSERT INTO d1_authority (auth) VALUES
('ADMIN'), ('MEMBER');

INSERT INTO d1_user (userKey,username,password,useralias,email,regtype,userimg,regDate,state,visitcnt,tradecnt,auth,emailVerified)
VALUES
('9160001','alicegreen','$2a$12$Xv8t7jT/NYO/MxHl0y9bHezxHiUPyk0qHq9gwY/0IE0v1f2uqTxO6','AliceG','alicegreen@example.com','S','','2025-03-08 10:00:00','N',5,2,'MEMBER',1),
('9160002','bobwhite','$2a$12$Z3G9fPpxj2X7t0H7iw2a9o2BO6zZG1B7s2tF7Xak7M1l2IjaNhp0a','BobW','bobwhite@example.com','S','','2025-03-07 09:30:00','N',3,1,'MEMBER',1),
('9160003','charlieblue','$2a$12$9NbtL2OlMECUOYmxnkluaqSz5Z.A1hV8Tmf4z58pOjqB.8lgsFc9O','CharlieB','charlieblue@example.com','S','','2025-03-06 11:20:00','N',7,5,'MEMBER',1),
('9160004','davidred','$2a$12$K3MI7iW5VzyX34WGb43Jq5kPMUNqZy4Tk2bpNK0kNmBBNO8A6vVQO','DavidR','davidred@example.com','S','','2025-03-05 08:15:00','N',4,3,'MEMBER',1),
('9160005','emilypurple','$2a$12$34n2c7Dh2y6vFJgm3VRu8gaK5cCEpXZ1K.9XpZpHvvLl7U4g9D3gu','EmilyP','emilypurple@example.com','S','','2025-03-04 17:10:00','N',10,6,'MEMBER',1),
('9160006','frankyellow','$2a$12$M8xNzGbdYDiD6y1o.HxxmRHRZJj0Oe3RYtWpcEVoPn2vGhDoxcdiW','FrankY','frankyellow@example.com','S','','2025-03-03 12:30:00','N',2,0,'MEMBER',1),
('9160007','gracebrown','$2a$12$uK52J18hWLtTzJviuS7IlepaE8Me5IlA5Kn.j9icGUL7Zm4sRLOE2','GraceB','gracebrown@example.com','S','','2025-03-02 15:45:00','N',1,2,'MEMBER',1),
('9160008','hannahblack','$2a$12$9Cj6Zxe58DixQK1lB4LzK8fHjrEdAfkjdzg3MB7yQm.LC2EZZGzmO','HannahB','hannahblack@example.com','S','','2025-03-01 14:40:00','N',3,4,'MEMBER',1),
('9160009','ianwhite','$2a$12$B0R8gAXr5HGiyKdCFSf7p6jVsEFgAt5nA12d5e03d5P6kUzV7o5Z6','IanW','ianwhite@example.com','S','','2025-02-28 16:25:00','N',8,5,'MEMBER',1),
('9160010','jacksonblue','$2a$12$L2CTpYrh5M87OxCvZ9Jq8FpekszQfRh.V5w7HuaPGDvxwLO1dYbm6','JacksonB','jacksonblue@example.com','S','','2025-02-27 13:35:00','N',6,2,'MEMBER',1),
('9160011','katherinegreen','$2a$12$XwUr6Y6.DY9px8nE6jHFqczs5T1VHz13W2o94xDt.tsyNjTO7Fz8a','KatherineG','katherinegreen@example.com','S','','2025-02-26 14:05:00','N',4,1,'MEMBER',1),
('9160012','lisaorange','$2a$12$D99lx.nBGtPCkZmShl2iHDb8o5kxiPYZfXiO5yXgKbiVTe2Nynfz6','LisaO','lisaorange@example.com','S','','2025-02-25 10:50:00','N',3,4,'MEMBER',1),
('9160013','michaelsilver','$2a$12$9MYP9mF2CgkEvA7jm0gUofjwn4g59Ih9ShBdS1Ijgw9UN5sFz6yVW','MichaelS','michaelsilver@example.com','S','','2025-02-24 11:25:00','N',7,2,'MEMBER',1),
('9160014','nataliegold','$2a$12$T4o0W0HJZtkBzmDNBj3Vj.XdsB3fLt8e.tMyN1KDlY5VYOa4ElRny','NatalieG','nataliegold@example.com','S','','2025-02-23 09:30:00','N',9,3,'MEMBER',1),
('9160015','oliviarose','$2a$12$g6P7pvL2i.OzX5NGnFwDb54Ctb5W0lI7Ff5mr3wzq2yJh.jEwCuqO','OliviaR','oliviarose@example.com','S','','2025-02-22 16:40:00','N',4,5,'MEMBER',1),
('9160016','paulwhite','$2a$12$FpH13H8mUvM5frDQQJzBGwz.BfepUcmUkK2tiVd.CzD4kI0fLFfy2','PaulW','paulwhite@example.com','S','','2025-02-21 18:10:00','N',2,0,'MEMBER',1),
('ADMIN', 'admin01', '$2a$10$kMZlKAhdbWxBMmFqRQrLeuGLl9Olz2u.QacDN1K4hdu2Rg8RhWe0a', 'ADMIN', 'admin@example.com', 'S', '', '2025-01-01 00:00:00', 'N', 1, 0, 'ADMIN', 1)
;

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
(902, '무료나눔')
;

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
('9160012', 503, '토익 교재', '실전 문제집 포함', 45000, 'NEW', 1, 1, '2025-02-26 14:45:00', 11),
('9160004', 703, '유아용 장난감 팝니다', '택배 가능합니다. 착불입니다.', 98000, 'OLD', 3, TRUE, '2025-05-23 03:11:05', 18),
('9160016', 802, '플레이스테이션5 게임 팩', '사용감 거의 없고 상태 매우 양호합니다.', 13000, 'OLD', 1, FALSE, '2025-04-27 23:20:05', 82),
('9160010', 303, '책상 세트 저렴하게 드려요', '직거래만 가능하며 지역은 강남입니다.', 93000, 'NEW', 1, FALSE, '2025-05-08 10:23:05', 14),
('9160008', 201, '유니클로 바지 팝니다', '직거래만 가능하며 지역은 강남입니다.', 47000, 'OLD', 3, FALSE, '2025-06-12 02:51:05', 63),
('9160011', 301, '중고 소파 팝니다', '가성비 좋아요. 빠른 거래 원합니다.', 57000, 'NEW', 1, TRUE, '2025-04-18 17:35:05', 3),
('9160014', 305, '화장대 거울 팝니다', '급처 합니다. 깉마 문의는 채팅으로 부탁합니다.', 60000, 'OLD', 1, FALSE, '2025-04-14 17:06:05', 90),
('9160002', 305, '거울과 화장대 세트', '사용한지 6개월 되었으며, 생활기스 조금 있습니다.', 4000, 'OLD', 2, FALSE, '2025-06-02 12:03:05', 30),
('9160004', 802, '닌텐도 스위치2 미개봉', '기타 문의는 메시지 주세요.', 51000, 'NEW', 3, TRUE, '2025-04-18 06:56:05', 13),
('9160006', 505, '문구류 대량 판매', '기타 문의는 메시지 주세요.', 96000, 'OLD', 1, TRUE, '2025-06-05 22:35:05', 93),
('9160014', 802, '닌텐도 스위치 미개봉', '택배 가능합니다. 착불입니다.', 39000, 'NEW', 3, TRUE, '2025-05-19 21:12:05', 95),
('9160012', 106, '스마트워치 새것', '정리 중이라 여러 개 같이 구매하시면 할인 드려요.', 51000, 'OLD', 2, TRUE, '2025-05-13 19:45:05', 55),
('9160012', 503, '영어 학습서 판매', '실사용은 거의 없고 보관만 했습니다.', 90000, 'OLD', 1, TRUE, '2025-04-18 00:37:05', 37),
('9160014', 106, '스마트워치 새것', '실사용은 거의 없고 보관만 했습니다.', 99000, 'OLD', 1, TRUE, '2025-06-07 05:32:05', 64),
('9160008', 801, 'PC게임 컬렉션', '사용한지 6개월 되었으며, 생활기스 조금 있습니다.', 53000, 'NEW', 1, FALSE, '2025-04-28 04:31:05', 66),
('9160002', 106, '스마트워치 새것', '기타 문의는 메시지 주세요.', 73000, 'NEW', 3, FALSE, '2025-04-16 07:25:05', 84),
('9160007', 102, '게이밍 노트북 급처', '실사용은 거의 없고 보관만 했습니다.', 71000, 'NEW', 1, TRUE, '2025-06-11 06:18:05', 98),
('9160002', 801, 'PC게임 컬렉션', '사진 참고 바랍니다.', 68000, 'NEW', 1, TRUE, '2025-05-22 22:46:05', 97),
('9160010', 200, '중고 소파 팝니다', '정리 중이라 여러 개 같이 구매하시면 할인 드려요.', 46000, 'OLD', 1, TRUE, '2025-04-27 04:27:05', 43),
('9160003', 502, '원피스 전권', '택배 가능합니다. 착불입니다.', 97000, 'OLD', 1, TRUE, '2025-05-05 03:36:05', 39),
('9160010', 305, '거울과 화장대 세트', '박스 미개봉 새제품입니다.', 98000, 'OLD', 1, TRUE, '2025-05-07 19:51:05', 42),
('9160005', 405, '문구류 대량 판매', '정리 중이라 여러 개 같이 구매하시면 할인 드려요.', 1000, 'NEW', 3, FALSE, '2025-06-02 15:36:05', 40),
('9160011', 503, '수학 문제집 판매', '정리 중이라 여러 개 같이 구매하시면 할인 드려요.', 46000, 'OLD', 2, FALSE, '2025-05-18 03:55:05', 31),
('9160007', 802, '플레이스테이션5 게임 팩', '가성비 좋아요. 빠른 거래 원합니다.', 35000, 'NEW', 1, TRUE, '2025-06-02 04:29:05', 83),
('9160009', 503, '영어 학습서 판매', '사진 참고 바랍니다.', 70000, 'NEW', 3, TRUE, '2025-05-24 21:26:05', 54),
('9160016', 500, '문구류 대량 판매', '기타 문의는 메시지 주세요.', 46000, 'OLD', 3, FALSE, '2025-04-17 20:08:05', 19),
('9160015', 703, '유아용 장난감 정리합니다', '박스 미개봉 새제품입니다.', 42000, 'NEW', 3, FALSE, '2025-04-22 20:34:05', 14),
('9160016', 303, '책상 세트 저렴하게 드려요', '기타 문의는 메시지 주세요.', 43000, 'OLD', 2, FALSE, '2025-06-10 07:31:05', 64),
('9160013', 303, '책상 세트 저렴하게 드려요', '사용감 거의 없고 상태 매우 양호합니다.', 92000, 'OLD', 1, TRUE, '2025-06-09 05:21:05', 75),
('9160009', 801, 'PC게임 컬렉션', '실사용은 거의 없고 보관만 했습니다.', 2000, 'NEW', 3, FALSE, '2025-06-04 23:52:05', 96),
('9160002', 802, '플레이스테이션5 게임 팩', '가성비 좋아요. 빠른 거래 원합니다.', 21000, 'NEW', 1, FALSE, '2025-06-11 00:19:05', 58),
('9160013', 101, '갤럭시 S20 중고 판매', '사용감 거의 없고 상태 매우 양호합니다.', 6000, 'NEW', 1, FALSE, '2025-05-25 00:36:05', 60),
('9160012', 804, '닌텐도 스위치 미개봉', '박스 미개봉 새제품입니다.', 2000, 'OLD', 1, FALSE, '2025-06-12 02:18:05', 3),
('9160014', 703, '유아용 장난감 정리합니다', '직거래만 가능하며 지역은 강남입니다.', 10000, 'NEW', 2, TRUE, '2025-05-02 17:35:05', 51),
('9160006', 301, '중고 소파 팝니다', '사진 참고 바랍니다.', 3000, 'NEW', 3, FALSE, '2025-05-05 17:00:05', 76),
('9160005', 801, 'PC게임 컬렉션', '실사용은 거의 없고 보관만 했습니다.', 84000, 'NEW', 1, FALSE, '2025-05-09 02:04:05', 95),
('9160008', 400, '아동용 자전거 판매', '박스 미개봉 새제품입니다.', 11000, 'NEW', 3, FALSE, '2025-06-03 09:14:05', 86),
('9160016', 500, '문구류 대량 판매', '사용감 거의 없고 상태 매우 양호합니다.', 59000, 'NEW', 1, FALSE, '2025-05-02 09:50:05', 46),
('9160005', 101, '갤럭시 S22 중고 판매', '직거래만 가능하며 지역은 강남입니다.', 43000, 'NEW', 3, TRUE, '2025-06-03 15:24:05', 67),
('9160007', 101, '아이폰 14 프로 새제품', '기타 문의는 메시지 주세요.', 15000, 'OLD', 3, FALSE, '2025-04-29 09:55:05', 40)
;