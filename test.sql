CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    image VARCHAR(255)
);
CREATE TABLE groups (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);
CREATE TABLE songs (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255)
);
CREATE TABLE group_users (
    user_id VARCHAR(255),
    group_id INTEGER,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
CREATE TABLE group_invites (
    invite_code VARCHAR(255),
    group_id INTEGER,
    expire_date DATE,
    PRIMARY KEY (invite_code),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
CREATE TABLE group_playlists (
    playlist_id INTEGER,
    group_id INTEGER,
    PRIMARY KEY (playlist_id, group_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
CREATE TABLE playlist_songs (
    playlist_id INTEGER,
    song_id INTEGER,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);
CREATE TABLE song_ratings (
    song_id VARCHAR(255),
    user_id VARCHAR(255),
    group_id INTEGER,
    playlist_id VARCHAR(255),
    rating INTEGER,
    PRIMARY KEY (song_id, user_id, group_id, playlist_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
