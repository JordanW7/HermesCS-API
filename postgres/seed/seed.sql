insert into databaselist (displayname, account, owner, created_at) values ('Demo Company','demo','HermesCS','1995-01-04 09:08:07');
insert into demo_teams (team, leader) values ('Customer Services', 'Demo Admin');
insert into demo_teams (team, leader) values ('Operations', 'James Matthew');
insert into demo_users (firstname, lastname, email, hash, access, team, status) values ('Demo', 'Admin', 'a@a.com', '$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'owner', 'Customer Services','active');
insert into demo_users (firstname, lastname, email, hash, access, team, status) values ('Demo', 'User', 'b@b.com', '$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'agent', 'Customer Services','active');
insert into demo_users (firstname, lastname, email, hash, access, team, status) values ('Peter', 'Gold', 'c@c.com', '$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'agent', 'Operations','active');
insert into demo_users (firstname, lastname, email, hash, access, team, status) values ('James', 'Matthew', 'd@d.com', '$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'teamleader', 'Operations','disabled');
insert into demo_requests (firstname, lastname, mobile, home, twitter, facebook, email, address, type, topic, assign_team, priority, details, status, created_by, created_at) values ('John','Doe', '123', '456', '@Test', 'Facebook', 'john@doe.com', '49 Charles St, Dunedin', 'misc', 'rubbish', 'Operations', 'medium', 'please recycle','current','James Bond','1999-01-08 01:02:03');
insert into demo_1_comments (created_by, team, comments, created_at) values ('Matt Day','Customer Services','I have acknowledged the customers feedback','1999-01-08 01:02:03');
insert into demo_1_comments (created_by, team, comments, created_at) values ('Jamie Day','Customer Services','Test v2-2','1999-01-08 01:02:04');
insert into demo_1_comments (created_by, team, comments, created_at) values ('Sarah Day','Customer Services','Test v2-3','1999-01-08 01:02:05');