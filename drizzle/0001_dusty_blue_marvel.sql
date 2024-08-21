ALTER TABLE `auths` ADD CONSTRAINT `emailIndex` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `auths` ADD CONSTRAINT `userNameIndex` UNIQUE(`username`);--> statement-breakpoint
ALTER TABLE `auths` ADD CONSTRAINT `emailVerificationTokenIndex` UNIQUE(`emailVerificationToken`);