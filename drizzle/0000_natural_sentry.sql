CREATE TABLE `auths` (
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`profilePublicId` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`profilePicture` varchar(255) NOT NULL,
	`emailVerificationToken` varchar(255) NOT NULL,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`browserName` varchar(255) NOT NULL,
	`deviceType` varchar(255) NOT NULL,
	`otp` varchar(255),
	`otpExpiration` date,
	`createdAt` timestamp DEFAULT (now()),
	`passwordResetToken` varchar(255),
	`passwordResetExpires` timestamp NOT NULL
);
