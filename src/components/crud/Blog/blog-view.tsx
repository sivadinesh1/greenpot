import React, { useState } from 'react';
import {Button} from '@material-ui/core'
import { getCompany } from './../../auth/auth';
import { useRouter } from 'next/router';



export default function BlogView({ blog }) {
	const router = useRouter();
	let id=getCompany();
	
	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 100px' }}>
			<div style={{
                fontSize: '2rem',
                fontWeight: "bold"
            }}> Blog PreView 
            </div>
				<div style={{fontSize: '1.3rem', padding: '1rem'}}>  
									<Button onClick={() => router.push(`/admin/blogs/${id}`)} type='button' variant='contained' color='primary'>
								Back
							</Button>
								</div>
								</div>
			
       
            <br/>
            <div>{blog.title}</div>
            <br />
            <div dangerouslySetInnerHTML={{ __html: blog.body }}></div>
            
		</div>
	);
}
