const mysql = require('mysql2');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'Youtube',
    dateStrings : true
});

// connection.query(
//     'SELECT * FROM `users`',
//     function(err, results, fields) {
//         var {id, email, name,created_at} = results[0];
//         console.log(results);
//     }
// );

module.exports = connection