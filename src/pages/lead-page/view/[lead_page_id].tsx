import React, { useState } from 'react';
import { getLeadPageByNano } from '../../../service/lead-page.service';
import Builder from '../../../components/Builder'

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let cTempNano = null;
	let leadData = null;

	try {
		cTempNano = context.params.lead_page_id;
		console.log("check lead id ---->", cTempNano)
		cookie = context?.req?.headers.cookie;
		leadData = await getLeadPageByNano(cTempNano);
	} catch (error) {
		console.log(`error in custom template ${error}`);
		isError = true;
	}

	return {
		props: { isError, leadData },
	};
};

const LeadPageView = ({ isError, leadData }) => {
	const [data, setData] = useState(leadData.blocks);
	console.log("cross check data ---->", leadData)

	return (
		<div>
			<Builder data={data} mode={'view'} />
		</div>
	)

};

export default LeadPageView;

// async function getSignature(folderPath) {
// 	const response = await fetch(`/api/cloudinary/${folderPath}`);
// 	const data = await response.json();
// 	const { signature, timestamp } = data;
// 	return { signature, timestamp };
// }

// async function deleteOldImg(folderPath) {
// 	const requestOptions = {
// 		method: 'DELETE',
// 	};
// 	const response = await fetch(`/api/cloudinary/${folderPath}`, requestOptions);
// 	const data = await response.json();
// 	return data;
// }
