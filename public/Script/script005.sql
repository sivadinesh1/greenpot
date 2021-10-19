ALTER TABLE lead_page ALTER COLUMN company_id DROP NOT NULL;
ALTER TABLE lead_page ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE lead_page ALTER COLUMN updated_by DROP NOT NULL;

INSERT INTO "template" (template_name,status,template_id,is_delete,blocks,template_type,created_by,updated_by,"createdAt","updatedAt") VALUES 
('Classic','A','GnOiTVyZ_62','N','{"Footer": {"blocks": [{"value": "Copyrights Squapl digital media technologies1", "formDetail": {"name": "footer", "type": "text", "label": "Footer"}}], "status": "Active"}, "Header": {"blocks": [{"type": "Head", "style": {"color": "blue", "alignment": "center"}, "value": "Aalam Info Solution", "formDetail": {"name": "company", "type": "text", "label": "Company"}}, {"type": "Content", "value": "styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when your defining your styles, your actually creating a normal React component, that has your styles attached to it.", "formDetail": {"name": "content", "type": "text-area", "label": "Content"}}, {"type": "Content", "value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg", "formDetail": {"name": "image", "type": "image", "label": "Image"}}, {"type": "Content", "value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623820202/ivlnvdazgtls0nimhxmp.jpg", "formDetail": {"name": "background", "type": "image", "label": "BackGround"}}], "status": "Active", "section": "Header"}}',NULL,NULL,NULL,NULL,NULL)
;




update template  set blocks = '{"Footer":{"blocks":[{"value":"Copyrights Squapl digital media technologies1","formDetail":{"name":"footer","type":"text","label":"Footer"}}],"status":"Active"},"Header":{"blocks":[{"style":{"color":"blue","alignment":"center"},"value":"Aalam Info Solution","formDetail":{"name":"company","type":"text","label":"Company"}},{"value":"styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when your defining your styles, your actually creating a normal React component, that has your styles attached to it.","formDetail":{"name":"content","type":"text-area","label":"Content"}},{"value":"https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg","formDetail":{"name":"image","type":"image","label":"Image"}},{"value":"https://res.cloudinary.com/sanjayaalam/image/upload/v1623820202/ivlnvdazgtls0nimhxmp.jpg","formDetail":{"name":"background","type":"image","label":"BackGround"}}],"status":"Active"}}';

alter table company rename column createddate to createdAt ;
alter table company rename column updateddate to updtaedAt
{
	"Footer": {
		"blocks": [
			{
				"value": "Copyrights Squapl digital media technologies1",
				"formDetail": {
					"name": "footer",
					"type": "text",
					"label": "Footer"
				}
			}
		],
		"status": "Active"
	},
	"Header": {
		"blocks": [
			{
				"style": {
					"color": "blue",
					"alignment": "center"
				},
				"value": "Aalam Info Solution",
				"formDetail": {
					"name": "company",
					"type": "text",
					"label": "Company"
				}
			},
			{
				"value": "styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when your defining your styles, your actually creating a normal React component, that has your styles attached to it.",
				"formDetail": {
					"name": "content",
					"type": "text-area",
					"label": "Content"
				}
			},
			{
				"value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg",
				"formDetail": {
					"name": "image",
					"type": "image",
					"label": "Image"
				}
			},
			{
				"value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623820202/ivlnvdazgtls0nimhxmp.jpg",
				"formDetail": {
					"name": "background",
					"type": "image",
					"label": "BackGround"
				}
			}
		],
		"status": "Active",
	}
}



update lead_page set blocks ='{"Hero":{"blocks":[{"value":"The company that can offer the whole package","formDetail":{"name":"title","type":"text","label":"Title"}},{"value":"The enterprise companies are looking for partner to design, develop and integrate systems to help them meet their business challenges with software. It is important for this company to be able to offer the whole package.","formDetail":{"name":"content","type":"text","label":"Content"}},{"value":"https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350","formDetail":{"name":"background","type":"image","label":"BackGround"}}],"status":"Active"},"Footer":{"blocks":[{"value":"Copyrights Squapl digital media technologies1","formDetail":{"name":"footer","type":"text","label":"Footer"}}],"status":"Active"},"Header":{"blocks":[{"style":{"color":"blue","alignment":"center"},"value":"Hero page ghghgh","formDetail":{"name":"company","type":"text","label":"Company"}},{"value":"styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when your defining your styles, your actually creating a normal React component, that has your styles attached to it.","formDetail":{"name":"content","type":"text-area","label":"Content"}},{"value":"https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg","formDetail":{"name":"image","type":"image","label":"Image"}},{"value":"https://res.cloudinary.com/sanjayaalam/image/upload/v1623820202/ivlnvdazgtls0nimhxmp.jpg","formDetail":{"name":"background","type":"image","label":"BackGround"}}],"status":"Active"},"Content":{"blocks":[{"value":"Aalam is a team of IT professionals who work together to offer the whole package.","formDetail":{"name":"title","type":"text","label":"Title"}},{"value":"The enterprise companies are looking for partner to design, develop and integrate systems to help them meet their business challenges with software. It is important for this company to be able to offer the whole package.","formDetail":{"name":"content","type":"text","label":"Content"}}],"status":"Active"}}'