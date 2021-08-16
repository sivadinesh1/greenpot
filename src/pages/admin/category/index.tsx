import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';

// import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Category } from '../../../modal/Category';

import styles from '../../../styles/Category.module.scss';
import CategoryList from '../../../components/crud/Category/list-category';
import AddCategory from '../../../components/crud/Category/add-category';
import EditCategory from '../../../components/crud/Category/edit-category';
import { getAllCategories } from '../../api/category/[...crud]';
import { parseCookies } from '../../api/auth/user';

import useSWR from 'swr';

export const getServerSideProps = async (context) => {
	let { user_id, company_id } = await parseCookies(context?.req);
	if (user_id === undefined || company_id === undefined) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	// both works dont delete
	const categorys = await getAllCategories(company_id);

	return {
		props: { categorys, company_id },
	};
};

export default function Index({ categorys, company_id }) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('add');
	const [editRowItem, setEditRowItem] = useState<Category>();

	const { data, mutate } = useSWR(`/api/category/crud/company/${company_id}`, {
		initialData: categorys,
	});

	//let categorysList: Category[] = data;

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
