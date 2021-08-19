import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');

export const createRepo = async (data) => {
    const {name,status,companyId}=data
    let isdelete="N"
    
    let query1=`INSERT INTO repo (repo_id,name,company_id,status,isdelete,createddate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`

	return new Promise(function (resolve,reject) {
		db.any(query1, [nanoid(11),name,companyId,status,isdelete,new Date()]).then((data) => {
			resolve(data);
		}).catch((error)=>{
            reject(error)
        })
    
	});
};


export const deleteRepo = async (id) => {
    let query1=`update repo set isdelete ='Y' where id = $1 RETURNING *`

	return new Promise(function (resolve,reject) {
		db.any(query1, [id]).then((data) => {
			resolve({status:"success"});
		}).catch((error)=>{
            reject(error)
        })
    
	});
};

export const deleteRepoByCompany = async (id) => {
    let query=`update repo set isdelete ='Y' where company_id = $1 RETURNING id`
    let query1=`update blog set status ='H',published='S'
     where
      repo_id in (select id from repo where company_id = $1) RETURNING *`

	return new Promise(function (resolve,reject) {
		db.any(query, [id]).then((d) => {
            console.log("test data return--->",d)
            db.any(query1, [id]).then((data) => {
                resolve({status:"success"});
            })
			
		}).catch((error)=>{
            reject(error)
        })
    
	});
};


export const getList = async (id) => {
    
    let query=`select * from repo r where company_id =${id}`

	return new Promise(function (resolve) {
		db.any(query, []).then((data) => { 
			resolve(data);
		});
	});
};