import React, { useState } from 'react';
import styles from '../../../styles/Tag.module.scss';
import axios from 'axios';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import Image from 'next/image';

export default function TagList({ tags, onMode, onEditRow, onReloadTagList, handleSnackOpen, company_id }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState('');

	const handleConfirm = async () => {
		setOpenDialog(false);

		mutate(
			`/api/tag/${company_id}`,
			tags.filter((c) => c.id !== currentId),
			false,
		);

		let response = await axios.delete(`/api/tag/${currentId}`);

		if (response.status === 200) {
			handleSnackOpen('Tag Successfully Deleted');
			onReloadTagList();
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
			<div className={styles.tagListTitle}>
				Tags (<span>{tags?.length}</span>)
			</div>
			{tags &&
				tags?.map((item, index) => {
					return (
						<div key={index}>
							<div className={styles.tagRow}>
								<div className={styles.tagList} onClick={() => handleEdit(item)}>
									<div>
										<div className={styles.tagName}>{item.name}</div>
									</div>
									<div className={styles.tagDel} onClick={(event) => deleteRow(item.id, event)}>
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
				title='Warning Tag Deletion !'>
				You are about to delete tag. Are you sure?
			</ConfirmDialog>
		</div>
	);
}
