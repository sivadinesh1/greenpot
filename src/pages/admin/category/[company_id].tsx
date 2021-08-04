import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

// import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Category } from '../../../modal/Category';

import styles from '../../../styles/Category.module.scss';
import CategoryList from '../../../components/crud/Category/list-category';
import AddCategory from '../../../components/crud/Category/add-category';
import EditCategory from '../../../components/crud/Category/edit-category';
import { getAllCategories } from '../../api/category/[...crud]';
import axios from 'axios';
import useSWR from 'swr';

export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;

	// both works dont delete
	//const categorys = await getAllCategories(company_id);

	const cookie = context?.req?.headers.cookie;

	let json = await axios.get(`${process.env.API_URL}/category/crud/company/${company_id}`, {
		headers: {
			cookie: cookie!,
		},
	});

	return {
		props: { categorys: json.data },
	};
};

export interface CategoryProps {
	categorys: Category[];
}

export default function Index({ categorys }: CategoryProps) {
	const router = useRouter();

	const { company_id } = router.query;

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
		<Layout>
			<Admin>
				<div className={styles.cat_wrap}>
					<div className={styles.left}>
						{mode === 'add' ? (
							<AddCategory categories={data} onReloadCategoryList={reloadCategoryList} handleSnackOpen={handleSnackOpen}></AddCategory>
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
			</Admin>
			<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
					{message}
				</MuiAlert>
			</Snackbar>
		</Layout>
	);
}
