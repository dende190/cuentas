CREATE TABLE bill_monthly (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bill_id` INT(10) UNSIGNED NOT NULL,
  `amount` INT(2) UNSIGNED NOT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY(bill_id) REFERENCES bill(id)
);

CREATE TABLE monthly_spent (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bill_monthly_id` INT(10) UNSIGNED NOT NULL,
  `status` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,
  `spent_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY(bill_monthly_id) REFERENCES bill_monthly(id)
);
