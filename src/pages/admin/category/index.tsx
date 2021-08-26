import React, { useState, useEffect } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Category } from '../../../modal/Category';

import styles from '../../../styles/Category.module.scss';
import CategoryList from '../../../components/crud/Category/list-category';
import AddCategory from '../../../components/crud/Category/add-category';
import EditCategory from '../../../components/crud/Category/edit-category';

import axios from 'axios';
import useSWR from 'swr';

import { forceLogout } from '../../../components/auth/auth';

export const getServerSideProps = async (context) => {
	let isError = false;
	const cookie = context?.req?.headers.cookie;

	let categorys = null;
	let company_id = null;

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
	const [editRowItem, setEditRowItem] = useState<Category>();

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

	const editRow = (item: Category) => {
		setEditRowItem(item);
	};

	return (
		<>
			<div className={styles.cat_wrap}>
				<div className={styles.left}>
					{mode === 'add' ? (
						<AddCategory
							categories={data}
							onReloadCategoryList={reloadCategoryList}
							handleSnackOpen={handleSnackOpen}
							company_id={company_id}></AddCategory>
					) : (
						<EditCategory
							onMode={chooseMode}
							editItem={editRowItem}
							onReloadCategoryList={reloadCategoryList}
							handleSnackOpen={handleSnackOpen}></EditCategory>
					)}
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
