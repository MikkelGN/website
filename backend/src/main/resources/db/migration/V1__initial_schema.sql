-- Categories (word types)
CREATE TABLE categories (
    id         BIGSERIAL PRIMARY KEY,
    name_da    VARCHAR(100) NOT NULL,
    name_en    VARCHAR(100) NOT NULL,
    color      VARCHAR(20)  NOT NULL DEFAULT '#ff00ff',
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Words
CREATE TABLE words (
    id          BIGSERIAL PRIMARY KEY,
    text        VARCHAR(200) NOT NULL,
    category_id BIGINT       NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_words_category ON words (category_id);

-- Users (honor-based, no password)
CREATE TABLE app_users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_username ON app_users (username);

-- Game sessions
CREATE TABLE game_sessions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT      NOT NULL REFERENCES app_users (id),
    category_ids    BIGINT[]    NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    total_score     INT         NOT NULL DEFAULT 0,
    correct_answers INT         NOT NULL DEFAULT 0,
    max_streak      INT         NOT NULL DEFAULT 0
);

CREATE INDEX idx_sessions_user ON game_sessions (user_id);
CREATE INDEX idx_sessions_score ON game_sessions (total_score DESC);

-- Individual answers within a session
CREATE TABLE game_answers (
    id               BIGSERIAL PRIMARY KEY,
    session_id       BIGINT      NOT NULL REFERENCES game_sessions (id) ON DELETE CASCADE,
    word_id          BIGINT      NOT NULL REFERENCES words (id),
    chosen_category  BIGINT      NOT NULL REFERENCES categories (id),
    correct          BOOLEAN     NOT NULL,
    time_remaining   DECIMAL     NOT NULL,
    points_earned    INT         NOT NULL DEFAULT 0,
    streak_at_answer INT         NOT NULL DEFAULT 0,
    answered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_session ON game_answers (session_id);
