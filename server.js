const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { jwtDecode } = require('jwt-decode');
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "testuser",
  password: "testuser",
  database: "mydb",
  waitForConnections: true,
  connectionLimit: 100,
  port:3307
});
app.use(express.json());

// Define API endpoint
app.get('/api/data', (req, res) => {
  pool.query('SELECT * FROM customers', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/post', (req, res) => {
  const { key1, key2 } = req.body;

  // Insert data into the database
  pool.query(
    'INSERT INTO customers (name, address) VALUES (?, ?)',
    [key1, key2],
    (error, results, fields) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'Data inserted successfully' });
    }
  );
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  // Hash password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const admin = 1;
    // Store user in database
    pool.query('INSERT INTO users (username, email, password, admin) VALUES (?, ?, ?, ?)', [username, email, hash, admin], (err, result) => {
      if (err) {
        res.status(400).json({ error: 'Registration failed' });
        return;
      }
      res.status(200).json({ message: 'Registration successful' });
    });
  });
});

app.post('/api/addPlanToWatch',async (req, res) => {
  const { movie_id, release_date, title, genre_ids, user_id } = req.body;
  let movieNotInTable = await movieInTable(movie_id);
  if(movieNotInTable == 0){
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).send('Error getting connection from pool');
    }
    // Start a transaction
    /* connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error('Error starting transaction:', err);
        return res.status(500).send('Error starting transaction');
      } */
      const formattedDate = new Date(release_date).toISOString().split('T')[0];
      // Execute the first query
      connection.query(
        'INSERT INTO movies (movie_id, release_date, title) VALUES (?, ?, ?)', [movie_id, formattedDate, title],
        (err, result1) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error executing first query:', err);
              return res.status(500).send('Error executing first query');
            });
          }
          // Execute the second query
        connection.query(
        'INSERT INTO plan_to_watch (user_id, movie_id) VALUES (?, ?)', [user_id, movie_id],
        (err, result2) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error executing first query:', err);
              return res.status(500).send('Error executing first query');
            });
          }
          // Execute the third query
          genre_ids.forEach(element => {
          connection.query(
            'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)', [movie_id, element],
            (err, result3) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Error executing second query:', err);
                  return res.status(500).send('Error executing second query');
                });
              }
              });
            });
            res.status(200).json({ message: 'Successfully added the movie to your plan to watch list' });
            connection.release();
            }
            );
          }
          );
        }
      );
    /* }); */ }else{
      let notInPlanToWatch = await inPlanToWatch(movie_id, user_id);
      if(notInPlanToWatch == 0){
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).send('Error getting connection from pool');
        }
        connection.query(
          'INSERT INTO plan_to_watch (user_id, movie_id) VALUES (?, ?)', [user_id, movie_id],
          (err, result2) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error executing first query:', err);
                return res.status(500).send('Error executing first query');
              });
            }
            connection.release();
          })});

      return res.status(200).json({message: 'Successfully added the movie to your plan to watch list'});
      }else{
        return res.status(200).json({message: 'The movie is already in your plan to watch list'});
      }
    }
});

app.post('/api/addWatched',async (req, res) => {
  const { movie_id, release_date, title, genre_ids, rating, user_id } = req.body;
  let movieNotInTable = await movieInTable(movie_id);
  if(movieNotInTable == 0){
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).send('Error getting connection from pool');
    }
      const formattedDate = new Date(release_date).toISOString().split('T')[0];
      // Execute the first query
      connection.query(
        'INSERT INTO movies (movie_id, release_date, title) VALUES (?, ?, ?)', [movie_id, formattedDate, title],
        (err, result1) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error executing first query:', err);
              return res.status(500).send('Error executing first query');
            });
          }
          // Execute the second query
        connection.query(
        'INSERT INTO watched (user_id, movie_id, rating) VALUES (?, ?, ?)', [user_id, movie_id, rating],
        (err, result2) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error executing first query:', err);
              return res.status(500).send('Error executing first query');
            });
          }
          // Execute the third query
          genre_ids.forEach(element => {
          connection.query(
            'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)', [movie_id, element],
            (err, result3) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Error executing second query:', err);
                  return res.status(500).send('Error executing second query');
                });
              }
              });
            });
            res.status(200).json({ message: 'Successfully added the movie to your watched list' });
            connection.release();
            }
            );
          }
          );
        }
      );
    }else{
      let notInWatched = await inWatched(movie_id, user_id);
      if(notInWatched == 0){
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting connection from pool:', err);
          return res.status(500).send('Error getting connection from pool');
        }
        connection.query(
          'INSERT INTO watched (user_id, movie_id, rating) VALUES (?, ?, ?)', [user_id, movie_id, rating],
          (err, result2) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error executing first query:', err);
                return res.status(500).send('Error executing first query');
              });
            }
            connection.release();
          })});

      return res.status(200).json({message: 'Successfully added the movie to your watched list'});
      }else{
        return res.status(200).json({message: 'The movie is already in your watched list'});
      }
    }
});

