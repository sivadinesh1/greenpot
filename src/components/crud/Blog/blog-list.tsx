import React, { useState } from 'react';
import styles from '../../../styles/Blog.module.scss';
import axios from 'axios';
import { getCompany } from '../../../components/auth/auth';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogList({ blogs, onReloadBlogList, handleSnackOpen }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState('');

	var companyId = getCompany();

	const handleConfirm = async () => {
		setOpenDialog(false);
		mutate(
			`/api/blog/crud/company/${companyId}`,
			blogs.filter((c) => c.id !== currentId),
			false,
		);

		let response = await axios.delete(`/api/blog/crud/${currentId}`);

		if (response.status === 200) {
			handleSnackOpen('blog Successfully Deleted');
			onReloadBlogList();
		}
	};

	// const handleEdit = (item) => {
	// 	onMode('edit');
	// 	onEditRow(item);
	// };

	const deleteRow = (id: string, event: any) => {
		event.stopPropagation();

		setCurrentId(id);
		setOpenDialog(true);
	};

	return (
		<div>
			<div className={styles.blogListTitle}>
				Blogs (<span>{blogs.length}</span>)
			</div>
			{blogs &&
				blogs?.map((item, index) => {
					return (
						<div key={index}>
							<div className={styles.blogRow}>
								{/* onClick={() => handleEdit(item)} */}
								<div className={styles.blogList}>
									<div>
										<div className={styles.blogName}>
											<Link href={`/admin/blog/${item.id}`}>{item.title}</Link>
										</div>
									</div>
									<div className={styles.blogDel} onClick={(event) => deleteRow(item.id, event)}>
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
				title='Warning Blog Deletion !'>
				You are about to delete blog. Are you sure?
			</ConfirmDialog>
		</div>
	);
}
