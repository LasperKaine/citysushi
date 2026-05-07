USE citysushi;

ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_pokebowl BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS pokebowl_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category ENUM('base', 'protein', 'topping', 'sauce', 'extra') NOT NULL,
  price DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  allergen_info TEXT,
  available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS order_item_pokebowl_ingredients (
  order_item_id INT NOT NULL,
  pokebowl_ingredient_id INT NOT NULL,
  price_snapshot DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (order_item_id, pokebowl_ingredient_id),
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (pokebowl_ingredient_id) REFERENCES pokebowl_ingredients(id)
);
