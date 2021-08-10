import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import { useRouter } from 'next/router';

export default function BlogView({ blog }) {
	const router = useRouter();

	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 100px' }}>
				<div
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
					}}>
					{' '}
					Blog PreView
				</div>
				<div style={{ fontSize: '1.3rem', padding: '1rem' }}>
					<Button onClick={() => router.back()} type='button' variant='contained' color='primary'>
						Back
					</Button>
				</div>
			</div>

			<br />
			<div>{blog.title}</div>
			<br />
			<div dangerouslySetInnerHTML={{ __html: blog.body }}></div>
		</div>
	);
}
