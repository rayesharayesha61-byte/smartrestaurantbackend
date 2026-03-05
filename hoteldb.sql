-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(20) DEFAULT NULL,
  `items` text,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (1,'T22','[{\"id\":27,\"menu_name\":\"Fried rice \",\"quantity\":1,\"price\":\"100.00\"}]','Paid','2026-03-03 08:05:58',110.00),(2,'T11','[{\"id\":19,\"menu_name\":\"Briyani \",\"quantity\":1,\"price\":\"150.00\"}]','Ready','2026-03-03 08:06:54',165.00),(3,'T20','[{\"id\":18,\"menu_name\":\"Fried rice \",\"quantity\":2,\"price\":\"100.00\"}]','Paid','2026-03-03 08:07:49',220.00),(4,'T20','[{\"id\":18,\"menu_name\":\"Fried rice \",\"quantity\":2,\"price\":\"100.00\"}]','Paid','2026-03-03 08:59:18',220.00),(5,'T20','[{\"id\":18,\"menu_name\":\"Fried rice \",\"quantity\":2,\"price\":\"100.00\"}]','Paid','2026-03-03 08:59:39',220.00),(6,'T20','[{\"id\":28,\"menu_name\":\"Chicken parrotta \",\"quantity\":1,\"price\":\"60.00\"},{\"id\":18,\"menu_name\":\"Fried rice \",\"quantity\":2,\"price\":\"100.00\"}]','Ready','2026-03-03 09:10:16',286.00),(7,'T30','[{\"id\":29,\"menu_name\":\"Parrotta \",\"quantity\":1,\"price\":\"50.00\"}]','Paid','2026-03-05 07:24:58',55.00),(8,'T11','[{\"id\":19,\"menu_name\":\"Briyani \",\"quantity\":1,\"price\":\"150.00\"}]','Paid','2026-03-05 07:36:54',165.00),(9,'T23','[{\"id\":24,\"menu_name\":\"Chicken parrotta \",\"quantity\":1,\"price\":\"60.00\"},{\"id\":23,\"menu_name\":\"Noddles \",\"quantity\":1,\"price\":\"100.00\"}]','Ready','2026-03-05 07:37:01',176.00),(10,'T22','[{\"id\":27,\"menu_name\":\"Fried rice \",\"quantity\":1,\"price\":\"100.00\"}]','Paid','2026-03-05 07:37:06',110.00),(11,'T22','[{\"id\":27,\"menu_name\":\"Fried rice \",\"quantity\":1,\"price\":\"100.00\"}]','Ready','2026-03-05 07:37:14',110.00),(12,'T20','[{\"id\":28,\"menu_name\":\"Chicken parrotta \",\"quantity\":1,\"price\":\"60.00\"},{\"id\":18,\"menu_name\":\"Fried rice \",\"quantity\":2,\"price\":\"100.00\"}]','Paid','2026-03-05 07:37:23',286.00);
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billspay`
--

DROP TABLE IF EXISTS `billspay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billspay` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `table_number` varchar(10) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `discount_percent` int DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `gst` decimal(10,2) DEFAULT NULL,
  `tip` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billspay`
--

