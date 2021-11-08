alter table company add column sub_domain varchar(100);
alter table lead_page add column slug varchar(350);
UPDATE lead_page lp SET slug=lower(replace (trim(lp.lead_page_name),' ','-' ));
