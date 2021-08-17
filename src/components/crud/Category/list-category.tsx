import React, { useState } from 'react';
import styles from '../../../styles/Category.module.scss';
import axios from 'axios';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import Image from 'next/image';

export default function CategoryList({ categories, onMode, onEditRow, onReloadCategoryList, handleSnackOpen }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState('');

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

	const deleteRow = (id: string, event: any) => {
		event.stopPropagation();

		setCurrentId(id);
		setOpenDialog(true);
	};

	return (
		<div>
			<div className={styles.catListTitle}>
				Categories (<span>{categories?.length}</span>)
			</div>
			{categories &&
				categories?.map((item, index) => {
					return (
						<div key={index}>
							<div className={styles.catRow}>
								<div className={styles.catList} onClick={() => handleEdit(item)}>
									<div className={styles.catName}>{item.name}</div>

									<div className={styles.catDel} onClick={(event) => deleteRow(item.id, event)}>
										<Image src='/static/images/close.svg' alt='close' width='12px' height='12px' />
									</div>
								</div>
							</div>
						</div>
					);
				})}

			<ConfirmDialog
				open={openDialog}
				handleClose={() => {
					setOpenDialog(false);
				}}
				handleConfirm={() => {
					handleConfirm();
				}}
				title='Warning Category Deletion !'>
				You are about to delete category. Are you sure?
			</ConfirmDialog>
		</div>
	);
}
