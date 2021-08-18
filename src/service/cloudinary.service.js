const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // add your cloud_name
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY, // add your api_key
	api_secret: process.env.CLOUDINARY_SECRET, // add your api_secret
	secure: true,
});

export const getImages = async (path) => {
	const data = cloudinary.search
		.expression(
			`folder:${path}/*`,
		)
		.sort_by('public_id', 'desc')
		.max_results(5)
		.execute()
		.then((result) => {
			return result.resources;
		});
	return data;
};

export const deleteImage = async (public_id) => {
	const data = cloudinary.uploader.destroy(public_id, function (result) {
		return result;
	});
	return data;
};