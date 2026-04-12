-- Новые факультеты: ISE, SLA, ISJ, MLS (старые VSP / MShZh / lox снимаем)
UPDATE `users` SET `school` = NULL WHERE `school` IN ('VSP', 'MShZh', 'lox');

ALTER TABLE `users` MODIFY COLUMN `school` ENUM('ISE', 'SLA', 'ISJ', 'MLS') NULL;
