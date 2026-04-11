-- Fix drift: bring DB in sync with current Prisma schema without reset.
-- 1) Extend NotificationType enum values used by `notifications`.`type`
-- 2) Add ADMIN role to `users`.`role`
-- 3) Add `logoUrl` column to `organizations`

ALTER TABLE `notifications`
  MODIFY COLUMN `type` ENUM(
    'NEW_MESSAGE',
    'NEW_REVIEW',
    'NEW_LIKE',
    'NEW_COMMENT',
    'NEW_ORGANIZATION',
    'FAQ_UPDATED',
    'SURVEY_UPDATED'
  ) NOT NULL;

ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT';

ALTER TABLE `organizations`
  ADD COLUMN `logoUrl` VARCHAR(191) NULL;

