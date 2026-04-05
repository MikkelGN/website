CREATE TABLE tetris_scores (
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT NOT NULL REFERENCES app_users(id),
    score     INT    NOT NULL,
    level     INT    NOT NULL DEFAULT 1,
    lines     INT    NOT NULL DEFAULT 0,
    played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tetris_scores_user ON tetris_scores(user_id);
