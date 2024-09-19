import mysql from 'mysql';

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mindfullife'
});

db.connect(function(error){
    if(error){
        throw error;
    } else {
        console.log("Conexion Exitosa!")
    }
});

db.end();