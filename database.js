var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "testuser",
  password: "testuser",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO customers (name,address) VALUES ('max', 'Musterstraße 12');";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table altered");
  });
});