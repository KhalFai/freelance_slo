-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: freelance_slo
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administratorji`
--

DROP TABLE IF EXISTS `administratorji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administratorji` (
  `idadmin` int NOT NULL AUTO_INCREMENT,
  `eposta` varchar(30) DEFAULT NULL,
  `geslo` varchar(75) DEFAULT NULL,
  `ime` varchar(30) DEFAULT NULL,
  `priimek` varchar(30) DEFAULT NULL,
  `potrjen` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idadmin`),
  UNIQUE KEY `idadmin` (`idadmin`),
  UNIQUE KEY `eposta` (`eposta`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administratorji`
--

LOCK TABLES `administratorji` WRITE;
/*!40000 ALTER TABLE `administratorji` DISABLE KEYS */;
INSERT INTO `administratorji` VALUES (1,'esperswap@gmail.com','$2b$05$o5Emxfk1YlVp6OBQ6omuR.B497AsSM8XMZsfyyHoS9KTduuPjAHgG','Nekdo','Drug',1),(35,'janez.gradnik@gmail.com','$2b$05$nwCUGJFoBZ25ddDiDX7Ba.YUxYiFzXLcD9xPdgI4lpz/yf2b0ssm.','Janez','Gradnik',1),(36,'mail.mail@gmail.com','$2b$05$Iw4kUs3MNU/q1mphW7cTVueFbK.3qvS2amUTux6ZNULfJCfYd6jli','Asdf','Asdf',NULL);
/*!40000 ALTER TABLE `administratorji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administratorji_eposta_blacklist`
--

DROP TABLE IF EXISTS `administratorji_eposta_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administratorji_eposta_blacklist` (
  `idnaslova` int unsigned NOT NULL AUTO_INCREMENT,
  `naslov` varchar(45) NOT NULL,
  PRIMARY KEY (`idnaslova`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administratorji_eposta_blacklist`
--

LOCK TABLES `administratorji_eposta_blacklist` WRITE;
/*!40000 ALTER TABLE `administratorji_eposta_blacklist` DISABLE KEYS */;
INSERT INTO `administratorji_eposta_blacklist` VALUES (1,'marko.tomsic@gmail.com'),(2,'nek.email@neki.email');
/*!40000 ALTER TABLE `administratorji_eposta_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dela`
--

DROP TABLE IF EXISTS `dela`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dela` (
  `iddela` int NOT NULL AUTO_INCREMENT,
  `idpodjetja` int NOT NULL,
  `idizobrazbe` int NOT NULL,
  `idpodrocja` int NOT NULL,
  `idplace` int NOT NULL,
  `idtrajanja` int NOT NULL,
  `iddelovnika` int NOT NULL,
  `naziv` varchar(50) DEFAULT NULL,
  `opis` varchar(1000) DEFAULT NULL,
  `placa` float NOT NULL,
  `opozorjen` tinyint(1) DEFAULT NULL,
  `pojasnilo_admina` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`iddela`),
  UNIQUE KEY `iddela` (`iddela`),
  KEY `idpodjetja` (`idpodjetja`),
  KEY `idizobrazbe` (`idizobrazbe`),
  KEY `idpodrocja` (`idpodrocja`),
  KEY `idplace` (`idplace`),
  KEY `idtrajanja` (`idtrajanja`),
  KEY `iddelovnika` (`iddelovnika`),
  CONSTRAINT `dela_ibfk_1` FOREIGN KEY (`idpodjetja`) REFERENCES `podjetje` (`idpodjetja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dela_ibfk_2` FOREIGN KEY (`idizobrazbe`) REFERENCES `nivojiizobrazbe` (`idnivoja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dela_ibfk_3` FOREIGN KEY (`idpodrocja`) REFERENCES `podrocjapodjetji` (`idpodrocja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dela_ibfk_4` FOREIGN KEY (`idplace`) REFERENCES `vrste_plac` (`idplace`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dela_ibfk_5` FOREIGN KEY (`idtrajanja`) REFERENCES `trajanje` (`idtrajanja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dela_ibfk_6` FOREIGN KEY (`iddelovnika`) REFERENCES `delovnik` (`iddelovnika`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dela`
--

LOCK TABLES `dela` WRITE;
/*!40000 ALTER TABLE `dela` DISABLE KEYS */;
INSERT INTO `dela` VALUES (326,16,0,2,1,1,1,'Programer','Nek opis.',90,NULL,NULL),(327,16,0,2,1,1,1,'Programer 2','Nek opis.',90,NULL,NULL),(328,16,0,2,1,1,1,'Programer 3','Nek opis.',90,1,'vasdf');
/*!40000 ALTER TABLE `dela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dela_has_spretnosti`
--

DROP TABLE IF EXISTS `dela_has_spretnosti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dela_has_spretnosti` (
  `iddela` int NOT NULL,
  `idspretnosti` int NOT NULL,
  KEY `dela_has_spretnosti_ibfk_1` (`iddela`),
  KEY `dela_has_spretnosti_ibfk_2` (`idspretnosti`),
  CONSTRAINT `dela_has_spretnosti_ibfk_1` FOREIGN KEY (`iddela`) REFERENCES `dela` (`iddela`) ON DELETE CASCADE,
  CONSTRAINT `dela_has_spretnosti_ibfk_2` FOREIGN KEY (`idspretnosti`) REFERENCES `spretnosti` (`idspretnosti`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dela_has_spretnosti`
--

LOCK TABLES `dela_has_spretnosti` WRITE;
/*!40000 ALTER TABLE `dela_has_spretnosti` DISABLE KEYS */;
INSERT INTO `dela_has_spretnosti` VALUES (326,0),(326,4),(326,5),(327,0),(327,4),(327,5),(328,0),(328,4),(328,5);
/*!40000 ALTER TABLE `dela_has_spretnosti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dela_opozorila`
--

DROP TABLE IF EXISTS `dela_opozorila`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dela_opozorila` (
  `iddela` int NOT NULL,
  `besedilo_prijave` varchar(500) NOT NULL,
  `iddelavca` int NOT NULL,
  UNIQUE KEY `uq_prijava` (`iddelavca`,`iddela`),
  KEY `iddela_idx` (`iddela`),
  KEY `iddelavca_idx` (`iddelavca`),
  CONSTRAINT `iddela` FOREIGN KEY (`iddela`) REFERENCES `dela` (`iddela`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `iddelavca` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dela_opozorila`
--

LOCK TABLES `dela_opozorila` WRITE;
/*!40000 ALTER TABLE `dela_opozorila` DISABLE KEYS */;
INSERT INTO `dela_opozorila` VALUES (328,'poafiweopfiwoepfip',120);
/*!40000 ALTER TABLE `dela_opozorila` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dela_prijave`
--

DROP TABLE IF EXISTS `dela_prijave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dela_prijave` (
  `iddelavca` int NOT NULL,
  `iddela` int NOT NULL,
  `opis` varchar(1000) DEFAULT NULL,
  `sprejet` tinyint(1) DEFAULT NULL,
  KEY `dela_prijave_ibfk_1` (`iddelavca`),
  KEY `dela_prijave_ibfk_2` (`iddela`),
  CONSTRAINT `dela_prijave_ibfk_1` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dela_prijave_ibfk_2` FOREIGN KEY (`iddela`) REFERENCES `dela` (`iddela`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dela_prijave`
--

LOCK TABLES `dela_prijave` WRITE;
/*!40000 ALTER TABLE `dela_prijave` DISABLE KEYS */;
/*!40000 ALTER TABLE `dela_prijave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delavci`
--

DROP TABLE IF EXISTS `delavci`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delavci` (
  `iddelavca` int NOT NULL AUTO_INCREMENT,
  `eposta` varchar(50) NOT NULL,
  `geslo` varchar(75) NOT NULL,
  `ime` varchar(45) NOT NULL,
  `priimek` varchar(45) NOT NULL,
  `potrditvenakoda` varchar(4) DEFAULT NULL,
  `epostapotrjena` tinyint(1) DEFAULT NULL,
  `datumrojstva` date DEFAULT NULL,
  `telefon` varchar(30) DEFAULT NULL,
  `kratekopis` varchar(500) DEFAULT NULL,
  `opozorjen` tinyint(1) DEFAULT NULL,
  `admin_pojasnilo` varchar(500) DEFAULT NULL,
  `odgovor_delavca` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`iddelavca`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delavci`
--

LOCK TABLES `delavci` WRITE;
/*!40000 ALTER TABLE `delavci` DISABLE KEYS */;
INSERT INTO `delavci` VALUES (100,'esperswap@gmail.com','$2b$05$Ou8v1NWwgVcg5Jq7iH6Xt.kauBP0lHRLxCl8KVZs3fUCoSsoRdFNu','Nekdo','Žužek','4063',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(108,'gla.nojaf@gmail.com','$2b$05$bWJ2LbxRiftXXZDzSVKKhu3ZOtbumMOgW/x1X4tJ1rJ421t9nsBUy','Gal','Fajon','3755',1,NULL,NULL,NULL,NULL,NULL,NULL),(116,'danijeldragojevic@gmail.com','$2b$05$kvhAoAfwZ5VxnYVkIbTv2eb3yQGOvgpae92BNFSuWmvaQ2tbeU.GW','Daniel','Dragojevič','8045',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(117,'nekmail@gmail.com','$2b$05$2cMD.T.6IbKpX79MqKy.ZucJ8Bv/5i/5.gfZaVWhFmxT2Be8GSAna','Matic','Podpadec','7114',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(118,'nek.delavec@gmail.com','$2b$05$56TKqmXiejoJTercfUg6ZOCMBDRCeTnOzlS8JpTsz5rfV/k8CkNp2','Nek','Delavec','5611',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(119,'marko.zuzek@gmail.com','$2b$05$zhr/KF.jZ1d4rx68Z1mq8OH7hXRBgMczSK9whWKCIS5uJniPbzNAK','Marko','Žužek','8157',NULL,NULL,NULL,'Sem lep in priden fant.',NULL,NULL,NULL),(120,'z.mihec@gmail.com','$2b$05$ESRBtOzgSJ1ifsQUj06V7.bwBEzusdAGNi5HmQ4IJVGWzv5y/Rdd.','Ian','Zobec','2075',1,NULL,NULL,'<>',1,'asdfawefwaewefwef','Asdfsdfds');
/*!40000 ALTER TABLE `delavci` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delavci_eposta_blacklist`
--

DROP TABLE IF EXISTS `delavci_eposta_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delavci_eposta_blacklist` (
  `idnaslova` int NOT NULL AUTO_INCREMENT,
  `eposta` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`idnaslova`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delavci_eposta_blacklist`
--

LOCK TABLES `delavci_eposta_blacklist` WRITE;
/*!40000 ALTER TABLE `delavci_eposta_blacklist` DISABLE KEYS */;
INSERT INTO `delavci_eposta_blacklist` VALUES (1,'marko.marko@marko.marko'),(2,'gal.fajon@gmail.com'),(3,'freelanceslopotrditev@gmail.com');
/*!40000 ALTER TABLE `delavci_eposta_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delavci_has_jezik`
--

DROP TABLE IF EXISTS `delavci_has_jezik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delavci_has_jezik` (
  `iddelavca` int NOT NULL,
  `idjezika` int NOT NULL,
  KEY `delavci_has_jezik_ibfk_1` (`iddelavca`),
  KEY `delavci_has_jezik_ibfk_2` (`idjezika`),
  CONSTRAINT `delavci_has_jezik_ibfk_1` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `delavci_has_jezik_ibfk_2` FOREIGN KEY (`idjezika`) REFERENCES `jeziki` (`idjezika`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delavci_has_jezik`
--

LOCK TABLES `delavci_has_jezik` WRITE;
/*!40000 ALTER TABLE `delavci_has_jezik` DISABLE KEYS */;
INSERT INTO `delavci_has_jezik` VALUES (100,1),(108,1),(100,0),(108,0),(117,0),(117,1),(119,0),(119,1),(120,1),(120,0);
/*!40000 ALTER TABLE `delavci_has_jezik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delavci_has_spretnosti`
--

DROP TABLE IF EXISTS `delavci_has_spretnosti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delavci_has_spretnosti` (
  `iddelavca` int NOT NULL,
  `idspretnosti` int NOT NULL,
  KEY `delavci_has_spretnosti_ibfk_1` (`iddelavca`),
  KEY `delavci_has_spretnosti_ibfk_2` (`idspretnosti`),
  CONSTRAINT `delavci_has_spretnosti_ibfk_1` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `delavci_has_spretnosti_ibfk_2` FOREIGN KEY (`idspretnosti`) REFERENCES `spretnosti` (`idspretnosti`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delavci_has_spretnosti`
--

LOCK TABLES `delavci_has_spretnosti` WRITE;
/*!40000 ALTER TABLE `delavci_has_spretnosti` DISABLE KEYS */;
INSERT INTO `delavci_has_spretnosti` VALUES (100,0),(108,0),(108,4),(117,10),(119,0),(119,4),(119,5),(119,10),(120,5),(120,0),(120,4);
/*!40000 ALTER TABLE `delavci_has_spretnosti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delavci_opozorila`
--

DROP TABLE IF EXISTS `delavci_opozorila`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delavci_opozorila` (
  `iddelavca` int NOT NULL,
  `besedilo_prijave` varchar(500) NOT NULL,
  `idpodjetja` int NOT NULL,
  KEY `iddelavca_idx` (`iddelavca`),
  KEY `delavci_opozorila_ibfk_1` (`idpodjetja`),
  CONSTRAINT `delavci_opozorila_ibfk_1` FOREIGN KEY (`idpodjetja`) REFERENCES `podjetje` (`idpodjetja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `delavci_opozorila_ibfk_2` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delavci_opozorila`
--

LOCK TABLES `delavci_opozorila` WRITE;
/*!40000 ALTER TABLE `delavci_opozorila` DISABLE KEYS */;
INSERT INTO `delavci_opozorila` VALUES (120,'poafwiefopew',16);
/*!40000 ALTER TABLE `delavci_opozorila` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delovneizkusnje`
--

DROP TABLE IF EXISTS `delovneizkusnje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delovneizkusnje` (
  `iddelovneizkusnje` int NOT NULL AUTO_INCREMENT,
  `iddelavca` int NOT NULL,
  `nazivpodjetja` varchar(40) NOT NULL,
  `imemesta` varchar(40) NOT NULL,
  `datumzacetka` date NOT NULL,
  `datumkonca` date NOT NULL,
  `opisdela` varchar(500) NOT NULL,
  PRIMARY KEY (`iddelovneizkusnje`),
  UNIQUE KEY `iddelovneizkusnje` (`iddelovneizkusnje`),
  KEY `delovneizkusnje_ibfk_1` (`iddelavca`),
  CONSTRAINT `delovneizkusnje_ibfk_1` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delovneizkusnje`
--

LOCK TABLES `delovneizkusnje` WRITE;
/*!40000 ALTER TABLE `delovneizkusnje` DISABLE KEYS */;
INSERT INTO `delovneizkusnje` VALUES (63,100,'ASDF','ADSF','2021-01-13','2021-01-16','SSDFG'),(141,119,'Podjetjeime','Strokovnjak','2021-03-02','2021-03-04','Delu sm neki.');
/*!40000 ALTER TABLE `delovneizkusnje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delovnik`
--

DROP TABLE IF EXISTS `delovnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delovnik` (
  `iddelovnika` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`iddelovnika`),
  UNIQUE KEY `iddelovnika` (`iddelovnika`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delovnik`
--

LOCK TABLES `delovnik` WRITE;
/*!40000 ALTER TABLE `delovnik` DISABLE KEYS */;
INSERT INTO `delovnik` VALUES (1,'Po dogovoru'),(2,'Popoldne'),(3,'Dopoldne'),(4,'Izmensko');
/*!40000 ALTER TABLE `delovnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `izobrazba`
--

DROP TABLE IF EXISTS `izobrazba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `izobrazba` (
  `idizobrazbe` int NOT NULL AUTO_INCREMENT,
  `iddelavca` int NOT NULL,
  `naziv` varchar(50) NOT NULL,
  `ustanova` varchar(100) NOT NULL,
  `idnivoja` int NOT NULL,
  `datumzacetka` date NOT NULL,
  `datumkonca` date NOT NULL,
  `opis` varchar(500) DEFAULT NULL,
  `izobrazbacol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idizobrazbe`),
  UNIQUE KEY `idizobrazbe` (`idizobrazbe`),
  KEY `izobrazba_ibfk_2` (`idnivoja`),
  KEY `izobrazba_ibfk_1` (`iddelavca`),
  CONSTRAINT `izobrazba_ibfk_1` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `izobrazba_ibfk_2` FOREIGN KEY (`idnivoja`) REFERENCES `nivojiizobrazbe` (`idnivoja`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `izobrazba`
--

LOCK TABLES `izobrazba` WRITE;
/*!40000 ALTER TABLE `izobrazba` DISABLE KEYS */;
INSERT INTO `izobrazba` VALUES (262,100,'Nižji poklic','Inštitut nižjih poklicov',0,'2021-01-14','2021-01-16','Nekaj...',NULL),(343,117,'asd','asd',0,'2021-03-01','2021-03-03','Asdf.',NULL),(344,119,'Tehnik Računalništva','Vegova',2,'2021-03-01','2021-03-03','Neki sm se pa nauču :).',NULL);
/*!40000 ALTER TABLE `izobrazba` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jeziki`
--

DROP TABLE IF EXISTS `jeziki`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeziki` (
  `idjezika` int NOT NULL,
  `naziv` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idjezika`),
  UNIQUE KEY `idjezika` (`idjezika`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jeziki`
--

LOCK TABLES `jeziki` WRITE;
/*!40000 ALTER TABLE `jeziki` DISABLE KEYS */;
INSERT INTO `jeziki` VALUES (0,'Slovenščina'),(1,'Angleščina'),(2,'Hrvaščina'),(3,'Italijanščina'),(4,'Nemščina'),(5,'Madžarščina');
/*!40000 ALTER TABLE `jeziki` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivojiizobrazbe`
--

DROP TABLE IF EXISTS `nivojiizobrazbe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivojiizobrazbe` (
  `idnivoja` int NOT NULL,
  `naziv` varchar(100) NOT NULL,
  PRIMARY KEY (`idnivoja`),
  UNIQUE KEY `idnivoja` (`idnivoja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivojiizobrazbe`
--

LOCK TABLES `nivojiizobrazbe` WRITE;
/*!40000 ALTER TABLE `nivojiizobrazbe` DISABLE KEYS */;
INSERT INTO `nivojiizobrazbe` VALUES (0,'Nižje poklicno izobraževanje (2 leti)'),(1,'Srednje poklicno izobraževanje (3 leta)'),(2,'Gimnazijsko oz. strokovno izobraževanje'),(3,'Višješolski strokovni program'),(4,'Specializacija višješolskega ali visokošolski program'),(5,'Specializacija visokošolskega ali univerzitetni program'),(6,'Specializacija po univerzitetnem programu, magisterij znanosti'),(7,'Doktorat znanosti');
/*!40000 ALTER TABLE `nivojiizobrazbe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `podjetja_eposta_blacklist`
--

DROP TABLE IF EXISTS `podjetja_eposta_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `podjetja_eposta_blacklist` (
  `idnaslova` int NOT NULL AUTO_INCREMENT,
  `naslov` varchar(50) DEFAULT NULL,
  UNIQUE KEY `idnaslova` (`idnaslova`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `podjetja_eposta_blacklist`
--

LOCK TABLES `podjetja_eposta_blacklist` WRITE;
/*!40000 ALTER TABLE `podjetja_eposta_blacklist` DISABLE KEYS */;
INSERT INTO `podjetja_eposta_blacklist` VALUES (1,'esperswap@gmail.com'),(2,'gla.nojaf@gmail.com'),(3,'nek.mail@nekmail.si');
/*!40000 ALTER TABLE `podjetja_eposta_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `podjetja_opozorila`
--

DROP TABLE IF EXISTS `podjetja_opozorila`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `podjetja_opozorila` (
  `idpodjetja` int NOT NULL,
  `besedilo_prijave` varchar(500) NOT NULL,
  `iddelavca` int NOT NULL,
  UNIQUE KEY `up` (`idpodjetja`,`iddelavca`),
  KEY `idpodjetja_idx` (`idpodjetja`),
  KEY `podjetja_opozorila_ibfk_1` (`iddelavca`),
  CONSTRAINT `idpodjetja` FOREIGN KEY (`idpodjetja`) REFERENCES `podjetje` (`idpodjetja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `podjetja_opozorila_ibfk_1` FOREIGN KEY (`iddelavca`) REFERENCES `delavci` (`iddelavca`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `podjetja_opozorila`
--

LOCK TABLES `podjetja_opozorila` WRITE;
/*!40000 ALTER TABLE `podjetja_opozorila` DISABLE KEYS */;
INSERT INTO `podjetja_opozorila` VALUES (16,'awefiwiaopifopwief',120);
/*!40000 ALTER TABLE `podjetja_opozorila` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `podjetje`
--

DROP TABLE IF EXISTS `podjetje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `podjetje` (
  `idpodjetja` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(50) NOT NULL,
  `idvrste` int NOT NULL,
  `naslov` varchar(50) DEFAULT NULL,
  `eposta` varchar(50) NOT NULL,
  `telefonska` varchar(15) DEFAULT NULL,
  `velikost` int DEFAULT NULL,
  `datum_ustanovitve` date DEFAULT NULL,
  `podrocje` int DEFAULT NULL,
  `geslo` varchar(75) NOT NULL,
  `potrditvenakoda` varchar(4) DEFAULT NULL,
  `epostapotrjena` tinyint(1) DEFAULT NULL,
  `opozorjen` tinyint(1) DEFAULT NULL,
  `odgovor_podjetja` varchar(500) DEFAULT NULL,
  `admin_pojasnilo` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idpodjetja`),
  UNIQUE KEY `idpodjetja` (`idpodjetja`),
  KEY `podjetje_ibfk_1` (`idvrste`),
  KEY `podrocje_idx` (`podrocje`),
  KEY `velikost_idx` (`velikost`),
  CONSTRAINT `podjetje_ibfk_1` FOREIGN KEY (`idvrste`) REFERENCES `vrstepodjetji` (`idvrste`),
  CONSTRAINT `podrocje` FOREIGN KEY (`podrocje`) REFERENCES `podrocjapodjetji` (`idpodrocja`),
  CONSTRAINT `velikost` FOREIGN KEY (`velikost`) REFERENCES `velikostipodjetji` (`idvelikosti`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `podjetje`
--

LOCK TABLES `podjetje` WRITE;
/*!40000 ALTER TABLE `podjetje` DISABLE KEYS */;
INSERT INTO `podjetje` VALUES (15,'Podjetje',6,NULL,'nek.mail2@gmail.com',NULL,NULL,NULL,NULL,'$2b$05$moqbYEX5ADnRNNuIQRDKC.2WpmBCKJciX5fYHTjDM3jHfFz.LIYpG','8070',NULL,NULL,NULL,NULL),(16,'Podjetje',6,NULL,'podjetje.podjetje@gmail.com',NULL,NULL,NULL,NULL,'$2b$05$KBy/8bQRrhgs/HbB0rXQYOVmvtKyeBRqfNilGUiGNC4gf6XFHtFcG','6289',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `podjetje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `podrocjapodjetji`
--

DROP TABLE IF EXISTS `podrocjapodjetji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `podrocjapodjetji` (
  `idpodrocja` int NOT NULL AUTO_INCREMENT,
  `imepodrocja` varchar(30) NOT NULL,
  PRIMARY KEY (`idpodrocja`),
  UNIQUE KEY `imepodrocja_UNIQUE` (`imepodrocja`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `podrocjapodjetji`
--

LOCK TABLES `podrocjapodjetji` WRITE;
/*!40000 ALTER TABLE `podrocjapodjetji` DISABLE KEYS */;
INSERT INTO `podrocjapodjetji` VALUES (6,'Animacija'),(8,'Arhitektura'),(10,'Avtomobilizem'),(11,'Bankirstvo'),(12,'Biotehnologija'),(18,'Elektronika'),(14,'Gradbeništvo'),(15,'Kemija'),(17,'Kozmetika'),(4,'Letalstvo'),(5,'Medicina'),(13,'Mediji'),(7,'Moda'),(1,'Prepisovanje besedil'),(2,'Programiranje'),(3,'Računovodstvo'),(19,'Šolstvo'),(9,'Umetniško ustvarjanje'),(16,'Videoigre');
/*!40000 ALTER TABLE `podrocjapodjetji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spretnosti`
--

DROP TABLE IF EXISTS `spretnosti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spretnosti` (
  `idspretnosti` int NOT NULL,
  `naziv` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`idspretnosti`),
  UNIQUE KEY `idspretnosti` (`idspretnosti`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spretnosti`
--

LOCK TABLES `spretnosti` WRITE;
/*!40000 ALTER TABLE `spretnosti` DISABLE KEYS */;
INSERT INTO `spretnosti` VALUES (0,'SQL'),(4,'SQLite'),(5,'JavaScript'),(6,'HTML'),(7,'CSS'),(8,'Spletna varnost'),(9,'Machine learning'),(10,'Preizkušanje aplikacij'),(11,'UX'),(12,'UI'),(13,'Strukture podatkov'),(14,'Delo v oblaku'),(15,'STEM'),(16,'CAD'),(17,'SolidWorks'),(18,'Grafično oblikovanje'),(19,'Oglaševanje'),(20,'Vnos podatkov'),(21,'MS Office');
/*!40000 ALTER TABLE `spretnosti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trajanje`
--

DROP TABLE IF EXISTS `trajanje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trajanje` (
  `idtrajanja` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`idtrajanja`),
  UNIQUE KEY `idtrajanja` (`idtrajanja`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trajanje`
--

LOCK TABLES `trajanje` WRITE;
/*!40000 ALTER TABLE `trajanje` DISABLE KEYS */;
INSERT INTO `trajanje` VALUES (1,'Enkratno'),(2,'Začasno/Občasno'),(3,'Dlje časa');
/*!40000 ALTER TABLE `trajanje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `velikostipodjetji`
--

DROP TABLE IF EXISTS `velikostipodjetji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `velikostipodjetji` (
  `idvelikosti` int NOT NULL AUTO_INCREMENT,
  `velikost` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idvelikosti`),
  UNIQUE KEY `idvelikosti` (`idvelikosti`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `velikostipodjetji`
--

LOCK TABLES `velikostipodjetji` WRITE;
/*!40000 ALTER TABLE `velikostipodjetji` DISABLE KEYS */;
INSERT INTO `velikostipodjetji` VALUES (1,'0-20'),(2,'20-100'),(3,'100-500'),(4,'500-1000'),(5,'1000+');
/*!40000 ALTER TABLE `velikostipodjetji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vrste_plac`
--

DROP TABLE IF EXISTS `vrste_plac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrste_plac` (
  `idplace` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`idplace`),
  UNIQUE KEY `idplace` (`idplace`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vrste_plac`
--

LOCK TABLES `vrste_plac` WRITE;
/*!40000 ALTER TABLE `vrste_plac` DISABLE KEYS */;
INSERT INTO `vrste_plac` VALUES (1,'Na uro'),(2,'Enkratna');
/*!40000 ALTER TABLE `vrste_plac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vrstepodjetji`
--

DROP TABLE IF EXISTS `vrstepodjetji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrstepodjetji` (
  `idvrste` int NOT NULL AUTO_INCREMENT,
  `ime` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`idvrste`),
  UNIQUE KEY `idvrste` (`idvrste`),
  UNIQUE KEY `ime` (`ime`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vrstepodjetji`
--

LOCK TABLES `vrstepodjetji` WRITE;
/*!40000 ALTER TABLE `vrstepodjetji` DISABLE KEYS */;
INSERT INTO `vrstepodjetji` VALUES (6,'d.d.'),(7,'d.n.o.'),(4,'d.o.o.'),(9,'fiz.os'),(8,'k.d.'),(5,'s.p.');
/*!40000 ALTER TABLE `vrstepodjetji` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-08 19:54:10
