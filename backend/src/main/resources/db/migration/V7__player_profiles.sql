-- Reset old honor-system data: profiles are recreated via the admin panel
TRUNCATE game_answers, game_sessions, snake_scores, tetris_scores, app_users RESTART IDENTITY CASCADE;

-- app_users -> players with avatar + PIN
ALTER TABLE app_users RENAME TO players;
ALTER TABLE players RENAME COLUMN username TO display_name;
ALTER TABLE players ADD COLUMN avatar_key VARCHAR(50) NOT NULL DEFAULT 'star';
ALTER TABLE players ADD COLUMN pin_hash VARCHAR(100) NOT NULL DEFAULT '';

-- Allow deleting a profile together with its scores
ALTER TABLE game_sessions DROP CONSTRAINT game_sessions_user_id_fkey;
ALTER TABLE game_sessions ADD CONSTRAINT game_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES players (id) ON DELETE CASCADE;
ALTER TABLE snake_scores DROP CONSTRAINT snake_scores_user_id_fkey;
ALTER TABLE snake_scores ADD CONSTRAINT snake_scores_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES players (id) ON DELETE CASCADE;
ALTER TABLE tetris_scores DROP CONSTRAINT tetris_scores_user_id_fkey;
ALTER TABLE tetris_scores ADD CONSTRAINT tetris_scores_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES players (id) ON DELETE CASCADE;

-- Starter profiles (PIN 1234) so the picker is usable before real profiles exist
INSERT INTO players (display_name, avatar_key, pin_hash) VALUES
    ('Gæst', 'star',  '$2a$10$1R8m7OTXKYokOQuFNLb.WeAWBpUJpGcve/zjAWQT0nPHYmApjJ/yK'),
    ('Demo', 'robot', '$2a$10$1R8m7OTXKYokOQuFNLb.WeAWBpUJpGcve/zjAWQT0nPHYmApjJ/yK');
