
window.onload = async function(){
    if(sessionStorage.getItem("accessToken") == null){
        window.location.href = 'login.html';
    }else{
        await protectedRoute(sessionStorage.getItem("accessToken"));
        const user_id = {user_id: userId};
        const admin = await getAdmin(user_id);
        if(admin.results[0].admin == 0){
            adminButton.style.display = "block";
        }else if(admin.results[0].admin == 1){
            console.log("is not admin");
        }
    }
};
var userId = 0;
async function protectedRoute(data) {
    const url = 'http://localhost:3000/api/protected'; // Change the URL as per your API endpoint
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${data}`
      },
    };
    
        await fetch(url, options)
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
            })
            .catch(error => {
                window.location.href = 'login.html';
                console.error('Error sending data to API:', error);
            });
}

async function getAdmin(userId){
    const url = 'http://localhost:3000/api/getAdmin'; // Change the URL as per your API endpoint
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

const ptwButton = document.getElementById("ptwButton");
const watchedButton = document.getElementById("watchedButton");
const adminButton = document.getElementById("adminButton");

ptwButton.onclick = async function(){
    const user_id = {user_id: userId};
    const ptwData = await getPlanToWatch(user_id);
    if(ptwData.length > 0){
    const div = document.getElementById('tableDiv');
    div.innerHTML = "";
    const table = document.createElement('table');
    table.classList.add("movieTable");
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    // Append the table head and body to table
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    let row = tableHead.insertRow();
    let th = document.createElement('th');
    th.textContent = "Plan to watch list";
    row.appendChild(th);
    let thTitle = document.createElement('th');
    thTitle.textContent = "Title";
    row.appendChild(thTitle);
    let thOverview = document.createElement('th');
    thOverview.textContent = "Overview";
    row.appendChild(thOverview);
    let threleaseDate = document.createElement('th');
    threleaseDate.textContent = "release Date";
    row.appendChild(threleaseDate);
    let th2 = document.createElement('th');
    row.appendChild(th2);

    Object.values(ptwData).forEach(async(value, index) => {
        const movieDetails =  await movieGetDetails(value.movie_id);
        let row = tableBody.insertRow();
        let cell = row.insertCell();
        var src = 'https://image.tmdb.org/t/p/w154' + movieDetails.poster_path;
        var img = document.createElement('img');
        img.src = src;
        cell.appendChild(img);
        let cellTitle = row.insertCell();
        cellTitle.textContent = movieDetails.title;
        let cellOverview = row.insertCell();
        cellOverview.textContent = movieDetails.overview;
        let cellDate = row.insertCell();
        cellDate.textContent = movieDetails.release_date;
        let cell2 = row.insertCell();
        var btn3 = document.createElement('button');
        btn3.innerHTML = "Details";
        btn3.addEventListener("click", (async function(e){
            modal.style.display = "block";
            modalLabel.innerHTML = movieDetails.title;
            createDetailTable(movieDetails);
        }));
        cell2.appendChild(btn3);
        var btn2 = document.createElement('button');
        btn2.innerHTML = "Delete Entry";
        btn2.addEventListener("click", (async function(e){
            const rect = btn2.getBoundingClientRect();
            // Set the popup position
            popup.style.left = `${rect.left - rect.width - 200}px`;
            popup.style.top = `${rect.top - rect.height}px`;
            popup_wrapper.style.display = 'block';
            deleteBtn.addEventListener("click", (function(e){
                const ptw_delete = {
                    movie_id: movieDetails.id,
                    user_id: userId
                }
                deletePlanToWatch(ptw_delete);
                popup_wrapper.style.display = "none";
                ptwButton.click();
            }))
        }));
        cell2.appendChild(btn2);
    });
    div.appendChild(table);
    }else{
        window.alert("no Movies in plan to watch");
    }
}

watchedButton.onclick = async function(){
    const user_id = {user_id: userId};
    const watchedData = await getWatched(user_id);
    if(watchedData.length > 0){
    const div = document.getElementById('tableDiv');
    div.innerHTML = "";
    const table = document.createElement('table');
    table.classList.add("movieTable");
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    // Append the table head and body to table
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    let row = tableHead.insertRow();
    let th = document.createElement('th');
    th.textContent = "Your watched movies";
    row.appendChild(th);
    let thTitle = document.createElement('th');
    thTitle.textContent = "Title";
    row.appendChild(thTitle);
    let thOverview = document.createElement('th');
    thOverview.textContent = "Overview";
    row.appendChild(thOverview);
    let threleaseDate = document.createElement('th');
    threleaseDate.textContent = "release Date";
    row.appendChild(threleaseDate);
    let thRating = document.createElement('th');
    thRating.textContent = "Your Rating";
    row.appendChild(thRating);
    let th2 = document.createElement('th');
    row.appendChild(th2);

    Object.values(watchedData).forEach(async(value, index) => {
        const movieDetails =  await movieGetDetails(value.movie_id);
        let row = tableBody.insertRow();
        let cell = row.insertCell();
        var src = 'https://image.tmdb.org/t/p/w154' + movieDetails.poster_path;
        var img = document.createElement('img');
        img.src = src;
        cell.appendChild(img);
        let cellTitle = row.insertCell();
        cellTitle.textContent = movieDetails.title;
        let cellOverview = row.insertCell();
        cellOverview.textContent = movieDetails.overview;
        let cellDate = row.insertCell();
        cellDate.textContent = movieDetails.release_date;
        let cellRating = row.insertCell();
        cellRating.textContent = value.rating;
        let cell2 = row.insertCell();
        var btn3 = document.createElement('button');
        btn3.innerHTML = "Details";
        btn3.addEventListener("click", (async function(e){
                modal.style.display = "block";
                modalLabel.innerHTML = movieDetails.title;
                createDetailTable(movieDetails);
        }));
        cell2.appendChild(btn3);
        var btn2 = document.createElement('button');
        btn2.innerHTML = "Delete Entry";
        btn2.addEventListener("click", (async function(e){
            const rect = btn2.getBoundingClientRect();
            // Set the popup position
            popup.style.left = `${rect.left - rect.width - 200}px`;
            popup.style.top = `${rect.top - rect.height}px`;
            popup_wrapper.style.display = 'block';
            deleteBtn.addEventListener("click", (function(e){
                const watched_delete = {
                    movie_id: movieDetails.id,
                    user_id: userId
                }
                deleteWatched(watched_delete);
                popup_wrapper.style.display = "none";
                watchedButton.click();
            }))
        }));
        cell2.appendChild(btn2);
    });
    div.appendChild(table);
    }else{
        window.alert("no Movies in plan to watch");
    }
}

var modal = document.getElementById("myModal");
var modalLabel = document.getElementById("modalLabel");
var spanModal = document.getElementsByClassName("close")[1];
var popup_wrapper = document.getElementById("popup-wrapper");
var span = document.getElementsByClassName("close")[0];
var deleteBtn = document.getElementById("addWatchedButton");

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

async function getPlanToWatch(userId){
    const url = 'http://localhost:3000/api/getPlanToWatch'; // Change the URL as per your API endpoint
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

async function getWatched(userId){
    const url = 'http://localhost:3000/api/getWatched'; // Change the URL as per your API endpoint
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

async function deletePlanToWatch(ptwData){
    const url = 'http://localhost:3000/api/deletePlanToWatch'; // Change the URL as per your API endpoint
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify the content type
      },
      body: JSON.stringify(ptwData) // Convert data to JSON string
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

async function deleteWatched(ptwData){
    const url = 'http://localhost:3000/api/deleteWatched'; // Change the URL as per your API endpoint
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify the content type
      },
      body: JSON.stringify(ptwData) // Convert data to JSON string
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