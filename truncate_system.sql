truncate
	table user_group ;

truncate
	table "user" cascade;

truncate
	table group_role ;

truncate
	table "group" cascade;

truncate
	table "role" cascade;

truncate
	table "system" ;

truncate
	table client_allowed_url ;

truncate
	table client cascade;
	
truncate
	table auth_settings;