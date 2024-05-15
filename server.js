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
  connectionLimit: 10,
  queueLimit: 0
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

/* app.post('/api/addPlanToWatch', async(req, res) => {
  const { movie_id, release_date, title, genre_ids, user_id } = req.body;
  let connection = await pool.getConnection();
  try{
    await connection.beginTransaction();
    // Store user in database
    const result1 = await connection.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    console.log(result1);
    const result2 = await connection.query('SELECT * FROM genres WHERE genre_id = ?', [genre_ids[0]]);
    console.log(result2);
  }catch (error) {
    // If an error occurs, rollback the transaction
    await connection.rollback();
    console.error('Error executing queries:', error);
    res.status(500).send('Error executing queries');
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}); */

app.post('/api/addPlanToWatch',async (req, res) => {
  const { movie_id, release_date, title, genre_ids, user_id } = req.body;
  let movieNotInTable = await movieInTable(movie_id);
  console.log(movieNotInTable);
  /* if(movieNotInTable == 0){ */
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).send('Error getting connection from pool');
    }

    // Start a transaction
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error('Error starting transaction:', err);
        return res.status(500).send('Error starting transaction');
      }
      // Execute the first query
      connection.query(
        'SELECT * FROM users WHERE user_id = ?', [user_id],
        (err, result1) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error executing first query:', err);
              return res.status(500).send('Error executing first query');
            });
          }
          console.log(result1);

          // Execute the second query
          connection.query(
            'SELECT * FROM genres WHERE genre_id = ?', [genre_ids[0]],
            (err, result2) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error('Error executing second query:', err);
                  return res.status(500).send('Error executing second query');
                });
              }
                console.log(result2);
                connection.release();
                res.status(200).json({ message: 'Registration successful' });
              });
            }
          );
        }
      );
    });/* }else{
      console.log("movie exists");
      return res.status(500).send('Error getting connection from pool');
    } */
});

function movieInTable(movie_id){
  var rowlength = 0;
    pool.promise().query('SELECT * FROM movies WHERE movie_id = ?', [movie_id]).then(([rows, fields]) => {
      rowlength= rows.length
    })
    .catch(console.log)
    return new Promise(resolve => {
        resolve(rowlength);     
    });
}

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
