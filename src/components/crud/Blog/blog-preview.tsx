import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import { useRouter } from 'next/router';

export default function BlogPreview({ title, categories, body, description, author, articleDate }) {
	const router = useRouter();

	const listCategory = categories?.map((categorylist, idx) => <li key={idx}>{categorylist.name}</li>);

	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
				{title === '' || title === undefined ? (
					<div style={{ paddingBottom: '8px', fontSize: '24px', color: '#ccc' }}>Type a Sample Title</div>
				) : (
					<div style={{ paddingBottom: '8px', fontSize: '24px' }}>{title}</div>
				)}
			</div>
			{author === '' || author === undefined ? (
				<div>
					<span style={{ paddingBottom: '8px', fontSize: '14px', color: 'grey' }}>{author},</span>
					<span>{articleDate}</span>
				</div>
			) : (
				''
			)}

			<div>{description}</div>

			<br />
			{listCategory}
			<div dangerouslySetInnerHTML={{ __html: body }}></div>
		</div>
	);
}
