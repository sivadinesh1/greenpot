alter table blog add column publish_content jsonb;
	update blog set publish_content = body where published ='Y';
alter table blog add column content jsonb;