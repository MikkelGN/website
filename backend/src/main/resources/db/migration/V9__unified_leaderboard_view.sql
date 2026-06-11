-- One row per played game across all game types, for leaderboards and progress views
CREATE VIEW leaderboard_entries AS
SELECT user_id              AS player_id,
       'word-blitz'         AS game_type,
       total_score          AS score,
       jsonb_build_object('correct', correct_answers, 'streak', max_streak) AS metadata,
       started_at           AS played_at
FROM game_sessions
WHERE completed_at IS NOT NULL
UNION ALL
SELECT user_id, 'math-blitz', score,
       jsonb_build_object('difficulty', difficulty), played_at
FROM math_scores
UNION ALL
SELECT user_id, 'snake', score, '{}'::jsonb, played_at
FROM snake_scores
UNION ALL
SELECT user_id, 'tetris', score,
       jsonb_build_object('level', level, 'lines', lines), played_at
FROM tetris_scores;
