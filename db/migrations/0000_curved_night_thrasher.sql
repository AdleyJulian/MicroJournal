CREATE TABLE `entry_tags` (
	`entry_id` integer,
	`tag_id` integer,
	FOREIGN KEY (`entry_id`) REFERENCES `journal_cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entry_tags_entry_id_tag_id_unique` ON `entry_tags` (`entry_id`,`tag_id`);--> statement-breakpoint
CREATE TABLE `journal_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`due` integer NOT NULL,
	`stability` real NOT NULL,
	`difficulty` real NOT NULL,
	`elapsed_days` integer NOT NULL,
	`scheduled_days` integer NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`state` text NOT NULL,
	`prompt_question` text,
	`answer` text,
	`jsonData` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `media_attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entry_id` integer,
	`file_path` text NOT NULL,
	`type` text,
	`caption` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`entry_id`) REFERENCES `journal_cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);