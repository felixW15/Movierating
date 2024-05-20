window.onload = function(){
    if(sessionStorage.getItem("accessToken") == null){
        window.location.href = 'login.html';
    }else{
        protectedRoute(sessionStorage.getItem("accessToken"))
    }
};

var userId = 0;
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
                window.location.href = 'login.html';
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Response from protected API:', responseData);
                userId = responseData.userId;
                console.log(userId);
            })
            .catch(error => {
                window.location.href = 'login.html';
                console.error('Error sending data to API:', error);
            });
}

const profileIcon = document.getElementById("profileIcon");

profileIcon.onclick = function()
{
    if(sessionStorage.getItem("accessToken") == null){
        window.location.href = 'login.html';
    }else{
        protectedRouteProfile(sessionStorage.getItem("accessToken"))
    }
}

function protectedRouteProfile(data) {
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
                window.location.href = 'profile.html';
            })
            .catch(error => {
                console.error('Error sending data to API:', error);
            }  );
}

document.getElementById('movieButton').addEventListener('click',  function() { movieGet(1); }, false);
const searchInput = document.getElementById('searchInput');
let currentPage = 1; // Initial selected page


function createTable(data) {
    const div = document.getElementById('tableDiv');
    div.innerHTML = "";
    const table = document.createElement('table');
    table.classList.add("movieTable");
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Append the table head and body to table
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Creating table head
    let row = tableHead.insertRow();
    let th = document.createElement('th');
    row.appendChild(th);
    Object.keys(data[0]).forEach((key, index)=> {
    if(((index < 7)&& (index > 4)) || index == 9){
        let th = document.createElement('th');
        th.textContent = key;
        row.appendChild(th);
    }
    });
    let th2 = document.createElement('th');
    row.appendChild(th2);

    // Creating table body
    data.forEach(item => {
    let row = tableBody.insertRow();
    let cell = row.insertCell();
    var src = 'https://image.tmdb.org/t/p/w154' + item.poster_path;
    var img = document.createElement('img');
    img.src = src;
    cell.appendChild(img);
    Object.values(item).forEach((value, index) => {
        if(((index < 7)&& (index > 4)) || index == 9){
        let cell = row.insertCell();
        cell.textContent = value;
    }});
    var movie_id = [];
    movie_id.push(item.id);
    let cell2 = row.insertCell();
    
    var btn3 = document.createElement('button');
    btn3.innerHTML = "Get emails";
    btn3.addEventListener("click", (async function(e){
        currentMovie = movie_id[0];
        //const movieDetails =  await movieGetDetails(movieDetail_id);
        modalLabel.innerHTML = item.title;
        modal.style.display = "block";
        //createDetailTable(movieDetails);
    }));
    cell2.appendChild(btn3);
    });
    div.appendChild(table);
}
var currentMovie = 0;
var radioSelected;

var modal = document.getElementById("myModal");
var modalLabel = document.getElementById("modalLabel");
var spanModal = document.getElementsByClassName("close")[0];
var getMailBtn = document.getElementById("getEmail");

getMailBtn.addEventListener("click", (async function(e){
    radioSelected = document.querySelector('input[name="radio"]:checked').value;
    const mailByMovieData= {
        movie_id: currentMovie,
        radioType: radioSelected
    }
    const response = await getMailByMovie(mailByMovieData);
    createEmailTable(response);
}));

spanModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        console.log(spanModal);
      modal.style.display = "none";
    }
}

async function getMailByMovie(userId){
    const url = 'http://localhost:3000/api/getMailByMovie'; // Change the URL as per your API endpoint
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify the content type
      },
      body: JSON.stringify(userId) // Convert data to JSON string
    };
    
    const data = await fetch(url, options)
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
    return data;
}

async function movieGet(pageNumber) {
    var searchQuery = searchInput.value;
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${pageNumber}&api_key=3344fd8a1c2c21473fa19c4774b39258`
    const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer '
    }
    };
    
        const response = await fetch(url, options)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Response from movie API:', responseData);
                return responseData;
            })
            .catch(error => {
                console.error('Error sending data to API:', error);
            });
        var toast = document.getElementById("mtoast");        
        if(response.results == ""){
            const div = document.getElementById('tableDiv');
            div.innerHTML = "";
            toast.innerHTML = "No matching movies found";
            toast.style.display = 'block';
        }else{
            toast.style.display = 'none';
            totalPages=response.total_pages;
            createTable(response.results);
            generatePagination();
        }
    }

function generatePagination() {
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = ''; // Clear previous pagination
    
        // Always include the first page
        createPageButton(1, paginationDiv);
    
        // Calculate the range of pages to display
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
    
        // Display ellipsis if needed
        if (startPage > 2) {
            paginationDiv.appendChild(createEllipsis());
        }
    
        // Generate buttons for each page in the range
        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i, paginationDiv);
        }
    
        // Display ellipsis if needed
        if (endPage < totalPages - 1) {
            paginationDiv.appendChild(createEllipsis());
        }
    
        // Always include the last page
        if (totalPages > 1){
            createPageButton(totalPages, paginationDiv);
        }
}

function createPageButton(pageNumber, parentElement) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    button.classList.add("paginationBtn");
    button.addEventListener('click', () => {
        currentPage = pageNumber;
        generatePagination();
        movieGet(pageNumber);
    });
    parentElement.appendChild(button);
}

function createEllipsis() {
    const ellipsisSpan = document.createElement('span');
    ellipsisSpan.textContent = '...';
    return ellipsisSpan;
}

function createEmailTable(data) {
    const div = document.getElementById('modalTable');
    div.innerHTML = "";
    const table = document.createElement('table');
    table.classList.add("detailTable");
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Append the table head and body to table
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    // Creating table head
    let row = tableHead.insertRow();
    let th = document.createElement('th');
    th.textContent = "Email";
    row.appendChild(th);
    let thStatus = document.createElement('th');
    thStatus.textContent = "Username";
    row.appendChild(thStatus);
    
    data.forEach(item =>{
        let row = tableBody.insertRow();
        Object.values(item).forEach((value, index) => {
            let cell = row.insertCell();
            cell.textContent = value;
        });
    })
    div.appendChild(table);
}
