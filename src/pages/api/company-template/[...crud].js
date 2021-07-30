import handler from '../handler';
import { getDB } from '../../../dbconfig/db';
const { db } = getDB();

export default handler
    .get('/api/company-template/crud/get/:id', async (req, res) => {
        let id = Number(req.params.id)
        const result=await getCompnayTemp(id);
        res.status(200).json(result);
        
    })
    .get( async (req, res) => {
        const data = await getAllCompnayTemp();
        if(data != null && data.length > 0)
        res.send(data);
        else
        res.send({"message":"Nodata found"})

    }).post(async (req, res) => {
        console.log("test company template---->",req.body)

    //     const {templateid, companyid } = req.body;
    //     const errors = [];
    //     if(templateid === 'undefined')
    //     {
    //             errors.push('Template id required');
    //         if (errors.length > 0) {
    //             res.status(200).json({ errors });
    //             return;
    //         }
    //     }

    //   let company=await getById(templateid)
    //   console.log("test pemplate---->",company)
    //   if(company === 'undefined')
    //     {
    //             errors.push('template not found');
    //         if (errors.length > 0) {
    //             res.status(200).json({ errors });
    //             return;
    //         }
    //     }

        let result=await create(req.body);
        res.status(201).send(result);
    }).delete('/api/company-template/crud/:id', async (req, res) => {
        let id = Number(req.params.id)
       await deleteById(id);
        res.send({"message":"success"});
    }).put(async(req,res)=>{
        let result=await update(req.body)
        res.status(200).send(result);
    })
    ;

    const create = (body) => {
        console.log("create company_template method call----->", body)
        const {templateid, companyid } = body;
        let status = `A`;
        let isDelete = `N`;
        let query='INSERT INTO company_template(templateid,companyid,status,isdelete) VALUES($1, $2, $3, $4) RETURNING *';
      
        return new Promise(function (resolve, reject) {
        db.one(query, [templateid, companyid, status,isDelete])
            .then((data) => {
              console.log('new inserted id: ' + data.id); // print new user id;
              resolve(data)
            })
            .catch((error) => {
              console.log('object.. error ' + JSON.stringify(error));
              reject(error)
            });
        });
      }
    
      const update = (body) => {
        console.log("update company templte method call----->", body)
        const {id,templateid, companyid,status } = body;
        let query=`update company_template set templateid=$1,companyid=$2,status=$3 where id=$4  RETURNING *`;
      
        return new Promise(function (resolve, reject) {
        db.one(query, [templateid, companyid ,status,id])
            .then((data) => {
              console.log('data updated successfully ' + data.id); // print new user id;
              resolve(data)
            })
            .catch((error) => {
              console.log('object.. error ' + JSON.stringify(error));
              reject(error)
            });
        });
      }

      const deleteById =async (id) => {
        console.log("delete templte method call----->", id)
        let isdelete="Y"
        let query=`update company_template set isdelete=$2 where id=$1  RETURNING *`;
      
        return new Promise(function (resolve, reject) {
        db.one(query, [id,isdelete])
            .then((data) => {
              console.log('data updated successfully ' + data.id); // print new user id;
              resolve(data)
            })
            .catch((error) => {
              console.log('object.. error ' + JSON.stringify(error));
              reject(error)
            });
        });
      }

const getAllCompnayTemp = async () =>{
    console.log("test data ---->",)
    let query=`select * from company_template where isdelete='N'`;
  
    return new Promise(function (resolve, reject) {
    db.many(query, [])
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          console.log('object.. error ' + JSON.stringify(error));
          reject(error)
        });
    });
}

const getCompnayTemp = async (id) =>{
    console.log("test data ---->",id)
    let query=`select * from company_template where id=$1 and isdelete='N'`;
  
    return new Promise(function (resolve, reject) {
    db.oneOrNone(query, [id])
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          console.log('object.. error ' + JSON.stringify(error));
          reject(error)
        });
    });
}












