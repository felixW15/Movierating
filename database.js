var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'testuser';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  var sql = "GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'testuser'@'localhost' WITH GRANT OPTION;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  var sql = "SELECT User, Host, authentication_string FROM mysql.user";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});