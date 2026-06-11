CREATE TABLE math_scores (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    score      INT         NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    played_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_math_scores_user ON math_scores (user_id);
