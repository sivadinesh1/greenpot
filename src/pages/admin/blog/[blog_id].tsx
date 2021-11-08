import React, { useEffect } from 'react';
import styles from '../../../styles/Blog.module.scss';
import axios from 'axios';
import BlogView from '../../../components/crud/Blog/blog-view';
import { forceLogout } from '../../../components/auth/auth';
import { jsonToHtml } from '../../../components/utils/EditorJs/conversion'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'


export const getServerSideProps = async (context) => {
	const blog_id = context.params.blog_id as string;
	let isError = false;
	let cookie = null;
	let blog = null;
	let html = null;
	let isEmpty = false;
	try {
		cookie = context?.req?.headers.cookie;
		let resp = await axios.get(`${process.env.API_URL}/blog/blogByNano/${blog_id}`, {
			headers: {
				cookie: cookie!,
			},
		});
		blog = resp.data;
		if (blog.publish_content == null)
			isEmpty = true;
		else
			html = await jsonToHtml(blog.publish_content, blog.layout);

	} catch (error) {
		console.log(`error in blog view ${error}`);
		isError = true;
	}
	return {
		props: { isError, blog, html, isEmpty },
	};
};

export default function Index({ isError, blog, html, isEmpty }) {
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);

	const [value, setValue] = React.useState('desktop');

	const handleChange = (event) => {
		setValue(event.target.value);
	};
	return (
		<>
			<div className={styles.blog_view}>
				<div>
					<FormControl component="fieldset">
						<FormLabel component="legend">View</FormLabel>
						<RadioGroup
							aria-label="gender"
							name="controlled-radio-buttons-group"
							value={value}
							onChange={handleChange}
						>
							<FormControlLabel value="desktop" control={<Radio />} label="Desktop" />
							<FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
						</RadioGroup>
					</FormControl>
				</div>
				<BlogView blog={blog} html={html} isEmpty={isEmpty} view={value} />
			</div>
		</>
	);
}
