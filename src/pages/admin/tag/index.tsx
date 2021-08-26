import React, { useState, useEffect } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Tag } from '../../../modal/Tag';

import styles from '../../../styles/Tag.module.scss';
import TagList from '../../../components/crud/Tag/list-tag';
import AddTag from '../../../components/crud/Tag/add-tag';
import EditTag from '../../../components/crud/Tag/edit-tag';

import axios from 'axios';
import useSWR from 'swr';
import { forceLogout } from '../../../components/auth/auth';
import { errorUtils } from '../../../utils/error-utils';

export const getServerSideProps = async (context) => {
	let isError = false;
	const cookie = context?.req?.headers.cookie;

	let tags = null;
	let company_id = null;

	await axios
		.get(`${process.env.API_URL}/tag`, {
			headers: {
				cookie: cookie!,
			},
		})
		.then((response) => {
			company_id = response.data.company_id;
			tags = response.data.tags;
		})
		.catch((error) => {
			let err = errorUtils.getError(error);
			console.log('print error ' + err);
			isError = true;
		});

	return {
		props: { tags, company_id, isError },
	};
};

export default function Index({ tags, company_id, isError }) {
	useEffect(() => {
		if (isError) {
			forceLogout();
		}
	}, []);

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('add');

	const [editRowItem, setEditRowItem] = useState<Tag>();

	const { data, mutate } = useSWR(`/api/tag/${company_id}`, {
		initialData: tags,
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
