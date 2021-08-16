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
import { parseCookies } from '../../api/auth/user';

export const getServerSideProps = async (context) => {
	let { user_id, company_id } = await parseCookies(context?.req);
	if (user_id === undefined || company_id === undefined) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	const tags = await getAllTags(company_id);

	return {
		props: { tags, company_id },
	};
};

export default function Index({ tags, company_id }) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('add');

	const [editRowItem, setEditRowItem] = useState<Tag>();

	const { data, mutate } = useSWR(`/api/tag/crud/company/${company_id}`, {
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
