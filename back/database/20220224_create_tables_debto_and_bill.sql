CREATE TABLE debtor (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO debtor(id, name) VALUES (1, 'yo');

CREATE TABLE payment_type (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO payment_type(id, name) VALUES
(1, 'cash'),
(2, 'debit card'),
(3, 'credit card'),
(4, 'nequi');

CREATE TABLE bill (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `payment` INT(7) UNSIGNED NOT NULL DEFAULT 0,
  `payment_type_id` INT(1) UNSIGNED NOT NULL DEFAULT 1,
  `is_payment_equal` TINYINT(1) NOT NULL DEFAULT 1,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (payment_type_id) REFERENCES payment_type(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bill_debtor (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bill_id` INT(10) UNSIGNED NOT NULL,
  `debtor_id` INT(10) UNSIGNED NOT NULL,
  `expense` INT(7) UNSIGNED NOT NULL DEFAULT 0,
  `paid` TINYINT(1) NOT NULL DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (bill_id) REFERENCES bill(id),
  FOREIGN KEY (debtor_id) REFERENCES debtor(id)
);
