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
/* con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "DESCRIBE plan_to_watch";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
}); */
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

const genres = [
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
    }]

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  const sql = 'INSERT INTO genres (genre_id, name) VALUES (?, ?)';
  const movies = genres; 
  movies.forEach((movie) => {
    con.query(sql, [movie.id, movie.name], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log('Inserted data with ID:', results.insertId);
      }
    });
  });
});

/* SELECT DISTINCT users.email
FROM users
JOIN (
    SELECT user_id
    FROM plan_to_watch
    WHERE movie_id = 123
    UNION
    SELECT user_id
    FROM watched
    WHERE movie_id = 123
) AS combined
ON users.user_id = combined.user_id; */