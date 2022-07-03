CREATE TABLE mybank.users(
	id varchar(60) not null ,
	name varchar(60) not null,
	birthdate varchar(60) not null,
	cpf varchar(11) not null,
	created_at timestamp not null default now(),
	PRIMARY KEY (id)
);
 
CREATE TABLE mybank.accounts(
	id varchar(60) not null,
	email varchar(60) not null,
	user_id varchar(60) not null,
	password varchar(40) not null,
	agency_number integer not null,
	agency_verifier_code integer not null,
	account_number integer not null,
	account_verifier_code integer not null,
	balance real not null default 0,
	created_at timestamp not null default now(),
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES mybank.users (id)
);

CREATE TABLE mybank.transactions(
	id varchar(60) not null,
	account varchar(60) not null,
	destiny_account varchar(60),
	value real not null,
	type varchar(15) not null,
	tax real not null default 0,
	total_value real not null,
	created_at timestamp not null default now(),
	PRIMARY KEY (id),	
	FOREIGN KEY (account) REFERENCES mybank.accounts (id),
	FOREIGN KEY (destiny_account) REFERENCES mybank.accounts (id)
);