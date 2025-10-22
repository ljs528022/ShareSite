-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: sharesiteDB
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `d1_authority`
--

DROP TABLE IF EXISTS `d1_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_authority` (
  `authKey` int NOT NULL AUTO_INCREMENT,
  `auth` varchar(10) NOT NULL,
  PRIMARY KEY (`authKey`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_authority`
--

LOCK TABLES `d1_authority` WRITE;
/*!40000 ALTER TABLE `d1_authority` DISABLE KEYS */;
INSERT INTO `d1_authority` VALUES (1,'ADMIN'),(2,'MEMBER');
/*!40000 ALTER TABLE `d1_authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_category`
--

DROP TABLE IF EXISTS `d1_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_category` (
  `cateKey` int NOT NULL,
  `catename` varchar(20) NOT NULL,
  PRIMARY KEY (`cateKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_category`
--

LOCK TABLES `d1_category` WRITE;
/*!40000 ALTER TABLE `d1_category` DISABLE KEYS */;
INSERT INTO `d1_category` VALUES (100,'전자기기/IT'),(101,'스마트폰'),(102,'컴퓨터/노트북'),(103,'가전제품'),(105,'태블릿PC'),(106,'스마트워치/밴드'),(107,'배터리/충전기/케이블'),(108,'기타'),(200,'의류/패션'),(201,'남성의류'),(202,'여성의류'),(203,'아동복'),(204,'교복/체육복/단복'),(300,'가구/인테리어'),(301,'소파/의자'),(302,'침대/매트리스'),(303,'책상/서랍'),(304,'학생/서재/서무용가구'),(305,'화장대/협탁/거울'),(400,'스포츠/레저'),(401,'운동기구'),(402,'캠핑용품'),(403,'낚시용품'),(404,'등산용품'),(405,'기타 레저용품'),(500,'도서/문구/음반'),(501,'유아용도서/음반'),(502,'만화/소설'),(503,'학습/교육'),(504,'음반/DVD/굿즈'),(505,'문구/사무'),(600,'생활용품'),(601,'주방용품'),(602,'청소/세탁용품'),(603,'욕실용품'),(604,'생활잡화'),(700,'유아/아동용품'),(701,'아동의류'),(702,'유아용품'),(703,'장난감'),(800,'게임'),(801,'PC게임'),(802,'플레이스테이션'),(803,'PSP'),(804,'닌텐도'),(805,'기타'),(900,'기타'),(901,'티켓/쿠폰'),(902,'무료나눔');
/*!40000 ALTER TABLE `d1_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_chatMessage`
--

DROP TABLE IF EXISTS `d1_chatMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_chatMessage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomKey` varchar(50) NOT NULL,
  `senderKey` varchar(20) NOT NULL,
  `receiverKey` varchar(20) NOT NULL,
  `message` longtext NOT NULL,
  `readAt` datetime DEFAULT NULL,
  `timestamp` datetime NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roomKey` (`roomKey`),
  KEY `senderKey` (`senderKey`),
  KEY `receiverKey` (`receiverKey`),
  CONSTRAINT `d1_chatMessage_ibfk_1` FOREIGN KEY (`roomKey`) REFERENCES `d1_chatroom` (`roomKey`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `d1_chatMessage_ibfk_2` FOREIGN KEY (`senderKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `d1_chatMessage_ibfk_3` FOREIGN KEY (`receiverKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_chatMessage`
--

LOCK TABLES `d1_chatMessage` WRITE;
/*!40000 ALTER TABLE `d1_chatMessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_chatMessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_chatroom`
--

DROP TABLE IF EXISTS `d1_chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_chatroom` (
  `roomKey` varchar(50) NOT NULL,
  `senderKey` varchar(20) NOT NULL,
  `receiverKey` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `senderLeft` tinyint(1) DEFAULT NULL,
  `receiverLeft` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`roomKey`),
  KEY `senderKey` (`senderKey`),
  KEY `receiverKey` (`receiverKey`),
  CONSTRAINT `d1_chatroom_ibfk_1` FOREIGN KEY (`senderKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `d1_chatroom_ibfk_2` FOREIGN KEY (`receiverKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_chatroom`
--

LOCK TABLES `d1_chatroom` WRITE;
/*!40000 ALTER TABLE `d1_chatroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_chatroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_item`
--

DROP TABLE IF EXISTS `d1_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_item` (
  `itemKey` int NOT NULL AUTO_INCREMENT,
  `userKey` varchar(20) NOT NULL,
  `cateKey` int NOT NULL,
  `subject` varchar(200) NOT NULL,
  `content` longtext,
  `price` int DEFAULT NULL,
  `itemtype` varchar(20) NOT NULL,
  `purtype` int NOT NULL,
  `tradestatus` tinyint(1) DEFAULT NULL,
  `writeDate` datetime DEFAULT NULL,
  `viewcnt` int DEFAULT NULL,
  PRIMARY KEY (`itemKey`),
  KEY `cateKey` (`cateKey`),
  KEY `userKey` (`userKey`),
  CONSTRAINT `d1_item_ibfk_1` FOREIGN KEY (`cateKey`) REFERENCES `d1_category` (`cateKey`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `d1_item_ibfk_2` FOREIGN KEY (`userKey`) REFERENCES `d1_user` (`userKey`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_item`
--

LOCK TABLES `d1_item` WRITE;
/*!40000 ALTER TABLE `d1_item` DISABLE KEYS */;
INSERT INTO `d1_item` VALUES (1,'9160001',101,'갤럭시 S22 팝니다','상태 최상입니다.',800000,'NEW',1,1,'2025-03-10 14:30:00',15),(2,'9160002',102,'LG그램 16인치 판매','가볍고 성능 좋아요.',950000,'OLD',2,0,'2025-03-09 11:15:00',20),(3,'9160003',103,'55인치 LED TV','깨끗한 상태입니다.',600000,'NEW',1,1,'2025-03-08 16:45:00',18),(4,'9160004',105,'아이패드 프로 5세대','애플펜슬 포함',950000,'OLD',2,0,'2025-03-07 09:30:00',12),(5,'9160005',106,'갤럭시 워치5 44mm','미개봉 새 상품',280000,'NEW',1,1,'2025-03-06 13:20:00',10),(6,'9160006',201,'남성용 가죽 지갑','선물받았는데 사용 안 함',50000,'NEW',3,1,'2025-03-04 18:10:00',14),(7,'9160007',202,'여성용 핸드백','한두 번 사용했습니다.',70000,'OLD',2,0,'2025-03-03 10:05:00',9),(8,'9160008',301,'4인용 소파 판매','이사 관계로 급처',200000,'OLD',3,0,'2025-03-01 19:20:00',22),(9,'9160009',302,'퀸사이즈 침대 프레임','깔끔한 상태',250000,'NEW',1,1,'2025-02-28 17:50:00',11),(10,'9160010',303,'책장 팝니다','튼튼한 원목 책장',90000,'OLD',2,0,'2025-02-27 14:15:00',8),(11,'9160011',401,'운동기구 세트','홈트용으로 좋아요',300000,'NEW',1,1,'2025-02-26 16:40:00',10),(12,'9160012',501,'영어 회화 책 세트','공부할 때 유용함',30000,'NEW',1,1,'2025-02-24 09:10:00',9),(13,'9160013',601,'전자레인지','정상 작동합니다.',50000,'OLD',2,0,'2025-02-23 12:15:00',12),(14,'9160014',602,'진공 청소기','먼지 없이 깨끗',75000,'NEW',1,1,'2025-02-22 13:30:00',10),(15,'9160015',801,'닌텐도 스위치 OLED','게임 포함',320000,'NEW',1,1,'2025-02-20 11:55:00',5),(16,'9160016',901,'뮤지컬 티켓 판매','좌석 좋습니다.',100000,'OLD',2,0,'2025-02-19 17:10:00',10),(17,'9160015',702,'유모차 팝니다','거의 새것입니다.',220000,'OLD',2,0,'2025-02-25 09:30:00',14),(18,'9160012',503,'토익 교재','실전 문제집 포함',45000,'NEW',1,1,'2025-02-26 14:45:00',11),(19,'9160004',703,'유아용 장난감 팝니다','택배 가능합니다. 착불입니다.',98000,'OLD',3,1,'2025-05-23 03:11:05',18),(20,'9160016',802,'플레이스테이션5 게임 팩','사용감 거의 없고 상태 매우 양호합니다.',13000,'OLD',1,0,'2025-04-27 23:20:05',82),(21,'9160010',303,'책상 세트 저렴하게 드려요','직거래만 가능하며 지역은 강남입니다.',93000,'NEW',1,0,'2025-05-08 10:23:05',14),(22,'9160008',201,'유니클로 바지 팝니다','직거래만 가능하며 지역은 강남입니다.',47000,'OLD',3,0,'2025-06-12 02:51:05',63),(23,'9160011',301,'중고 소파 팝니다','가성비 좋아요. 빠른 거래 원합니다.',57000,'NEW',1,1,'2025-04-18 17:35:05',3),(24,'9160014',305,'화장대 거울 팝니다','급처 합니다. 깉마 문의는 채팅으로 부탁합니다.',60000,'OLD',1,0,'2025-04-14 17:06:05',90),(25,'9160002',305,'거울과 화장대 세트','사용한지 6개월 되었으며, 생활기스 조금 있습니다.',4000,'OLD',2,0,'2025-06-02 12:03:05',30),(26,'9160004',802,'닌텐도 스위치2 미개봉','기타 문의는 메시지 주세요.',51000,'NEW',3,1,'2025-04-18 06:56:05',13),(27,'9160006',505,'문구류 대량 판매','기타 문의는 메시지 주세요.',96000,'OLD',1,1,'2025-06-05 22:35:05',93),(28,'9160014',802,'닌텐도 스위치 미개봉','택배 가능합니다. 착불입니다.',39000,'NEW',3,1,'2025-05-19 21:12:05',95),(29,'9160012',106,'스마트워치 새것','정리 중이라 여러 개 같이 구매하시면 할인 드려요.',51000,'OLD',2,1,'2025-05-13 19:45:05',55),(30,'9160012',503,'영어 학습서 판매','실사용은 거의 없고 보관만 했습니다.',90000,'OLD',1,1,'2025-04-18 00:37:05',37),(31,'9160014',106,'스마트워치 새것','실사용은 거의 없고 보관만 했습니다.',99000,'OLD',1,1,'2025-06-07 05:32:05',64),(32,'9160008',801,'PC게임 컬렉션','사용한지 6개월 되었으며, 생활기스 조금 있습니다.',53000,'NEW',1,0,'2025-04-28 04:31:05',66),(33,'9160002',106,'스마트워치 새것','기타 문의는 메시지 주세요.',73000,'NEW',3,0,'2025-04-16 07:25:05',84),(34,'9160007',102,'게이밍 노트북 급처','실사용은 거의 없고 보관만 했습니다.',71000,'NEW',1,1,'2025-06-11 06:18:05',98),(35,'9160002',801,'PC게임 컬렉션','사진 참고 바랍니다.',68000,'NEW',1,1,'2025-05-22 22:46:05',97),(36,'9160010',200,'중고 소파 팝니다','정리 중이라 여러 개 같이 구매하시면 할인 드려요.',46000,'OLD',1,1,'2025-04-27 04:27:05',43),(37,'9160003',502,'원피스 전권','택배 가능합니다. 착불입니다.',97000,'OLD',1,1,'2025-05-05 03:36:05',39),(38,'9160010',305,'거울과 화장대 세트','박스 미개봉 새제품입니다.',98000,'OLD',1,1,'2025-05-07 19:51:05',42),(39,'9160005',405,'문구류 대량 판매','정리 중이라 여러 개 같이 구매하시면 할인 드려요.',1000,'NEW',3,0,'2025-06-02 15:36:05',40),(40,'9160011',503,'수학 문제집 판매','정리 중이라 여러 개 같이 구매하시면 할인 드려요.',46000,'OLD',2,0,'2025-05-18 03:55:05',31),(41,'9160007',802,'플레이스테이션5 게임 팩','가성비 좋아요. 빠른 거래 원합니다.',35000,'NEW',1,1,'2025-06-02 04:29:05',83),(42,'9160009',503,'영어 학습서 판매','사진 참고 바랍니다.',70000,'NEW',3,1,'2025-05-24 21:26:05',54),(43,'9160016',500,'문구류 대량 판매','기타 문의는 메시지 주세요.',46000,'OLD',3,0,'2025-04-17 20:08:05',19),(44,'9160015',703,'유아용 장난감 정리합니다','박스 미개봉 새제품입니다.',42000,'NEW',3,0,'2025-04-22 20:34:05',14),(45,'9160016',303,'책상 세트 저렴하게 드려요','기타 문의는 메시지 주세요.',43000,'OLD',2,0,'2025-06-10 07:31:05',64),(46,'9160013',303,'책상 세트 저렴하게 드려요','사용감 거의 없고 상태 매우 양호합니다.',92000,'OLD',1,1,'2025-06-09 05:21:05',75),(47,'9160009',801,'PC게임 컬렉션','실사용은 거의 없고 보관만 했습니다.',2000,'NEW',3,0,'2025-06-04 23:52:05',96),(48,'9160002',802,'플레이스테이션5 게임 팩','가성비 좋아요. 빠른 거래 원합니다.',21000,'NEW',1,0,'2025-06-11 00:19:05',58),(49,'9160013',101,'갤럭시 S20 중고 판매','사용감 거의 없고 상태 매우 양호합니다.',6000,'NEW',1,0,'2025-05-25 00:36:05',60),(50,'9160012',804,'닌텐도 스위치 미개봉','박스 미개봉 새제품입니다.',2000,'OLD',1,0,'2025-06-12 02:18:05',3),(51,'9160014',703,'유아용 장난감 정리합니다','직거래만 가능하며 지역은 강남입니다.',10000,'NEW',2,1,'2025-05-02 17:35:05',51),(52,'9160006',301,'중고 소파 팝니다','사진 참고 바랍니다.',3000,'NEW',3,0,'2025-05-05 17:00:05',76),(53,'9160005',801,'PC게임 컬렉션','실사용은 거의 없고 보관만 했습니다.',84000,'NEW',1,0,'2025-05-09 02:04:05',95),(54,'9160008',400,'아동용 자전거 판매','박스 미개봉 새제품입니다.',11000,'NEW',3,0,'2025-06-03 09:14:05',86),(55,'9160016',500,'문구류 대량 판매','사용감 거의 없고 상태 매우 양호합니다.',59000,'NEW',1,0,'2025-05-02 09:50:05',46),(56,'9160005',101,'갤럭시 S22 중고 판매','직거래만 가능하며 지역은 강남입니다.',43000,'NEW',3,1,'2025-06-03 15:24:05',67),(57,'9160007',101,'아이폰 14 프로 새제품','기타 문의는 메시지 주세요.',15000,'OLD',3,0,'2025-04-29 09:55:05',40);
/*!40000 ALTER TABLE `d1_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_item_image`
--

DROP TABLE IF EXISTS `d1_item_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_item_image` (
  `imageKey` int NOT NULL AUTO_INCREMENT,
  `itemKey` int NOT NULL,
  `imgUrl` varchar(500) DEFAULT NULL,
  `isMain` tinyint(1) NOT NULL,
  PRIMARY KEY (`imageKey`),
  KEY `itemKey` (`itemKey`),
  CONSTRAINT `d1_item_image_ibfk_1` FOREIGN KEY (`itemKey`) REFERENCES `d1_item` (`itemKey`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_item_image`
--

LOCK TABLES `d1_item_image` WRITE;
/*!40000 ALTER TABLE `d1_item_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_item_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_like`
--

DROP TABLE IF EXISTS `d1_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_like` (
  `wishKey` int NOT NULL AUTO_INCREMENT,
  `userKey` varchar(20) NOT NULL,
  `itemKey` int NOT NULL,
  PRIMARY KEY (`wishKey`),
  UNIQUE KEY `uq_user_item` (`userKey`,`itemKey`),
  KEY `itemKey` (`itemKey`),
  CONSTRAINT `d1_like_ibfk_1` FOREIGN KEY (`itemKey`) REFERENCES `d1_item` (`itemKey`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `d1_like_ibfk_2` FOREIGN KEY (`userKey`) REFERENCES `d1_user` (`userKey`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_like`
--

LOCK TABLES `d1_like` WRITE;
/*!40000 ALTER TABLE `d1_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_location`
--

DROP TABLE IF EXISTS `d1_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_location` (
  `userKey` varchar(20) NOT NULL,
  `itemKey` int DEFAULT NULL,
  `useralias` varchar(50) NOT NULL,
  `address` varchar(300) NOT NULL,
  `zoneCode` varchar(300) NOT NULL,
  `main` tinyint(1) DEFAULT NULL,
  `detail` varchar(300) DEFAULT NULL,
  `label` varchar(100) DEFAULT NULL,
  KEY `userKey` (`userKey`),
  KEY `itemKey` (`itemKey`),
  CONSTRAINT `d1_location_ibfk_1` FOREIGN KEY (`userKey`) REFERENCES `d1_user` (`userKey`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `d1_location_ibfk_2` FOREIGN KEY (`itemKey`) REFERENCES `d1_item` (`itemKey`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_location`
--

LOCK TABLES `d1_location` WRITE;
/*!40000 ALTER TABLE `d1_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_notice`
--

DROP TABLE IF EXISTS `d1_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_notice` (
  `noticeKey` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `noticeType` int NOT NULL,
  `writeDate` datetime DEFAULT NULL,
  PRIMARY KEY (`noticeKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_notice`
--

LOCK TABLES `d1_notice` WRITE;
/*!40000 ALTER TABLE `d1_notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_payment`
--

DROP TABLE IF EXISTS `d1_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_payment` (
  `orderKey` varchar(100) NOT NULL,
  `sellerKey` varchar(20) NOT NULL,
  `buyerKey` varchar(20) NOT NULL,
  `itemKey` int NOT NULL,
  `location` varchar(300) DEFAULT NULL,
  `tradeType` int NOT NULL,
  `purType` varchar(50) NOT NULL,
  `price` int NOT NULL,
  `purchaseDate` datetime NOT NULL,
  `confirmed` tinyint(1) NOT NULL,
  PRIMARY KEY (`orderKey`),
  KEY `sellerKey` (`sellerKey`),
  KEY `buyerKey` (`buyerKey`),
  KEY `itemKey` (`itemKey`),
  CONSTRAINT `d1_payment_ibfk_1` FOREIGN KEY (`sellerKey`) REFERENCES `d1_user` (`userKey`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `d1_payment_ibfk_2` FOREIGN KEY (`buyerKey`) REFERENCES `d1_user` (`userKey`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `d1_payment_ibfk_3` FOREIGN KEY (`itemKey`) REFERENCES `d1_item` (`itemKey`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_payment`
--

LOCK TABLES `d1_payment` WRITE;
/*!40000 ALTER TABLE `d1_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_report`
--

DROP TABLE IF EXISTS `d1_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_report` (
  `reportKey` varchar(50) NOT NULL,
  `reporterKey` varchar(20) NOT NULL,
  `targetKey` varchar(20) NOT NULL,
  `reason` int NOT NULL,
  `content` longtext NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`reportKey`),
  KEY `reporterKey` (`reporterKey`),
  KEY `targetKey` (`targetKey`),
  CONSTRAINT `d1_report_ibfk_1` FOREIGN KEY (`reporterKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `d1_report_ibfk_2` FOREIGN KEY (`targetKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_report`
--

LOCK TABLES `d1_report` WRITE;
/*!40000 ALTER TABLE `d1_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_review`
--

DROP TABLE IF EXISTS `d1_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_review` (
  `reviewKey` int NOT NULL AUTO_INCREMENT,
  `sellerKey` varchar(20) NOT NULL,
  `buyerKey` varchar(20) NOT NULL,
  `reviewScore` int NOT NULL,
  `reviewDetail` longtext,
  `writeDate` datetime NOT NULL,
  PRIMARY KEY (`reviewKey`),
  KEY `sellerKey` (`sellerKey`),
  KEY `buyerKey` (`buyerKey`),
  CONSTRAINT `d1_review_ibfk_1` FOREIGN KEY (`sellerKey`) REFERENCES `d1_user` (`userKey`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `d1_review_ibfk_2` FOREIGN KEY (`buyerKey`) REFERENCES `d1_user` (`userKey`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_review`
--

LOCK TABLES `d1_review` WRITE;
/*!40000 ALTER TABLE `d1_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `d1_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d1_user`
--

DROP TABLE IF EXISTS `d1_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `d1_user` (
  `userKey` varchar(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(150) DEFAULT NULL,
  `useralias` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `regtype` varchar(10) NOT NULL,
  `userimg` varchar(600) DEFAULT NULL,
  `regDate` datetime DEFAULT NULL,
  `state` varchar(1) DEFAULT NULL,
  `visitcnt` int DEFAULT NULL,
  `tradecnt` int DEFAULT NULL,
  `auth` varchar(10) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT '0',
  `userIntro` varchar(500) DEFAULT NULL,
  `editedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`userKey`),
  UNIQUE KEY `userKey` (`userKey`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d1_user`
--

LOCK TABLES `d1_user` WRITE;
/*!40000 ALTER TABLE `d1_user` DISABLE KEYS */;
INSERT INTO `d1_user` VALUES ('0000001','admin','$2a$10$6yfOoPkgSD4qmK/M5YT18eKTkaZIZumU1Uvfm2wJkLaEgpoebQ.Ve','admin','admin@example.com','S','','2025-08-15 15:05:48','N',1,0,'ADMIN',1,NULL,NULL),('9160001','alicegreen','$2a$12$Xv8t7jT/NYO/MxHl0y9bHezxHiUPyk0qHq9gwY/0IE0v1f2uqTxO6','AliceG','alicegreen@example.com','S','','2025-03-08 10:00:00','N',5,2,'MEMBER',1,NULL,NULL),('9160002','bobwhite','$2a$12$Z3G9fPpxj2X7t0H7iw2a9o2BO6zZG1B7s2tF7Xak7M1l2IjaNhp0a','BobW','bobwhite@example.com','S','','2025-03-07 09:30:00','N',3,1,'MEMBER',1,NULL,NULL),('9160003','charlieblue','$2a$12$9NbtL2OlMECUOYmxnkluaqSz5Z.A1hV8Tmf4z58pOjqB.8lgsFc9O','CharlieB','charlieblue@example.com','S','','2025-03-06 11:20:00','N',7,5,'MEMBER',1,NULL,NULL),('9160004','davidred','$2a$12$K3MI7iW5VzyX34WGb43Jq5kPMUNqZy4Tk2bpNK0kNmBBNO8A6vVQO','DavidR','davidred@example.com','S','','2025-03-05 08:15:00','N',4,3,'MEMBER',1,NULL,NULL),('9160005','emilypurple','$2a$12$34n2c7Dh2y6vFJgm3VRu8gaK5cCEpXZ1K.9XpZpHvvLl7U4g9D3gu','EmilyP','emilypurple@example.com','S','','2025-03-04 17:10:00','N',10,6,'MEMBER',1,NULL,NULL),('9160006','frankyellow','$2a$12$M8xNzGbdYDiD6y1o.HxxmRHRZJj0Oe3RYtWpcEVoPn2vGhDoxcdiW','FrankY','frankyellow@example.com','S','','2025-03-03 12:30:00','N',2,0,'MEMBER',1,NULL,NULL),('9160007','gracebrown','$2a$12$uK52J18hWLtTzJviuS7IlepaE8Me5IlA5Kn.j9icGUL7Zm4sRLOE2','GraceB','gracebrown@example.com','S','','2025-03-02 15:45:00','N',1,2,'MEMBER',1,NULL,NULL),('9160008','hannahblack','$2a$12$9Cj6Zxe58DixQK1lB4LzK8fHjrEdAfkjdzg3MB7yQm.LC2EZZGzmO','HannahB','hannahblack@example.com','S','','2025-03-01 14:40:00','N',3,4,'MEMBER',1,NULL,NULL),('9160009','ianwhite','$2a$12$B0R8gAXr5HGiyKdCFSf7p6jVsEFgAt5nA12d5e03d5P6kUzV7o5Z6','IanW','ianwhite@example.com','S','','2025-02-28 16:25:00','N',8,5,'MEMBER',1,NULL,NULL),('9160010','jacksonblue','$2a$12$L2CTpYrh5M87OxCvZ9Jq8FpekszQfRh.V5w7HuaPGDvxwLO1dYbm6','JacksonB','jacksonblue@example.com','S','','2025-02-27 13:35:00','N',6,2,'MEMBER',1,NULL,NULL),('9160011','katherinegreen','$2a$12$XwUr6Y6.DY9px8nE6jHFqczs5T1VHz13W2o94xDt.tsyNjTO7Fz8a','KatherineG','katherinegreen@example.com','S','','2025-02-26 14:05:00','N',4,1,'MEMBER',1,NULL,NULL),('9160012','lisaorange','$2a$12$D99lx.nBGtPCkZmShl2iHDb8o5kxiPYZfXiO5yXgKbiVTe2Nynfz6','LisaO','lisaorange@example.com','S','','2025-02-25 10:50:00','N',3,4,'MEMBER',1,NULL,NULL),('9160013','michaelsilver','$2a$12$9MYP9mF2CgkEvA7jm0gUofjwn4g59Ih9ShBdS1Ijgw9UN5sFz6yVW','MichaelS','michaelsilver@example.com','S','','2025-02-24 11:25:00','N',7,2,'MEMBER',1,NULL,NULL),('9160014','nataliegold','$2a$12$T4o0W0HJZtkBzmDNBj3Vj.XdsB3fLt8e.tMyN1KDlY5VYOa4ElRny','NatalieG','nataliegold@example.com','S','','2025-02-23 09:30:00','N',9,3,'MEMBER',1,NULL,NULL),('9160015','oliviarose','$2a$12$g6P7pvL2i.OzX5NGnFwDb54Ctb5W0lI7Ff5mr3wzq2yJh.jEwCuqO','OliviaR','oliviarose@example.com','S','','2025-02-22 16:40:00','N',4,5,'MEMBER',1,NULL,NULL),('9160016','paulwhite','$2a$12$FpH13H8mUvM5frDQQJzBGwz.BfepUcmUkK2tiVd.CzD4kI0fLFfy2','PaulW','paulwhite@example.com','S','','2025-02-21 18:10:00','N',2,0,'MEMBER',1,NULL,NULL);
/*!40000 ALTER TABLE `d1_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sharesiteDB'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-22 10:57:38
