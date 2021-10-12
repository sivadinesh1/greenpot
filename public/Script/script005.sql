ALTER TABLE lead_page ALTER COLUMN company_id DROP NOT NULL;
ALTER TABLE lead_page ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE lead_page ALTER COLUMN updated_by DROP NOT NULL;

INSERT INTO "template" (template_name,status,template_id,is_delete,blocks,template_type,created_by,updated_by,"createdAt","updatedAt") VALUES 
('Classic','A','GnOiTVyZ_62','N','{"Footer": {"blocks": [{"value": "Copyrights Squapl digital media technologies1", "formDetail": {"name": "footer", "type": "text", "label": "Footer"}}], "status": "Active"}, "Header": {"blocks": [{"type": "Head", "style": {"color": "blue", "alignment": "center"}, "value": "Aalam Info Solution", "formDetail": {"name": "company", "type": "text", "label": "Company"}}, {"type": "Content", "value": "styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when your defining your styles, your actually creating a normal React component, that has your styles attached to it.", "formDetail": {"name": "content", "type": "text-area", "label": "Content"}}, {"type": "Content", "value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg", "formDetail": {"name": "image", "type": "image", "label": "Image"}}, {"type": "Content", "value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623820202/ivlnvdazgtls0nimhxmp.jpg", "formDetail": {"name": "background", "type": "image", "label": "BackGround"}}], "status": "Active", "section": "Header"}}',NULL,NULL,NULL,NULL,NULL)
;


-- {
-- 	"Footer": {
-- 		"blocks": [
-- 			{
-- 				"value": "Copyrights Squapl digital media technologies1",
-- 				"formDetail": {
-- 					"name": "footer",
-- 					"type": "text",
-- 					"label": "Footer"
-- 				}
-- 			}
-- 		],
-- 		"status": "Active"
-- 	},
-- 	"Header": {
-- 		"blocks": [
-- 			{
-- 				"type": "Head",
-- 				"style": {
-- 					"color": "blue",
-- 					"alignment": "center"
-- 				},
-- 				"value": "Aalam Info Solution",
-- 				"formDetail": {
-- 					"name": "company",
-- 					"type": "text",
-- 					"label": "Company"
-- 				}
-- 			},
-- 			{
-- 				"type": "Content",
-- 				"value": "styled-components utilises tagged template literals to style your components.It removes the mapping between components and styles. This means that when your defining your styles, your actually creating a normal React component, that has your styles attached to it.",
-- 				"formDetail": {
-- 					"name": "content",
-- 					"type": "text-area",
-- 					"label": "Content"
-- 				}
-- 			},
-- 			{
-- 				"type": "Content",
-- 				"value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg",
-- 				"formDetail": {
-- 					"name": "image",
-- 					"type": "image",
-- 					"label": "Image"
-- 				}
-- 			},
-- 			{
-- 				"type": "Content",
-- 				"value": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623820202/ivlnvdazgtls0nimhxmp.jpg",
-- 				"formDetail": {
-- 					"name": "background",
-- 					"type": "image",
-- 					"label": "BackGround"
-- 				}
-- 			}
-- 		],
-- 		"status": "Active",
-- 		"section": "Header"
-- 	}
-- }