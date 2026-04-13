-- Длинные ответы FAQ и описания организаций; логотип как data URL в БД (Vercel без диска)
ALTER TABLE `faqs` MODIFY COLUMN `question` VARCHAR(500) NOT NULL;
ALTER TABLE `faqs` MODIFY COLUMN `answer` LONGTEXT NOT NULL;

ALTER TABLE `organizations` MODIFY COLUMN `name` VARCHAR(200) NOT NULL;
ALTER TABLE `organizations` MODIFY COLUMN `description` LONGTEXT NOT NULL;
ALTER TABLE `organizations` MODIFY COLUMN `icon` VARCHAR(32) NULL;
ALTER TABLE `organizations` MODIFY COLUMN `logoUrl` LONGTEXT NULL;
