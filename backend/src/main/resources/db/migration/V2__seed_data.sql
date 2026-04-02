-- Seed categories
INSERT INTO categories (name_da, name_en, color) VALUES
    ('Navneord',   'Noun',        '#ff00ff'),
    ('Udsagnsord', 'Verb',        '#00ffff'),
    ('Tillægsord', 'Adjective',   '#ffff00'),
    ('Biord',      'Adverb',      '#00ff00'),
    ('Stedord',    'Pronoun',     '#ff8800'),
    ('Forholdsord','Preposition', '#ff0066');

-- Seed words - Nouns
INSERT INTO words (text, category_id) VALUES
    ('hund',       1), ('kat',        1), ('hus',        1),
    ('bil',        1), ('træ',        1), ('bog',        1),
    ('skole',      1), ('dreng',      1), ('pige',       1),
    ('fugl',       1), ('sol',        1), ('måne',       1),
    ('vand',       1), ('mad',        1), ('dag',        1),
    ('nat',        1), ('år',         1), ('tid',        1),
    ('ven',        1), ('familie',    1), ('barn',       1),
    ('mand',       1), ('kvinde',     1), ('land',       1),
    ('by',         1), ('gade',       1), ('hjem',       1),
    ('dør',        1), ('vindue',     1), ('bord',       1);

-- Seed words - Verbs
INSERT INTO words (text, category_id) VALUES
    ('løbe',       2), ('hoppe',      2), ('spise',      2),
    ('drikke',     2), ('sove',       2), ('lege',       2),
    ('læse',       2), ('skrive',     2), ('tale',       2),
    ('se',         2), ('høre',       2), ('tænke',      2),
    ('gå',         2), ('komme',      2), ('give',       2),
    ('tage',       2), ('have',       2), ('være',       2),
    ('gøre',       2), ('sige',       2), ('vide',       2),
    ('synes',      2), ('stå',        2), ('sidde',      2),
    ('ligge',      2), ('kende',      2), ('lære',       2),
    ('hjælpe',     2), ('elske',      2), ('ønske',      2);

-- Seed words - Adjectives
INSERT INTO words (text, category_id) VALUES
    ('stor',       3), ('lille',      3), ('god',        3),
    ('dårlig',     3), ('ny',         3), ('gammel',     3),
    ('hurtig',     3), ('langsom',    3), ('høj',        3),
    ('lav',        3), ('smuk',       3), ('grim',       3),
    ('varm',       3), ('kold',       3), ('tung',       3),
    ('let',        3), ('stærk',      3), ('svag',       3),
    ('glad',       3), ('ked',        3), ('sjov',       3),
    ('klog',       3), ('dum',        3), ('ung',        3),
    ('fed',        3), ('tynd',       3), ('bred',       3),
    ('smal',       3), ('lang',       3), ('kort',       3);

-- Seed words - Adverbs
INSERT INTO words (text, category_id) VALUES
    ('hurtigt',    4), ('langsomt',   4), ('godt',       4),
    ('dårligt',    4), ('altid',      4), ('aldrig',     4),
    ('ofte',       4), ('sjældent',   4), ('her',        4),
    ('der',        4), ('nu',         4), ('snart',      4),
    ('meget',      4), ('lidt',       4), ('nok',        4),
    ('kun',        4), ('også',       4), ('ikke',       4),
    ('allerede',   4), ('stadig',     4), ('igen',       4),
    ('måske',      4), ('faktisk',    4), ('virkelig',   4),
    ('bare',       4), ('jo',         4), ('dog',        4),
    ('vel',        4), ('vist',       4), ('nok',        4);

-- Seed words - Pronouns
INSERT INTO words (text, category_id) VALUES
    ('jeg',        5), ('du',         5), ('han',        5),
    ('hun',        5), ('det',        5), ('vi',         5),
    ('I',          5), ('de',         5), ('mig',        5),
    ('dig',        5), ('ham',        5), ('hende',      5),
    ('os',         5), ('jer',        5), ('dem',        5),
    ('min',        5), ('din',        5), ('sin',        5),
    ('vores',      5), ('jeres',      5), ('deres',      5),
    ('denne',      5), ('dette',      5), ('disse',      5),
    ('den',        5), ('hvem',       5), ('hvad',       5),
    ('hvilken',    5), ('nogen',      5), ('ingen',      5);

-- Seed words - Prepositions
INSERT INTO words (text, category_id) VALUES
    ('i',          6), ('på',         6), ('af',         6),
    ('til',        6), ('fra',        6), ('med',        6),
    ('for',        6), ('om',         6), ('over',       6),
    ('under',      6), ('ved',        6), ('bag',        6),
    ('foran',      6), ('efter',      6), ('siden',      6),
    ('gennem',     6), ('langs',      6), ('uden',       6),
    ('inden',      6), ('mellem',     6), ('mod',        6),
    ('hos',        6), ('indtil',     6), ('pr.',        6),
    ('ad',         6), ('trods',      6), ('angående',   6),
    ('vedrørende', 6), ('ifølge',     6), ('undtagen',   6);
