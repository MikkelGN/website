CREATE TABLE vocabulary_word (
    id       SERIAL       PRIMARY KEY,
    russian  TEXT         NOT NULL,
    danish   TEXT         NOT NULL,
    category VARCHAR(50)  NOT NULL
);

INSERT INTO vocabulary_word (russian, danish, category) VALUES
    -- Colors
    ('красный', 'rød',     'colors'),
    ('синий',   'blå',     'colors'),
    ('зелёный', 'grøn',    'colors'),
    ('жёлтый',  'gul',     'colors'),
    ('белый',   'hvid',    'colors'),
    ('чёрный',  'sort',    'colors'),
    -- Greetings
    ('привет',  'hej',     'greetings'),
    ('пока',    'hej hej', 'greetings'),
    ('спасибо', 'tak',     'greetings'),
    -- Objects
    ('машина',  'bil',     'objects'),
    ('дом',     'hus',     'objects'),
    ('кот',     'kat',     'objects'),
    ('собака',  'hund',    'objects'),
    ('мяч',     'bold',    'objects');
