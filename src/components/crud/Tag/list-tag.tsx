import React, { useState } from 'react';
import styles from '../../../styles/Tag.module.scss';
import axios from 'axios';

import Image from 'next/image';
import DeleteDialog from '../../elements/ui/Dialog/DeleteDialog';
import { ITag } from '../../../model/Tag';

export default function TagList({ tags, onMode, chooseMode, onEditRow, onReloadTagList, handleSnackOpen, company_id }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState<number>();
	const [currentTag, setCurrentTag] = useState('');

	const handleConfirm = async () => {
		setOpenDialog(false);

		let response = await axios.delete(`/api/tag/${currentId}`);

		if (response.status === 200) {
			handleSnackOpen('Tag Successfully Deleted');
			onReloadTagList();
		}
	};

	const handleEdit = (item) => {
		onEditRow(item);
		chooseMode('edit');
	};

	const deleteRow = (item: ITag, event: any) => {
		event.stopPropagation();

		setCurrentId(item.id);
		setCurrentTag(item.name);
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<div>
			<div className={styles.tagListTitle}>
				Tags (<span>{tags?.length}</span>)
			</div>

			{tags && tags.length === 0 && (
				<>
					<div className='no_data_table'>No tags found. Create tag which best suits your brand / business.</div>
				</>
			)}
			{tags &&
				tags?.map((item, index) => {
					return (
						<div key={index}>
							<div className={styles.tagRow}>
								<div className={styles.tagList} onClick={() => handleEdit(item)}>
									<div>
										<div className={styles.tagName}>{item.name}</div>
									</div>
									<div className={styles.tagDel} onClick={(event) => deleteRow(item, event)}>
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
				windowTitle='Delete this tag?'
				deleteMessage='It will be deleted and wont be able to recover it.'
				title={currentTag}
				confirmDelete={handleConfirm}
			/>
		</div>
	);
}
