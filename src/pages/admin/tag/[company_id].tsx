import Layout from '../../../components/Layout';

import React, { useState } from 'react';
import { useRouter } from 'next/router';

// import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Tag } from '../../../modal/Tag';

import styles from '../../../styles/Tag.module.scss';
import TagList from '../../../components/crud/Tag/list-tag';
import AddTag from '../../../components/crud/Tag/add-tag';
import EditTag from '../../../components/crud/Tag/edit-tag';
import { getAllTags } from '../../api/tag/[...crud]';
import axios from 'axios';
import useSWR from 'swr';
import {getLoginSession} from '../../../lib/auth'


export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;
	if (context.req.headers.cookie === undefined) {
		return {
		  redirect: { destination: '/', permanent: false },
		}
	  }
	//   let tags = [];
	 const tags = await getAllTags(company_id);
	//redirect login page
	if (context.req.headers.cookie === undefined) {
		return {
		  redirect: { destination: '/', permanent: false },
		}
	  }
	// const cookie = context?.req?.headers?.cookie ;
	// let resp = await axios.get(`${process.env.API_URL}/category/crud/company/${company_id}`
	// , {
	// 	headers: {
	// 		cookie: cookie,
	// 	},}
	// );

	// if (resp.status === 200 && !resp.data.session) {
	// 	return {
	// 	  redirect: { destination: '/', permanent: false },
	// 	}
	//   }
	// tags = resp.data;
	return {
		props: { tags },
	};
};

export interface TagProps {
	tags: Tag[];
}

export default function Index({ tags }: TagProps) {
	const router = useRouter();

	const { company_id } = router.query;

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('add');

	const [editRowItem, setEditRowItem] = useState<Tag>();

	const { data, mutate } = useSWR(`/api/tag/crud/company/${company_id}`, {
		initialData: tags,
		revalidateOnMount: true,
	});

	const handleSnackOpen = (message) => {
		setSnack(true);
		setMessage(message);
	};

	const reloadTagList = async () => {
		mutate();
	};

	const chooseMode = (mode: string) => {
		setMode(mode);
	};

	const editRow = (item: Tag) => {
		setEditRowItem(item);
	};
	const ref = React.createRef();

	return (
		<>
			<div className={styles.tag_wrap}>
				<div className={styles.left}>
					{mode === 'add' ? (
						<AddTag tags={data} onReloadTagList={reloadTagList} handleSnackOpen={handleSnackOpen} company_id={company_id}></AddTag>
					) : (
						<EditTag onMode={chooseMode} editItem={editRowItem} onReloadTagList={reloadTagList} handleSnackOpen={handleSnackOpen}></EditTag>
					)}
				</div>

				<div className={styles.right}>
					<TagList
						tags={data}
						onMode={chooseMode}
						onEditRow={editRow}
						onReloadTagList={reloadTagList}
						handleSnackOpen={handleSnackOpen}
						company_id={company_id}
					/>
				</div>
			</div>

			<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
					{message}
				</MuiAlert>
			</Snackbar>
		</>
	);
}
