SELECT * FROM users;

-- Buscar
SELECT * FROM users WHERE id = 'ee28efd4-e00e-4830-b54c-78b34079edd3';

-- Actualizar
UPDATE users SET role = 'admin' WHERE id = 'ee28efd4-e00e-4830-b54c-78b34079edd3' RETURNING *;

SELECT * FROM products;