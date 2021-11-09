
-- Drop table

-- DROP TABLE public.category;

CREATE TABLE public.category (
	id bigserial NOT NULL,
	"name" varchar(50) NULL,
	slug varchar(300) NULL,
	company_id int8 NULL,
	created_by int8 NULL,
	"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int8 NULL,
	"updatedAt" timestamp NULL,
	CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX category_name_company_id_key ON public.category USING btree (name, company_id);

-- Drop table

-- DROP TABLE public.collection;

CREATE TABLE public.collection (
	id bigserial NOT NULL,
	"name" varchar(100) NOT NULL,
	description varchar(100) NOT NULL,
	status varchar(10) NULL,
	is_delete varchar(5) NULL,
	created_by int8 NULL,
	updated_by int8 NULL,
	"createdAt" timestamp NULL,
	"updatedAt" timestamp NULL,
	CONSTRAINT collection_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE public.company;

CREATE TABLE public.company (
	id bigserial NOT NULL,
	company_id varchar(20) NULL,
	"name" varchar(60) NULL,
	status varchar(10) NULL,
	logo varchar(500) NULL,
	about varchar(500) NULL,
	website_url varchar(100) NULL,
	is_delete varchar(5) NULL,
	created_by int8 NULL,
	updated_by int8 NULL,
	"createdAt" timestamp NULL,
	"updatedAt" timestamp NULL,
	blog_home_format varchar(50) NULL,
	sub_domain varchar(100) NULL,
	CONSTRAINT company_pkey PRIMARY KEY (id),
	CONSTRAINT sub_domain_unique UNIQUE (sub_domain)
);
CREATE UNIQUE INDEX company_company_id_key ON public.company USING btree (company_id);

-- Drop table

-- DROP TABLE public."role";

CREATE TABLE public."role" (
	id int8 NOT NULL,
	"name" varchar(50) NULL,
	description varchar(50) NULL,
	CONSTRAINT role_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE public.subscriptions;

CREATE TABLE public.subscriptions (
	id bigserial NOT NULL,
	email varchar(150) NULL,
	company_id int8 NULL,
	repo_id int8 NULL,
	lead_id int8 NULL,
	created_date timestamp NULL,
	CONSTRAINT subscription_unique UNIQUE (email, lead_id),
	CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE public.tag;

CREATE TABLE public.tag (
	id bigserial NOT NULL,
	"name" varchar(50) NULL,
	slug varchar(300) NULL,
	company_id int8 NULL,
	created_by int8 NULL,
	"createdAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int8 NULL,
	"updatedAt" timestamp NULL,
	CONSTRAINT tag_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX tag_name_company_id_key ON public.tag USING btree (name, company_id);

-- Drop table

-- DROP TABLE public."template";

CREATE TABLE public."template" (
	id bigserial NOT NULL,
	template_name varchar(60) NOT NULL,
	status varchar(10) NULL,
	template_id varchar(20) NOT NULL,
	is_delete varchar(5) NULL,
	blocks jsonb NULL,
	template_type varchar(5) NULL,
	created_by int8 NULL,
	updated_by int8 NULL,
	"createdAt" timestamp NULL,
	"updatedAt" timestamp NULL,
	thumbnail varchar(500) NULL,
	CONSTRAINT template_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX template_template_id_key ON public.template USING btree (template_id);
CREATE UNIQUE INDEX template_template_name_key ON public.template USING btree (template_name);

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id bigserial NOT NULL,
	first_name varchar(100) NOT NULL,
	email varchar(320) NOT NULL,
	last_login_date timestamp NULL,
	profile_pic varchar(100) NULL,
	reset_token varchar(45) NULL,
	salt varchar(255) NULL,
	hashed_password varchar(255) NULL,
	resetpasswordlink varchar(500) NULL,
	created_by int4 NULL,
	created_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modified_by int4 NULL,
	modified_date timestamp NULL,
	last_name varchar(100) NULL,
	phone varchar(20) NULL,
	status varchar(10) NULL,
	profile_url varchar(300) NULL,
	company_id int8 NULL,
	"source" varchar(10) NULL,
	socialmedia_id varchar(100) NULL,
	access_rights varchar(5) NULL,
	user_id varchar(20) NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

-- Drop table

-- DROP TABLE public.repo;

CREATE TABLE public.repo (
	id bigserial NOT NULL,
	repo_id varchar(20) NOT NULL,
	repo_name varchar(150) NOT NULL,
	company_id int8 NOT NULL,
	status varchar(10) NULL,
	is_delete varchar(5) NULL,
	repo_type varchar(10) NULL,
	created_by int8 NULL,
	updated_by int8 NULL,
	"createdAt" timestamp NULL,
	"updatedAt" timestamp NULL,
	CONSTRAINT repo_pkey PRIMARY KEY (id),
	CONSTRAINT repo_company_id_fkey FOREIGN KEY (company_id) REFERENCES company(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE UNIQUE INDEX repo_repo_id_key ON public.repo USING btree (repo_id);

-- Drop table

-- DROP TABLE public.template_collection;

CREATE TABLE public.template_collection (
	collection_id int8 NOT NULL,
	template_id int8 NOT NULL,
	CONSTRAINT template_collection_pkey PRIMARY KEY (collection_id, template_id),
	CONSTRAINT template_collection_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES collection(id) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT template_collection_template_id_fkey FOREIGN KEY (template_id) REFERENCES template(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Drop table

-- DROP TABLE public.user_role;

CREATE TABLE public.user_role (
	id bigserial NOT NULL,
	role_id int8 NOT NULL,
	user_id int8 NOT NULL,
	CONSTRAINT user_role_pkey PRIMARY KEY (role_id, user_id),
	CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES role(id) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Drop table

-- DROP TABLE public.blog;

CREATE TABLE public.blog (
	id bigserial NOT NULL,
	blog_id varchar(20) NOT NULL,
	title varchar(80) NULL,
	description varchar(200) NULL,
	slug varchar(300) NULL,
	excerpt varchar(350) NULL,
	layout varchar(50) NOT NULL,
	category _int4 NULL,
	tag _int4 NULL,
	company_id int8 NULL,
	repo_id int8 NOT NULL,
	author varchar(50) NULL,
	is_delete varchar(5) NULL,
	blog_date timestamp NULL,
	status varchar(1) NULL,
	published varchar(1) NULL,
	published_on timestamp NULL,
	created_by int8 NULL,
	"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int8 NULL,
	"updatedAt" timestamp NULL,
	thumbnail varchar(350) NULL,
	publish_content jsonb NULL,
	"content" jsonb NULL,
	is_author bool NULL,
	is_publish_date bool NULL,
	word_count varchar(10) NULL,
	read_time varchar(15) NULL,
	CONSTRAINT blog_pkey PRIMARY KEY (id),
	CONSTRAINT blog_repo_id_fkey FOREIGN KEY (repo_id) REFERENCES repo(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE UNIQUE INDEX blog_blog_id_key ON public.blog USING btree (blog_id);

-- Drop table

-- DROP TABLE public.lead_page;

CREATE TABLE public.lead_page (
	id bigserial NOT NULL,
	lead_page_id varchar(20) NOT NULL,
	lead_page_name varchar(150) NULL,
	template_id int8 NOT NULL,
	status varchar(10) NULL,
	blocks jsonb NULL,
	is_delete varchar(5) NULL,
	repo_id int8 NOT NULL,
	template_type varchar(5) NOT NULL,
	blocks_clone jsonb NULL,
	company_id int8 NULL,
	created_by int8 NULL,
	updated_by int8 NULL,
	"createdAt" timestamp NULL,
	"updatedAt" timestamp NULL,
	thumbnail varchar(350) NULL,
	published varchar(5) NULL,
	slug varchar(350) NULL,
	CONSTRAINT lead_page_pkey PRIMARY KEY (id),
	CONSTRAINT lead_page_repo_id_fkey FOREIGN KEY (repo_id) REFERENCES repo(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE UNIQUE INDEX lead_page_lead_page_id_key ON public.lead_page USING btree (lead_page_id);
