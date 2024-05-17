
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
    var movie_title = [];
    movie_title.push(item.title);
    var movie_date = [];
    movie_date.push(item.release_date);
    var movie_genres = [];
    movie_genres.push(item.genre_ids);
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
        const rect = btn.getBoundingClientRect();
        // Set the popup position
        popup.style.left = `${rect.left - rect.width - 200}px`;
        popup.style.top = `${rect.top - rect.height}px`;
        popup_wrapper.style.display = 'block';
        addWatchedBtn.addEventListener("click", (function(e){
            const watched_data = {
                movie_id: movie_id[0],
                release_date: movie_date[0],
                title: movie_title[0],
                genre_ids: movie_genres[0],
                rating: rating.value,
                user_id: userId
            }
            if(rating.value>10 || rating.value <1){
                modal.style.display = "block";
                modalLabel.innerHTML = "please enter a value between 1 and 10";
            }else{
                addWatched(watched_data);
            }
        }))
    }));
    cell2.appendChild(btn);
    var btn2 = document.createElement('button');
    btn2.innerHTML = "Plan to watch";
    btn2.addEventListener("click", (function(e){
        const ptw_data = {
            movie_id: movie_id[0],
            release_date: movie_date[0],
            title: movie_title[0],
            genre_ids: movie_genres[0],
            user_id: userId
        }
        addPlanToWatch(ptw_data);
    }));
    cell2.appendChild(btn2);
    var btn3 = document.createElement('button');
    btn3.innerHTML = "Details";
    btn3.addEventListener("click", (async function(e){
        const movieDetail_id = movie_id[0];
        const movieDetails =  await movieGetDetails(movieDetail_id);
        modal.style.display = "block";
        modalLabel.innerHTML = movieDetails.title;
        createDetailTable(movieDetails);
    }));
    cell2.appendChild(btn3);
    });
    div.appendChild(table);
}

function getValuesByKeyName(obj, keyName) {
    const values = [];
    Object.entries(obj).forEach(([key, value]) => {
      if (key === keyName) {
        values.push(value);
      }
    });
    return values;
  }

function createDetailTable(data) {
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
    row.appendChild(th);
    Object.keys(data).forEach((key, index)=> {
    if(((index < 6)&& (index > 3))){
        let th = document.createElement('th');
        th.textContent = key;
        row.appendChild(th);
    }
    });
    let thStatus = document.createElement('th');
    thStatus.textContent = "Status";
    row.appendChild(thStatus);
    // Creating table body
    
    let row2 = tableBody.insertRow();
    let cell = row2.insertCell();
    var src = 'https://image.tmdb.org/t/p/w300' + data.backdrop_path;
    var img = document.createElement('img');
    img.src = src;
    cell.appendChild(img);
    Object.values(data).forEach((value, index) => {
        if((index == 4)){
            let cell = row2.insertCell();
            const genres = value.map(genre =>  " "+ genre.name);
            console.log(genres)
            cell.textContent = genres;
        }else if(((index < 6)&& (index > 4)) ){
        let cell = row2.insertCell();
        cell.textContent = value;
    }});
    let cellStatus = row2.insertCell();
    cellStatus.textContent = data.status;
    let row3 = tableBody.insertRow();
    let row4 = tableBody.insertRow();
    let thOverview = document.createElement('th');
    thOverview.textContent = "Overview";
    row3.appendChild(thOverview);
    let cellOverview = row4.insertCell();
    cellOverview.textContent = data.overview;
    let thBudget = document.createElement('th');
    thBudget.textContent = "Budget";
    row3.appendChild(thBudget);
    let cellBudget = row4.insertCell();
    cellBudget.textContent = data.budget + " $";
    let thRevenue = document.createElement('th');
    thRevenue.textContent = "Revenue";
    row3.appendChild(thRevenue);
    let cellRevenue = row4.insertCell();
    cellRevenue.textContent = data.revenue + " $";
    let thRuntime = document.createElement('th');
    thRuntime.textContent = "Runtime";
    row3.appendChild(thRuntime);
    let cellRuntime = row4.insertCell();
    cellRuntime.textContent = data.runtime + " min";
    div.appendChild(table);
}

var modal = document.getElementById("myModal");
var popup_wrapper = document.getElementById("popup-wrapper");
var modalLabel = document.getElementById("modalLabel");
var span = document.getElementsByClassName("close")[0];
var spanModal = document.getElementsByClassName("close")[1];
var rating = document.getElementById("quantity");
var addWatchedBtn = document.getElementById("addWatchedButton");

span.onclick = function() {
    popup_wrapper.style.display = "none";
}
spanModal.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target == popup_wrapper) {
        popup_wrapper.style.display = "none";
      }
}

function addPlanToWatch(data) {
    const url = 'http://localhost:3000/api/addPlanToWatch'; // Change the URL as per your API endpoint
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
                modal.style.display = "block";
                modalLabel.innerHTML = responseData.message;
                console.log('Added plan to watch', responseData);
            })
            .catch(error => {
                console.error('Error sending data to API:', error);
            });
}

function addWatched(data) {
    const url = 'http://localhost:3000/api/addWatched'; // Change the URL as per your API endpoint
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
                            modal.style.display = "block";
                            modalLabel.innerHTML = responseData.message;
                            console.log('Added watched', responseData);
                        })
                        .catch(error => {
                            console.error('Error sending data to API:', error);
                        });
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

async function movieGetDetails(movie_id) {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US&api_key=3344fd8a1c2c21473fa19c4774b39258`
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
            return response;
            /* totalPages=response.total_pages;
            createTable(response.results);
            generatePagination(); */
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