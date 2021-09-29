alter table blog add column publish_content jsonb;
	update blog set publish_content = body where published ='Y';
alter table blog add column content jsonb;


alter table blog rename column body to layout;
alter table blog alter column layout TYPE varchar(50);
 update blog set layout='classic';
