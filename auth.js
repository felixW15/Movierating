    // Define the fetch function to fetch data from the API
async function fetchDataFromAPI() {
    const url = 'http://localhost:3000/api/data'; // Change the URL as per your API endpoint

    const response = await fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data from API:', data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        return error;
      });
    
    createTable(response);
  }

function createTable(data) {
const div = document.getElementById('tableDiv');
div.innerHTML = "";
const table = document.createElement('table');
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');

// Append the table head and body to table
table.appendChild(tableHead);
table.appendChild(tableBody);

// Creating table head
let row = tableHead.insertRow();
Object.keys(data[0]).forEach((key, index)=> {
  let th = document.createElement('th');
  th.textContent = key;
  row.appendChild(th);
});

// Creating table body
data.forEach(item => {
  let row = tableBody.insertRow();
  Object.values(item).forEach((value, index) => {
    let cell = row.insertCell();
    cell.textContent = value;
});
});

// Append the table to the HTML document
div.appendChild(table);
}

function sendDataToAPI(data) {
const url = 'http://localhost:3000/api/post'; // Change the URL as per your API endpoint
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Specify the content type
  },
  body: JSON.stringify(data) // Convert data to JSON string
};

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Response from API:', responseData);
        })
        .catch(error => {
            console.error('Error sending data to API:', error);
        });
        }

// Example data
const postData = {
key1: 'value1',
key2: 'value2'
};

function registerUser(data) {
const url = 'http://localhost:3000/api/register'; // Change the URL as per your API endpoint
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Specify the content type
  },
  body: JSON.stringify(data) // Convert data to JSON string
};

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log('User Registered:', responseData);
        })
        .catch(error => {
            console.error('Error sending data to API:', error);
        });
        }   

function getRegisterData(){
const registerData = {
  username: document.getElementById('registerusername').value,
  email: document.getElementById('registeremail').value,
  password: document.getElementById('registerpassword').value
  };
return registerData
}
async function loginUser(data) {
const url = 'http://localhost:3000/api/login'; // Change the URL as per your API endpoint
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Specify the content type
  },
  body: JSON.stringify(data) // Convert data to JSON string
};

const token = await fetch(url, options)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Response from API:', responseData);
        return responseData;
    })
    .catch(error => {
        console.error('Error sending data to API:', error);
    });
    protectedRoute(token.token);
}

function getLoginData(){
const loginData = {
username: document.getElementById('loginusername').value,
password: document.getElementById('loginpassword').value
};
return loginData
}

function protectedRoute(data) {
const url = 'http://localhost:3000/api/protected'; // Change the URL as per your API endpoint
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${data}`
  },
};

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Response from protected API:', responseData);
            const userId = responseData.userId;
            console.log(userId)
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error sending data to API:', error);
        });
        }

document.getElementById('fetchButton').addEventListener('click', function() { fetchDataFromAPI(); }, false);
document.getElementById('postButton').addEventListener('click',  function() { sendDataToAPI(postData); }, false);
document.getElementById('registerButton').addEventListener('click',  function() { registerUser(getRegisterData()); }, false);
document.getElementById('loginButton').addEventListener('click',  function() { loginUser(getLoginData()); }, false);