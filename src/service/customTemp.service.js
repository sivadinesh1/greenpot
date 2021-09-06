import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../dbconfig/prisma';

export const create = (body) => {
    console.log("create custom templte method call----->", body)
    const { template_id, repo_id ,content} = body;
    let status = `A`;
    let isDelete = `N`;
    let date=new Date();
    let query = 'INSERT INTO custom_template(template_id,status,ctemp_id,content,is_delete,repo_id,created_date) VALUES($1, $2, $3, $4,$5,$6,$7) RETURNING *';
    return new Promise(function (resolve, reject) {
      db.one(query, [template_id, status,nanoid(11),JSON.stringify(content), isDelete,repo_id ,date])
        .then((data) => {
          console.log('new inserted id: ' + data.id); 
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
    const { id, template_id ,content, status } = updateBody;
    let date=new Date();
      let query = `update custom_template set template_id=$1,status=$2,content=$3,updated_date=$4 where id=$5  RETURNING *`;
    
    return new Promise(function (resolve, reject) {
      db.one(query, [template_id, status, JSON.stringify(content), date,id])
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
  
  export const getCustomTemp = (id) => {
  let query='select * from  custom_template  where id = $1';
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
    let query = 'update custom_template set is_delete=$2 where id = $1';
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
  