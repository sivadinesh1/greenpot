import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import { useRouter } from 'next/router';

export default function BlogPreview({ title, categories, body, description, author }) {
	const router = useRouter();

	const listCategory = categories?.map((categorylist, idx) => <li key={idx}>{categorylist.name}</li>);

	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
				<div
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
					}}>
					{' '}
					Blog PreView
				</div>
			</div>
			<br />
			{/* <div>{blog.title}</div> */}
			<div>{title}</div>
			<div>{description}</div>
			<div>{author}</div>
			<br />
			{listCategory}
			<div dangerouslySetInnerHTML={{ __html: body }}></div>
		</div>
	);
}
