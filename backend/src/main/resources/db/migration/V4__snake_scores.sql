CREATE TABLE snake_scores (
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT NOT NULL REFERENCES app_users(id),
    score     INT    NOT NULL,
    played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snake_scores_user ON snake_scores(user_id);
