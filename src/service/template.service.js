import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');


export const create = (body) => {
    console.log("create templte method call----->", body)
    const { name, content } = body;
    let status = `A`;
    let isDelete = `N`;
    let date=new Date();
    let query = 'INSERT INTO templates(name,status,temp_id,is_delete,content,created_date) VALUES($1, $2, $3, $4,$5,$6) RETURNING *';
    return new Promise(function (resolve, reject) {
      db.one(query, [name, status,nanoid(11), isDelete, JSON.stringify(content),date])
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
  
  export const updateTemplateById = async (updateBody) => {
    console.log("update temp call---->", updateBody)
    const { id, name, content, status } = updateBody;
    let date=new Date();
      let query = `update templates set name=$1,status=$2,content=$3,updated_date=$4 where id=$5  RETURNING *`;
    
    return new Promise(function (resolve, reject) {
      db.one(query, [name, status, JSON.stringify(content), date,id])
        .then((data) => {
          console.log('data updated successfully: ' + data.id); // print new user id;
          resolve(data)
        })
        .catch((error) => {
          console.log('object.. error ' + JSON.stringify(error));
          reject(error)
        });
    });
  };
  
  export const getById = (id) => {
  let query='select * from  templates  where id = $1';
    return new Promise(function (resolve, reject) {
      db.any(query, [id])
        .then((data) => {
          console.log("Successfully get data", data)
          resolve(data[0])
        })
        .catch((error) => {
          console.log('error ...' + error);
          reject(error)
        });
    })
  }
  
  export const getByTemplateName = (name) => {
  let query="select * from templates where name = $1 and is_delete='N'";
    return new Promise(function (resolve, reject) {
      db.any(query, [name])
        .then((data) => {
          console.log("Successfully get data", data)
          resolve(data)
        })
        .catch((error) => {
          console.log('error ...' + error);
          reject(error)
        });
    })
  
  }
  export const getByNano = (name) => {
    let query="select * from templates where temp_id = $1 and is_delete='N'";
      return new Promise(function (resolve, reject) {
        db.any(query, [name])
          .then((data) => {
            console.log("Successfully get data", data)
            resolve(data)
          })
          .catch((error) => {
            console.log('error ...' + error);
            reject(error)
          });
      })
    
    }
  
  export const getByTemplatId = (id) => {
  
    return new Promise(function (resolve, reject) {
      db.any('select * from templates where templateid = $1', [id])
        .then((data) => {
          console.log("Successfully get data", data)
          resolve(data)
        })
        .catch((error) => {
          console.log('error ...' + error);
          reject(error)
        });
    })
  }
  
  export const getAllTemplates = (req) => {
    let query = "select * from  templates where is_delete='N'";
    return new Promise(function (resolve, reject) {
      db.any(query)
        .then((data) => {
          console.log("Successfully getAll datas", data.length)
          resolve(data)
        })
        .catch((error) => {
          console.log('error ...', error);
          reject(error)
        });
    })
  
  }
  
  export const deleteById = (id) => {
    let query = 'update templates set is_delete=$2 where id = $1';
    let status="Y"
    return new Promise(function (resolve, reject) {
      db.any(query, [id,status])
        .then((data) => {
          console.log("data deleted successfully", data)
          resolve(data)
        })
        .catch((error) => {
          console.log('error ...' + error);
          reject(error)
        });
    })
  }
  