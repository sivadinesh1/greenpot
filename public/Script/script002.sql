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


---
alter table custom_template add column name varchar(150);

-----
UPDATE templates
 set content='[{"status": "Active", "content": [{"type": "Head", "style": {"color": "blue", "alignment": "center"}, "value": "Aalam Info Solution"}, {"type": "Content", "value": "styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when you''re defining your styles, you''re actually creating a normal React component, that has your styles attached to it."}], "section": "Header"}, {"status": "Active", "content": "Test footer data", "section": "Footer"}]';

