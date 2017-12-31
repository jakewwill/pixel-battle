var bcrypt = require('bcrypt-nodejs');

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('use ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.master_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `content` TEXT NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `email` VARCHAR(40) NOT NULL, \
    `username` VARCHAR(30) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `profile_path` VARCHAR(120), \
    `admin` INT UNSIGNED NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.posts_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `type` TEXT NOT NULL, \
    `username` VARCHAR(20) NOT NULL, \
    `title` TEXT NOT NULL, \
    `description` TEXT NOT NULL, \
    `tags` VARCHAR(60) NOT NULL, \
    `folder_name` VARCHAR(120) NOT NULL, \
    `slug` VARCHAR(120) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `slug_UNIQUE` (`slug` ASC), \
    UNIQUE INDEX `folder_name_UNIQUE` (`folder_name` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.comments_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `post_id` INT UNSIGNED NOT NULL, \
    `parent_comment_id` INT NOT NULL, \
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    `username` VARCHAR(60) NOT NULL, \
    `content` TEXT NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.games_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `title` TEXT NOT NULL, \
    `description` TEXT NOT NULL, \
    `folder_name` VARCHAR(120) NOT NULL, \
    `slug` VARCHAR(120) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `slug_UNIQUE` (`slug` ASC), \
    UNIQUE INDEX `folder_name_UNIQUE` (`folder_name` ASC)\
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.apps_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `title` TEXT NOT NULL, \
    `description` TEXT NOT NULL, \
    `folder_name` VARCHAR(120) NOT NULL, \
    `slug` VARCHAR(120) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `slug_UNIQUE` (`slug` ASC), \
    UNIQUE INDEX `folder_name_UNIQUE` (`folder_name` ASC)\
)');

connection.query("INSERT INTO master (content) values (?)", bcrypt.hashSync("Gbw77a88J", null, null));
connection.query("INSERT INTO master (content) values (?)", "jwill18@punahou.edu");

console.log('Success: Database Created!')

connection.end();
