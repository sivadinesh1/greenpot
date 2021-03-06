import React, { useState, useEffect } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ICategory } from '../../../model/Category';

import styles from '../../../styles/Category.module.scss';
import CategoryList from '../../../components/crud/Category/list-category';
import EditCategory from '../../../components/crud/Category/edit-category';

import axios from 'axios';
import useSWR from 'swr';

import { forceLogout } from '../../../components/auth/auth';

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let categorys = null;
	let company_id = null;

	try {
		cookie = context?.req?.headers.cookie;
		await axios
			.get(`${process.env.API_URL}/category`, {
				headers: {
					cookie: cookie!,
				},
			})
			.then((response) => {
				company_id = response.data.company_id;
				categorys = response.data.categories;
			})
			.catch((error) => {
				isError = true;
			});
	} catch (error) {
		console.log(`error in category ${error}`);
		isError = true;
	}

	return {
		props: { categorys, company_id, isError },
	};
};

export default function Index({ categorys, company_id, isError }) {
	useEffect(() => {
		if (isError) {
			forceLogout();
		}
	}, []);

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('add');
	const [editRowItem, setEditRowItem] = useState<ICategory>();

	const { data, mutate, error } = useSWR(`/api/category/${company_id}`, {
		initialData: categorys,
	});

	const handleSnackOpen = (message) => {
		setSnack(true);
		setMessage(message);
	};

	const reloadCategoryList = async () => {
		mutate();
	};

	const chooseMode = (mode: string) => {
		setMode(mode);
	};

	const editRow = (item: ICategory) => {
		setEditRowItem(item);
	};

	return (
		<>
			<div className={styles.cat_wrap}>
				<div className={styles.left}>
					<EditCategory
						onMode={mode}
						chooseMode={chooseMode}
						editItem={editRowItem}
						onReloadCategoryList={reloadCategoryList}
						handleSnackOpen={handleSnackOpen}
						company_id={company_id}></EditCategory>
				</div>

				<div className={styles.right}>
					<CategoryList
						categories={data}
						onMode={chooseMode}
						onEditRow={editRow}
						onReloadCategoryList={reloadCategoryList}
						handleSnackOpen={handleSnackOpen}
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
