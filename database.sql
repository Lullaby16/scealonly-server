CREATE DATABASE sosmed;

CREATE TABLE users(
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'normal',
    role VARCHAR NOT NULL DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts(
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    view INTEGER NOT NULL,
    upvote INTEGER NOT NULL,
    downvote INTEGER NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments(
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE posts_viewCount(
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    view INTEGER DEFAULT 0
);

CREATE TABLE posts_upvoteCount(
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    upvote INTEGER,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    VALUES INTEGER[]
);

CREATE TABLE posts_downvoteCount(
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    downvote INTEGER NOT NULL,
    incremented BOOLEAN DEFAULT FALSE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

ALTER TABLE mytable ADD CONSTRAINT unique_upvote UNIQUE (post_id, upvoted_by);

CREATE OR REPLACE FUNCTION check_upvote()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.upvoted_by IS NOT NULL THEN
    RAISE EXCEPTION 'Post has already been upvoted by this user';
  END IF;
  NEW.upvoted_by := NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_upvote_trigger
BEFORE UPDATE ON posts_upvoteCount
FOR EACH ROW
EXECUTE PROCEDURE check_upvote();

UPDATE mytable
SET upvote = upvote + 1
WHERE post_id = 1 AND user_id = 2;
