CREATE TABLE template_group (
	id SERIAL PRIMARY KEY,
	name varchar(100),
	description varchar(300),
	status varchar(10),
	is_delete varchar(5),
	created_date timestamp,
	updated_date timestamp	
);

CREATE TABLE template_maping (
	temp_id bigint,
	group_id bigint,
	CONSTRAINT fk_tmaping_template FOREIGN KEY(temp_id) REFERENCES templates (id),
	CONSTRAINT fk_tmaping_tgroup FOREIGN KEY(group_id) REFERENCES template_group (id)
);

alter table templates  drop column category_id;