LOCK TABLES `billspay` WRITE;
/*!40000 ALTER TABLE `billspay` DISABLE KEYS */;
INSERT INTO `billspay` VALUES (1,6,'T20',260.00,10,26.00,42.12,0.00,276.12,'2026-03-04 06:44:21'),(2,6,'T20',260.00,10,26.00,42.12,0.00,276.12,'2026-03-04 06:46:41'),(3,2,'T11',150.00,5,7.50,25.65,0.00,168.15,'2026-03-04 06:49:32'),(4,2,'T11',150.00,5,7.50,25.65,0.00,168.15,'2026-03-04 06:54:27'),(5,6,'T20',260.00,5,13.00,44.46,0.00,291.46,'2026-03-04 12:04:42'),(6,7,'T30',50.00,5,2.50,8.55,0.00,56.05,'2026-03-05 07:25:28'),(7,11,'T22',100.00,0,0.00,18.00,0.00,118.00,'2026-03-05 08:09:29'),(8,11,'T22',100.00,5,5.00,17.10,0.00,112.10,'2026-03-05 08:11:08');
/*!40000 ALTER TABLE `billspay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text,
  `is_veg` tinyint(1) DEFAULT NULL,
  `available` tinyint(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (2,'Briyani ','1',150.00,'.',0,1,'1771579969851.jpg'),(11,'Idli ','1',50.00,'.',1,1,'1771584026779.jpg'),(12,'Fried rice ','1',100.00,'.',0,1,'1771589455115.jpg'),(13,'Parrotta ','1',50.00,'.',0,1,'1772017911632.jpg'),(14,'Noddles ','2',100.00,'.',1,1,'1772018026341.jpg'),(15,'Chicken parrotta ','1',60.00,'.',0,0,'1772097878922.jpg'),(16,'Lemon juice ','3',50.00,'.',0,0,'1772098421123.jpg');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_id` int DEFAULT NULL,
  `menu_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (18,11,12,2,'Ready','2026-02-23 10:16:00'),(19,1,2,1,'Ready','2026-02-23 11:48:06'),(23,14,14,1,'Ready','2026-02-26 07:35:17'),(24,14,15,1,'Ready','2026-02-26 09:25:39'),(26,12,13,1,'Ready','2026-03-02 08:46:55'),(27,13,12,1,'Ready','2026-03-03 07:02:00'),(28,11,15,1,'Ready','2026-03-03 09:09:07'),(29,15,13,1,'Ready','2026-03-05 07:24:26');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `table_id` int NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `guests` int NOT NULL,
  `status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (4,'Rahul','',11,'2026-02-25','07:00:00',5,'Pending','2026-02-25 08:23:47');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(10) NOT NULL,
  `capacity` int NOT NULL,
  `table_type` varchar(50) NOT NULL,
  `status` enum('Available','Reserved','Occupied') DEFAULT 'Available',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (1,'T11',5,'Outdoor','Reserved','-','2026-02-19 09:51:11'),(2,'T12',5,'High-top','Occupied','.','2026-02-19 10:09:23'),(3,'T13',5,'Outdoor','Reserved','.','2026-02-19 11:48:12'),(4,'T14',5,'Outdoor','Available','.','2026-02-19 12:06:44'),(6,'T15',5,'High-top','Reserved','.','2026-02-19 16:18:13'),(10,'T18',5,'Booth','Occupied','.','2026-02-21 09:24:42'),(11,'T20',3,'Indoor','Occupied','.','2026-02-21 09:36:22'),(12,'T21',5,'Outdoor','Occupied','.','2026-02-25 08:27:07'),(13,'T22',4,'Indoor','Available','.','2026-02-25 08:27:26'),(14,'T23',1,'Indoor','Occupied','.','2026-02-25 08:27:36'),(15,'T30',4,'Indoor','Available','','2026-03-05 06:45:47'),(16,'T 25',4,'Indoor','Available','.','2026-03-05 08:19:28');
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','manager','waiter','chef','cashier') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','9876543210','admin@gmail.com','$2b$10$/OG27vLLgppw0V7mFh3VU.lk9BhaMJyExpzvUFtDY.SHe0jcC7Wee','admin',1,'2026-02-26 08:46:16',NULL),(2,'smith','9856325689','smith@gmail.com','$2b$10$vDPb/UUs71Y9dxAw.CRSWOZpzVVyrfcVa.TrNSz7DbRjhw98LddIG','waiter',1,'2026-02-26 08:51:40',NULL),(3,'Manager','9856245869','manager@gmail.com','$2b$10$.aNv4YYnzhlF8rLNDaCz4O/VStMouVz3Mphr4K8YO2D8VSuctpqYu','manager',1,'2026-02-26 08:56:57',NULL),(4,'ravi','5623895698','ravi10@gmail.com','$2b$10$56BI50aLbPgdXFQHL6qD7.suktMJwGYbfFv/kb8V1pCQmN418IgCS','chef',1,'2026-02-26 08:58:01',NULL),(5,'Siva','9875698756','siva@gmail.com','$2b$10$3lvqwW01KN8gRUWiCBRLtOK7HvYj./wQWtqmyIZNIS0Qilm8fqh6K','cashier',0,'2026-02-26 08:58:34',NULL),(6,'Ajith','9856235689','ajith@gmail.com','$2b$10$y5Y1JRrkCO/LNgIBVymQf.iYkiIucks69GaiLs13MDuWYWqt1gLT6','waiter',1,'2026-03-05 07:56:28',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-05 14:19:49
