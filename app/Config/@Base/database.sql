-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 02-Fev-2015 às 00:43
-- Versão do servidor: 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `rpg_maker`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `last_project_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `config_ibfk_1` (`last_project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `map`
--

CREATE TABLE IF NOT EXISTS `map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `display` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `width` int(11) NOT NULL DEFAULT '10',
  `height` int(11) NOT NULL DEFAULT '10',
  `scroll` int(11) DEFAULT '0',
  `bgm` int(11) DEFAULT NULL,
  `expand` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `map_ibfk_1` (`project_id`),
  KEY `map_ibfk_2` (`parent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=177 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `expand` tinyint(1) NOT NULL DEFAULT '0',
  `selected_list` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=91 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `project_resource`
--

CREATE TABLE IF NOT EXISTS `project_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `resource_id` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `resource`
--

CREATE TABLE IF NOT EXISTS `resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` int(11) NOT NULL,
  `visibilit` tinyint(1) DEFAULT '0',
  `type` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(512) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `config`
--
ALTER TABLE `config`
ADD CONSTRAINT `config_ibfk_1` FOREIGN KEY (`last_project_id`) REFERENCES `project` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Limitadores para a tabela `map`
--
ALTER TABLE `map`
ADD CONSTRAINT `map_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `map_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `map` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `project_resource`
--
ALTER TABLE `project_resource`
ADD CONSTRAINT `project_resource_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
ADD CONSTRAINT `project_resource_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`);
