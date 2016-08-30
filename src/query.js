'use strict';
function query(db, queryString, data){
  return new Promise((resolve, reject) => {
    db.query(
      queryString, 
      data, 
      (err, results) => err ? reject(err) : resolve(results)
    );
  });
}
module.exports = query;