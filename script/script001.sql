create table cta_suggestion (
	id BIGSERIAL PRIMARY KEY,
	cta_key varchar(100),
	cta_label varchar(300),
	created_date timestamp
);

INSERT INTO users (username,"name",email,"emailVerified","password",bio,avatar,"timeZone","weekStart","startTime","endTime","bufferTime","hideBranding",theme,created,"completedOnboarding",locale,"twoFactorSecret","twoFactorEnabled",plan) VALUES 
('sanjay','sanjay','sanjay@gmail.com',NULL,'$2a$12$mp6F8PSmeI1LssatLxzlmuVC8TeTXJhg7MErwN.oOJUExJOw0/WPa','','data:image/jpeg;base64,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','Europe/London','Sunday',0,1440,0,true,'light','2021-09-24 13:29:52.423',true,'en',NULL,false,'PRO')
;
Password 
--Cal@123
--DATABASE_URL="postgres://red_apple:Redapple@123@192.168.2.26:5432/calendso_db"
---[{"type": "Subscription", "items": [{"style": {"color": "black"}, "value": "SPEAK LOUDLY \n SPEAK VISUALLY ", "formDetail": {"name": "title", "type": "text", "label": "Title"}}, {"style": {"color": "black"}, "value": "Receive practical tips on how to \n communicate visually, right in you \n inbox.", "formDetail": {"name": "subTitle", "type": "text", "label": "SubTitle"}}, {"style": {"color": "blue"}, "value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1635415879/hashtag_hrd9jj.png", "formDetail": {"name": "logo", "type": "image", "label": "Logo"}}, {"style": {"color": "#14487c"}, "value": "Download now", "formDetail": {"name": "button", "type": "text", "label": "view"}}], "status": "Active", "isDelete": false, "sectionStyle": {"backgroundColor": "#c8cabb", "backgroundImage": null}}]
