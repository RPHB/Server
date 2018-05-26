-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le :  sam. 26 mai 2018 à 13:50
-- Version du serveur :  5.6.35
-- Version de PHP :  7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `ps`
--

-- --------------------------------------------------------

--
-- Structure de la table `bets`
--

CREATE TABLE `bets` (
  `id` int(11) NOT NULL,
  `idMatch` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `tokens` int(11) NOT NULL,
  `choice` int(11) NOT NULL,
  `date` date NOT NULL,
  `isPayed` int(11) NOT NULL,
  `sport` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `bets`
--

INSERT INTO `bets` (`id`, `idMatch`, `idUser`, `tokens`, `choice`, `date`, `isPayed`, `sport`) VALUES
(1, 2, 2, 120, 0, '2018-05-22', 0, 0),
(2, 3, 2, 110, 1, '2018-05-25', 0, 1),
(3, 4, 2, 50, 3, '2018-05-20', 0, 0),
(4, 6, 2, 10, 2, '2018-05-25', 0, 3);

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `matchs`
--

CREATE TABLE `matchs` (
  `id` int(11) NOT NULL,
  `idTeam1` int(11) NOT NULL,
  `idTeam2` int(11) NOT NULL,
  `date` date NOT NULL,
  `quotation1` double NOT NULL,
  `quotation2` double NOT NULL,
  `quotation3` double NOT NULL,
  `score` varchar(250) NOT NULL,
  `result` int(11) NOT NULL,
  `sport` int(11) NOT NULL,
  `idEvent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `matchs`
--

INSERT INTO `matchs` (`id`, `idTeam1`, `idTeam2`, `date`, `quotation1`, `quotation2`, `quotation3`, `score`, `result`, `sport`, `idEvent`) VALUES
(2, 1, 2, '2018-05-26', 1.1, 1.2, 2.1, '-', 0, 0, 0),
(3, 7, 4, '2018-05-28', 3.1, 2, 1.3, '-', 0, 1, 2),
(4, 2, 1, '2018-05-31', 1.2, 1.9, 2.4, '-', 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `sport` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `teams`
--

INSERT INTO `teams` (`id`, `name`, `sport`) VALUES
(1, 'Paris-Saint-Germain', 0),
(2, 'Lyon', 0),
(3, 'Marseille', 0),
(4, 'Barcelone', 0);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pwd` varchar(32) NOT NULL,
  `email` varchar(200) NOT NULL,
  `admin` int(11) NOT NULL,
  `tokens` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `pwd`, `email`, `admin`, `tokens`) VALUES
(2, 'Jean', '8cb4f88ffd80dac9c59859dcea8e2ae4', 'Jean@gmail.com', 1, 0),
(3, 'Xenodeux', 'ed735d55415bee976b771989be8f7005', 'Bastien@gmail.com', 0, 500),
(5, 'Cromade', 'ed735d55415bee976b771989be8f7005', 'Dylan@gmail.com', 0, 500);

-- --------------------------------------------------------

--
-- Structure de la table `user_friends`
--

CREATE TABLE `user_friends` (
  `asking_friend` varchar(16) NOT NULL,
  `asked_friend` varchar(16) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `denied` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `matchs`
--
ALTER TABLE `matchs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_friends`
--
ALTER TABLE `user_friends`
  ADD UNIQUE KEY `asking_friend` (`asking_friend`,`asked_friend`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bets`
--
ALTER TABLE `bets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `matchs`
--
ALTER TABLE `matchs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
