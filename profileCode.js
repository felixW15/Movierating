
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

const ptwButton = document.getElementById("ptwButton");

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
    });
    div.appendChild(table);
    }else{
        window.alert("no Movies in plan to watch");
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