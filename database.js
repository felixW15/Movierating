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
const data = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT * FROM genres";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
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
};

insertMovies(data); */
/* 
RowDataPacket {
  Field: 'rating',
  Type: 'decimal(3,2)',
  Null: 'YES',
  Key: '',
  Default: null,
  Extra: '' */