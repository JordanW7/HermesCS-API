-- Deploy fresh database tables:
\i '/docker-entrypoint-initdb.d/tables/databaselist.sql'

-- For testing purposes only. This will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_requests.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_users.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_teams.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_notifications.sql'
\i '/docker-entrypoint-initdb.d/tables/demo_1_comments.sql'