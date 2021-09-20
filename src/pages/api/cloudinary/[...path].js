import nc from 'next-connect';
const cloudinary = require('cloudinary').v2;

// export default function generateSignature(req: NextApiRequest, res: NextApiResponse) {
// 	const timestamp = Math.round(new Date().getTime() / 1000);
// 	let path = `${req.query.path[0]}/${req.query.path[1]}/`;
// 	const signature = cloudinary.utils.api_sign_request(
// 		{
// 			folder: path,
// 			timestamp: timestamp,
// 		},
// 		process.env.CLOUDINARY_SECRET,
// 	);

// 	res.statusCode = 200;
// 	res.json({ signature, timestamp });
// }


const handler = nc()
	.delete(async (req, res) => {
        const { slug } = req.query.path;
			const data = await deleteImageByFolder(`${req.query.path[0]}/`);
				res.status(200).json(data );
		
    }).get(async (req, res) => {
        const timestamp = Math.round(new Date().getTime() / 1000);
	let path = `${req.query.path[0]}/${req.query.path[1]}/`;
	const signature = cloudinary.utils.api_sign_request(
		{
			folder: path,
			timestamp: timestamp,
		},
		process.env.CLOUDINARY_SECRET,
	);

	res.statusCode = 200;
	res.json({ signature, timestamp });
		
    });

    export default handler;

    export const deleteImageByFolder = async (folder) => {
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // add your cloud_name
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY, // add your api_key
            api_secret: process.env.CLOUDINARY_SECRET, // add your api_secret
            secure: true,
        });
        const data = await cloudinary.api.delete_resources_by_prefix(folder, function (result) {
            return result;
        });
        return data;
    };