async function movieInTable(movie_id){
  var rowlength = 0;
    await pool.promise().query('SELECT * FROM movies WHERE movie_id = ?', [movie_id]).then(([rows, fields]) => {
      rowlength= rows.length;
    })
    .catch(console.log)
    return new Promise(resolve => {
        resolve(rowlength);     
    });
}

async function inPlanToWatch(movie_id, user_id){
  var rowlength = 0;
    await pool.promise().query('SELECT * FROM plan_to_watch WHERE movie_id = ? AND user_id = ?', [movie_id,user_id]).then(([rows, fields]) => {
      rowlength= rows.length;
    })
    .catch(console.log)
    return new Promise(resolve => {
        resolve(rowlength);     
    });
}

async function inWatched(movie_id, user_id){
  var rowlength = 0;
    await pool.promise().query('SELECT * FROM watched WHERE movie_id = ? AND user_id = ?', [movie_id,user_id]).then(([rows, fields]) => {
      rowlength= rows.length;
    })
    .catch(console.log)
    return new Promise(resolve => {
        resolve(rowlength);     
    });
}

app.post('/api/getPlanToWatch', (req, res) => {
  const { user_id } = req.body;
  pool.query('SELECT * FROM plan_to_watch WHERE user_id = ?',[user_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/getWatched', (req, res) => {
  const { user_id } = req.body;
  pool.query('SELECT * FROM watched WHERE user_id = ?',[user_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/getMailByMovie', (req, res) => {
  const { movie_id, radioType } = req.body;
    if(radioType == 2){
      pool.query('SELECT DISTINCT users.email, users.username FROM users JOIN (SELECT user_id FROM plan_to_watch WHERE movie_id = ? UNION SELECT user_id FROM watched WHERE movie_id = ?) AS combined ON users.user_id = combined.user_id;',[movie_id, movie_id], (error, results, fields) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json(results);
      });
    }else if(radioType == 0){
      pool.query('SELECT DISTINCT users.email, users.username FROM users JOIN (SELECT user_id FROM watched WHERE movie_id = ? ) AS combined ON users.user_id = combined.user_id;',[movie_id], (error, results, fields) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json(results);
      });
    }else if(radioType == 1){
      pool.query('SELECT DISTINCT users.email, users.username FROM users JOIN (SELECT user_id FROM plan_to_watch WHERE movie_id = ?) AS combined ON users.user_id = combined.user_id;',[movie_id], (error, results, fields) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json(results);
      });
    }
});

app.post('/api/getAdmin', (req, res) => {
  const { user_id } = req.body;
  pool.query('SELECT admin FROM users WHERE user_id = ?',[user_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({results});
  });
});

app.post('/api/deletePlanToWatch', (req, res) => {
  const { movie_id, user_id } = req.body;
  pool.query('DELETE FROM plan_to_watch WHERE user_id = ? AND movie_id = ?',[user_id,movie_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/deleteWatched', (req, res) => {
  const { movie_id, user_id } = req.body;
  pool.query('DELETE FROM watched WHERE user_id = ? AND movie_id = ?',[user_id,movie_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Retrieve user from database
  pool.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err || result.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    const user = result[0];
    // Compare passwords
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err || !passwordMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      // Generate JWT
      const token = jwt.sign({ user_id: user.user_id }, 'abc', { expiresIn: '1h' });
      res.status(200).json({token});
    });
  });
});

app.get('/api/protected', verifyToken, (req, res) => {
  const userId = req.userId;
  res.status(200).json({ message: 'Protected route', userId: userId});
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'no token' });
  }
  jwt.verify(token, 'abc', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.user_id;
    next();
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
