-- AlterTable: добавить значение факультета lox (совпадает с enum School в schema.prisma)
ALTER TABLE `users` MODIFY COLUMN `school` ENUM('VSP', 'MShZh', 'lox') NULL;
