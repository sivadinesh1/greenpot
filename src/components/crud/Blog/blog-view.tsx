import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// import EditorView from '../../EditorView';
// import content from '*.jpg';
let EditorView;
if (typeof window !== 'undefined') {
	EditorView = dynamic(() => import('../../EditorView'));
}

export default function BlogView({ blog }) {
	const router = useRouter();
	console.log("blog data---->", blog)


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
			{/* <div dangerouslySetInnerHTML={{ __html: blog.body }}></div> */}
			<div>
				{EditorView && blog.publish_content && <EditorView content={blog.publish_content} />}
				{blog.publish_content == null && <div>still Not publish the Blog</div>}
			</div>
		</div>
	);
}
