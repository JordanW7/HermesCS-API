-- Deploy fresh database tables:
\i '/docker-entrypoint-initdb.d/tables/databaselist.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_requests.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_users.sql'

-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'