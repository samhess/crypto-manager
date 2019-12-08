CREATE SCHEMA crypto;
use crypto;

CREATE TABLE `coin` (
  `coinId` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `slug` varchar(45) DEFAULT NULL,
  `cmc_rank` int(11) DEFAULT NULL,
  `price` varchar(45) DEFAULT NULL,
  `volume24h` varchar(45) DEFAULT NULL,
  `percent_change_1h` decimal(10,2) DEFAULT NULL,
  `percent_change_24h` decimal(10,2) DEFAULT NULL,
  `percent_change_7d` decimal(10,2) DEFAULT NULL,
  `market_cap` decimal(20,2) DEFAULT NULL,
  PRIMARY KEY (`coinId`)
)

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `password` varchar(255) DEFAULT NULL,
  `registered` datetime DEFAULT NULL,
  `lastlogin` datetime DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `fullname` varchar(91) GENERATED ALWAYS AS (concat(`firstname`,_utf8mb4' ',`lastname`)) VIRTUAL,
  PRIMARY KEY (`userId`)
)

CREATE TABLE `portfolio` (
  `positionId` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `coinId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`positionId`),
  KEY `coin_idx` (`coinId`),
  KEY `user` (`userId`),
  CONSTRAINT `coin` FOREIGN KEY (`coinId`) REFERENCES `coin` (`coinId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT
)

CREATE VIEW portfolio AS
  Select *,
    amount * price as value
  FROM portfolio
    JOIN coin USING (coinId);