import React, { useState } from 'react';
import styles from '../../../styles/Blog.module.scss';
import axios from 'axios';
// import { getCompany } from '../../../components/auth/auth';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import Router from 'next/router';

export default function BlogList({ blogs, onReloadBlogList, handleSnackOpen, onMode, company_id }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState('');
	//	const router = useRouter();

	const handleConfirm = async () => {
		setOpenDialog(false);
		mutate(
			`/api/blog/crud/company/${company_id}`,
			blogs.filter((c) => c.id !== currentId),
			false,
		);

		let response = await axios.delete(`/api/blog/crud/${currentId}`);

		if (response.status === 200) {
			handleSnackOpen('blog Successfully Deleted');
			onReloadBlogList();
		}
	};

	const deleteRow = (id: string, event: any) => {
		event.stopPropagation();

		setCurrentId(id);
		setOpenDialog(true);
	};

	const editRow = (id: string, event: any) => {
		event.stopPropagation();
		Router.push(`/admin/blog-edit/${company_id}/${id}`);
	};

	const viewRow = (id: string, event: any) => {
		event.stopPropagation();
		Router.push(`/admin/blogt/${id}`);
	};

	// `/admin/blog-edit/${item.id}

	const handleAdd = () => {
		onMode('add');
	};

	return (
		<div>
			<div className={styles.blogListTitle}>
				<div>
					Blogs (<span>{blogs.length}</span>)
				</div>
				<div onClick={(event) => editRow('25', event)}>EDIT</div>
			</div>
			{blogs &&
				blogs?.map((item, index) => {
					return (
						<div key={index}>
							<div className={styles.blogRow}>
								<div className={styles.blogList}>
									<div>
										<div className={styles.blogName}>
											<div>{item.title}</div>
										</div>
									</div>
									<div className={styles.blogDel}>
										<div className={styles.btnGroup} onClick={(event) => editRow(item.id, event)}>
											<Image src='/static/images/edit.svg' alt='edit' width='15px' height='15px' />
										</div>
										<div className={styles.btnGroup} onClick={(event) => viewRow(item.id, event)}>
											<Image src='/static/images/preview.svg' alt='preview' width='15px' height='15px' />
										</div>
										<div className={styles.btnGroup} onClick={(event) => deleteRow(item.id, event)}>
											<Image src='/static/images/close.svg' alt='close' width='10px' height='10px' />
										</div>
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
