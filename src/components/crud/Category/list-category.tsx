import React, { useState } from 'react';
import styles from '../../../styles/Category.module.scss';
import axios from 'axios';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
// import { mutate } from 'swr';
import Image from 'next/image';
import DeleteDialog from '../../elements/ui/Dialog/DeleteDialog';
import { ICategory } from '../../../model/Category';

export default function CategoryList({ categories, onMode, onEditRow, onReloadCategoryList, handleSnackOpen }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState<number>();
	const [currentCategory, setCurrentCategory] = useState('');

	const handleConfirm = async () => {
		setOpenDialog(false);
		try {
			let response = await axios.delete(`/api/category/${currentId}`);
			if (response.status === 200) {
				handleSnackOpen('Category Successfully Deleted');
				onReloadCategoryList();
			}
		} catch (err) {
			handleSnackOpen('Failed: Category deletion!');
		}
	};

	const handleEdit = (item) => {
		onMode('edit');
		onEditRow(item);
	};

	const deleteRow = (item: ICategory, event: any) => {
		event.stopPropagation();

		setCurrentId(item.id);
		setCurrentCategory(item.name);
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<div>
			<div className={styles.catListTitle}>
				Categories (<span>{categories?.length}</span>)
			</div>
			{categories && categories.length === 0 && (
				<>
					<div className='no_data_table'>No categories found. Create tag which best suits your brand / business.</div>
				</>
			)}
			{categories &&
				categories?.map((item: ICategory, index) => {
					return (
						<div key={index}>
							<div className={styles.catRow}>
								<div className={styles.catList} onClick={() => handleEdit(item)}>
									<div className={styles.catName}>{item.name}</div>

									<div className={styles.catDel} onClick={(event) => deleteRow(item, event)}>
										<Image src='/static/images/close.svg' alt='close' width='12px' height='12px' />
									</div>
								</div>
							</div>
						</div>
					);
				})}

			<DeleteDialog
				open={openDialog}
				handleClose={handleClose}
				windowTitle='Delete this category?'
				deleteMessage='It will be deleted and wont be able to recover it.'
				title={currentCategory}
				confirmDelete={handleConfirm}
			/>
		</div>
	);
}
