CREATE TABLE bookmarks_drill (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    rating INT NOT NULL
)