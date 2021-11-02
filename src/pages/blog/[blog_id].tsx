import { getBlogByNanoId } from "../../service/blog.service";
import { jsonToHtml } from '../../components/utils/EditorJs/conversion'

export const getServerSideProps = async (context) => {
	const blog_id = context.params.blog_id as string;
	let isError = false;
	let cookie = null;
	let blog = null;
	let html = null;
	let isEmpty = false;
	try {
		blog = await getBlogByNanoId(blog_id)
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


const Blog = ({ html }) => {
	// render code
	return (
		<div>
			<h1>Todos</h1>

			<div dangerouslySetInnerHTML={{ __html: html }}></div>
		</div>
	);
};

export default Blog;
