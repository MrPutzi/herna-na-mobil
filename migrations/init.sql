CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username text unique not null,
  password text not null,
  credits integer default 1000 not null
);