var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

/* con.connect(function(err) {
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
}); */
 
/* con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='mydb'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
}); */
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT title FROM movies";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
/* 
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT release_date FROM movies";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result[0].release_date.toLocaleString("en-US", {timeZone: 'Europe/Berlin' }).split(" ")[0]);
  });
}); */
/* 
const insertMovies = (movies) => {
  const sql = 'INSERT INTO genres (genre_id, name) VALUES (?, ?)';

  movies.forEach((movie) => {
    con.query(sql, [movie.id, movie.name], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log('Inserted data with ID:', results.insertId);
      }
    });
  });
};*/