-- Re-map category colors from the old neon theme to the site palette
UPDATE categories SET color = '#f28123' WHERE color = '#ff00ff';
UPDATE categories SET color = '#38726c' WHERE color = '#00ffff';
UPDATE categories SET color = '#f7f052' WHERE color = '#ffff00';
UPDATE categories SET color = '#563f1b' WHERE color = '#00ff00';
UPDATE categories SET color = '#d34e24' WHERE color = '#ff8800';
UPDATE categories SET color = '#a4c3a2' WHERE color = '#ff0066';
