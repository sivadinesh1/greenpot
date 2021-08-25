import { useState } from 'react';
import styles from '../../../styles/dashboard.module.css';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Router from 'next/router';
import Image from 'next/image';
import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import axios from 'axios';

export default function RepoList({ repos, companyId }) {
	const [data, setData] = useState(repos);
	const [showCreate, setShowCreate] = useState(data.length > 0 ? false : true);
	const create = () => {
		return (
			<div>
				<Link href={`/admin/repo/add`}>
					<p> click to create new Repo</p>
				</Link>
			</div>
		);
	};
	const add = () => {
		Router.push('admin/repo/add');
	};

	const editRow = (id: string, event: any) => {
		event.stopPropagation();
		Router.push(`/admin/repo/edit/${id}`);
	};

	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 200px' }}>
				<div> &nbsp;</div>
				<div style={{ fontSize: '1.3rem', padding: '1rem' }}>
					<Button onClick={() => add()} type='button' variant='contained' color='primary'>
						Add New
					</Button>
				</div>
			</div>

			<div className={styles.wrapper}>
				{data &&
					!showCreate &&
					data.map((d, index) => {
						return (
							<div key={index}>
								<div className={styles.card}>
									<Link href={`/admin/blogs/${d.repo_id}`}>
										<div className={styles.card_title}>
											<p> {d.name}</p>
										</div>
									</Link>
									<div>
										<div className={styles.btnGroup} onClick={(event) => editRow(d.repo_id, event)}>
											Click to Edit
											<Image src='/static/images/edit.svg' alt='edit' width='15px' height='15px' />
										</div>
									</div>
								</div>
							</div>
						);
					})}
				{showCreate && create()}
			</div>
		</div>
	);
}
