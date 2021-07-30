import handler from '../handler';
import { getDB } from '../../../dbconfig/db';
const { db } = getDB();


export default handler
// create method
.get('/api/template/crud/get/:id', async (req, res) => {
    let id = Number(req.params.id)
    let data=null;
    data=await getById(id);
    if(data == null)
         res.send({"message":"Nodata found"});
    else
         res.send(data);
})
.get(async (req, res) => {
    let data=await getAll();
    if(data != null && data.length > 0)
        res.send(data);
    else
        res.send({"message":"Nodata found"})
})
.post(async (req, res) => {
        const { name, content } = req.body;
        const errors = [];
        const isdata = await checkDuplicateNames(name);

        if (isdata > 0) {
            errors.push('Duplicate entry');
            if (errors.length > 0) {
                res.status(200).json({ errors });
                return;
            }
        }

        let result=await create(req.body)
        res.status(201).send(result);
    })
    .put(async(req,res)=>{
        const { name, content } = req.body;
        const errors = [];
        const isdata = await checkDuplicateNames(name);

        if (isdata > 0) {
            errors.push('Duplicate entry');
            if (errors.length > 0) {
                res.status(200).json({ errors });
                return;
            }
        }

        let result=await update(req.body)
        // const returnValue = bigIntToString(result);
        res.status(200).send(result);
    }).delete('/api/template/crud/:id', async (req, res) => {
        let id = Number(req.params.id)

       let data=await deleteById(id);
        res.send({"message":"success"});
    });


const checkDuplicateNames = async(name) => {
    console.log("checkDuplicateNames templte method call----->", name)
    let query=`select count(*) from templates where name=$1`;
  
    return new Promise(function (resolve, reject) {
    db.one(query, [name])
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          console.log('object.. error ' + JSON.stringify(error));
          reject(error)
        });
    });
  }

  const getAll = async() => {
    let query=`select * from templates where isdelete='N'`;
  
    return new Promise(function (resolve, reject) {
    db.manyOrNone(query, [])
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          console.log('object.. error ' + JSON.stringify(error));
          reject(error)
        });
    });
  }

 export const getById = async(id) => {
    console.log("get by ID templte method call----->", id)
    let query=`select * from templates where id=$1 and isdelete='N'`;
  
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


const create = (body) => {
    console.log("create templte method call----->", body)
    const {name, content } = body;
    let status = `A`;
    let isDelete = `N`;
    let query='INSERT INTO templates(name,status,isdelete,content) VALUES($1, $2, $3, $4) RETURNING *';
  
    return new Promise(function (resolve, reject) {
    db.one(query, [name ,status, isDelete, JSON.stringify(content)])
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
    console.log("update templte method call----->", body)
    const {id,name, content,status } = body;
    let query=`update templates set name=$1,status=$2,content=$3 where id=$4  RETURNING *`;
  
    return new Promise(function (resolve, reject) {
    db.one(query, [name ,status, JSON.stringify(content),id])
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
    let query=`update templates set isdelete=$2 where id=$1  RETURNING *`;
  
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