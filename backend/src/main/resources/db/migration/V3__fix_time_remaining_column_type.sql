-- Hibernate maps Java double to float8 (double precision), not numeric.
-- Fix the column type to match the entity.
ALTER TABLE game_answers
    ALTER COLUMN time_remaining TYPE DOUBLE PRECISION USING time_remaining::double precision;
