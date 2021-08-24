import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');

export const createRepo = async (data) => {
    const {name,status,companyId}=data
    let isdelete="N"

	const result = await prisma.repo.create({
		data: {
			repo_id: nanoid(11),
			name: name,
            company_id: Number(companyId),
            status:status,
            isdelete:isdelete,
            createddate:new Date()
		},
	});

	return bigIntToString(result);
    
    // let query1=`INSERT INTO repo (repo_id,name,company_id,status,isdelete,createddate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`

	// return new Promise(function (resolve,reject) {
	// 	db.any(query1, [nanoid(11),name,companyId,status,isdelete,new Date()]).then((data) => {
	// 		resolve(data);
	// 	}).catch((error)=>{
    //         reject(error)
    //     })
    
	// });
};

export const updateRepo = async (data) => {
    const {name,status,companyId,id}=data
	const result = await prisma.repo.update({
        where:{
            id:Number(id)
        },
		data: {
			name: name,
            company_id: Number(companyId),
            status:status,
            updateddate:new Date()
		},
	});

	return bigIntToString(result);
    
    // let query1=`INSERT INTO repo (repo_id,name,company_id,status,isdelete,createddate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`

	// return new Promise(function (resolve,reject) {
	// 	db.any(query1, [nanoid(11),name,companyId,status,isdelete,new Date()]).then((data) => {
	// 		resolve(data);
	// 	}).catch((error)=>{
    //         reject(error)
    //     })
    
	// });
};


export const deleteRepo = async (id) => {
    // let query1=`update repo set isdelete ='Y' where id = $1 RETURNING *`

	// return new Promise(function (resolve,reject) {
	// 	db.any(query1, [id]).then((data) => {
	// 		resolve({status:"success"});
	// 	}).catch((error)=>{
    //         reject(error)
    //     })
    
    // });

    const query1 =  prisma.repo.update({
		where: {
			id: Number(id),
		},
		data: {
            isdelete: 'Y',
		},
    });

    const query2= prisma.blog.updateMany({where: {
                            repo_id: Number(id),
                          },
                          data:{
                            status:"H",
                            published:"S"
                          }
                        });
    const [deleteRepo,upadateBlog] = await prisma.$transaction([query1, query2])

    // const result = await prisma.repo.update({
	// 	where: {
	// 		id: Number(id),
	// 	},
	// 	data: {
    //         isdelete: 'Y',
    //         blogs:{
    //             update:{
    //                 where: {
    //                     repo_id: Number(id),
    //                   },
    //                   data:{
    //                     status:"H",
    //                     published:"S"
    //                   }
    //             }
    //         }
	// 	},
    // });
    
    return bigIntToString(deleteRepo);
};

export const getList = async (id) => {
    
    // let query=`select * from repo r where company_id =${id}`

	// return new Promise(function (resolve) {
	// 	db.any(query, []).then((data) => { 
	// 		resolve(data);
	// 	});
    // });

    const result = await prisma.repo.findMany({
		where: {
            AND: [{ company_id: { equals: Number(id) || undefined } }, { isdelete: { equals: 'N' || undefined } }],
		},
		orderBy: {
			name: 'asc',
		},
	});
	return bigIntToString(result);
};

export const checkDuplicateName = async (name, companyId) => {
	const result = await prisma.repo.count({
		where: {
			name: name,
			company_id: Number(companyId),
		},
	});

	return result;
};

export const getRepo = async (id) => {

	const result = await prisma.repo.findUnique({
        where:{
            id:Number(id)
        }
		
    });
    return bigIntToString(result);
}

export const getRepoByNano = async (id) => {

	const result = await prisma.repo.findUnique({
        where:{
            repo_id:id
        }
		
    });
    return bigIntToString(result);
}