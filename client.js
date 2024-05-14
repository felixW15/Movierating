
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
    let th = document.createElement('th');
    th.textContent = "image";
    row.appendChild(th);
    Object.keys(data[0]).forEach((key, index)=> {
    if((index < 7)&& (index > 2)){
        let th = document.createElement('th');
        th.textContent = key;
        row.appendChild(th);
    }
    });
    let th2 = document.createElement('th');
    th.textContent = "buttons";
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
        if((index < 7)&& (index > 2)){
        let cell = row.insertCell();
        cell.textContent = value;
    }});
    let cell2 = row.insertCell();
    var btn = document.createElement('button');
    btn.innerHTML = "Add to watchlist";
    btn.addEventListener("click", (function(e){
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        if (target) {
            var cells = target.getElementsByTagName("td");
            data.push(cells[1].innerHTML);
        } 
        console.log(data[0]);
    }));
    cell2.appendChild(btn);
    var btn2 = document.createElement('button');
    btn2.innerHTML = "Plan to watch";
    btn2.addEventListener("click", (function(e){
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        if (target) {
            var cells = target.getElementsByTagName("td");
            data.push(cells[2].innerHTML);
        } 
        console.log(data[0]);
    }));
    cell2.appendChild(btn2);
    var btn3 = document.createElement('button');
    btn3.innerHTML = "Details";
    btn3.addEventListener("click", (function(e){
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        if (target) {
            var cells = target.getElementsByTagName("td");
            data.push(cells[3].innerHTML);
        } 
        console.log(data[0]);
    }));
    cell2.appendChild(btn3);
    });
    div.appendChild(table);
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
            console.log('Response from protected API:', responseData);
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

document.getElementById('movieButton').addEventListener('click',  function() { movieGet(1); }, false);
const searchInput = document.getElementById('searchInput');

var totalPages = 10;
let currentPage = 1; // Initial selected page

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

window.onload = function(){
    if(sessionStorage.getItem("accessToken") == null){
        window.location.href = 'login.html';
    }else{
        protectedRoute(sessionStorage.getItem("accessToken"))
    }
};
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
                const userId = responseData.userId;
                console.log(userId);
            })
            .catch(error => {
                console.error('Error sending data to API:', error);
            });
            }

function createPageButton(pageNumber, parentElement) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
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