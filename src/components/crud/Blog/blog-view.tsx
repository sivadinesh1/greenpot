import React, { useState } from 'react';

export default function BlogView({ blog }) {
	return (
		<div>
			<div>Title</div>
			<div>{blog.title}</div>
		</div>
	);
}
