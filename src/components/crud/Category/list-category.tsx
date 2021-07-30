import React, { useState } from 'react';
import styles from '../../../styles/Category.module.scss';
import axios from 'axios';
import { getCompany } from '../../../components/auth/auth';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import Image from 'next/image';

export default function CategoryList({ categories, onMode, onEditRow, onReloadCategoryList, handleSnackOpen }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState('');
	var companyId = getCompany();

	const handleConfirm = async () => {
		setOpenDialog(false);

		mutate(
			`/api/category/crud/company/${companyId}`,
			categories.filter((c) => c.id !== currentId),
			false,
		);

		let response = await axios.delete(`/api/category/crud/${currentId}`);

		if (response.status === 200) {
			handleSnackOpen('Category Successfully Deleted');
			onReloadCategoryList();
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
									<div>
										<div className={styles.catName}>{item.name}</div>
									</div>
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
