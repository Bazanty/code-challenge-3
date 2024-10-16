document.addEventListener("DOMContentLoaded", () => {
    // Function to display film details based on ID
    function displayFilmDetails(id) {
        fetch(`http://localhost:3000/films/${id}`)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('title').innerText = data.title;
                document.getElementById('film-info').innerText = data.description;
                document.getElementById('showtime').innerText = data.showtime;
                document.getElementById('ticket-num').innerText = data.capacity - data.tickets_sold;
                document.getElementById('runtime').innerText = `${data.runtime} minutes`;
                document.getElementById('poster').src = data.poster;
                let buyBtn = document.getElementById("buy-ticket");
                if ((data.capacity - data.tickets_sold) > 0) {
                    buyBtn.innerText = "Buy Ticket";
                    buyBtn.disabled = false;
                    buyBtn.onclick = (event) => {
                        event.preventDefault();
                        let sold = data.tickets_sold + 1;
                        let patchData = {
                            tickets_sold: sold,
                        }
                        fetch(`http://localhost:3000/films/${id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(patchData)
                        })
                            .then((response) => response.json())
                            .then((updatedData) => {
                                document.getElementById('ticket-num').innerText = updatedData.capacity - updatedData.tickets_sold;
                                if ((updatedData.capacity - updatedData.tickets_sold) < 1) {
                                    buyBtn.innerText = "Sold Out";
                                    buyBtn.disabled = true;
                                    alert("All tickets for this movie are sold out!");
                                }
                                console.log("Ticket purchased successfully");
                            })
                            .catch((error) => {
                                console.error("Error updating the tickets sold:", error);
                            });
                    };
                } else {
                    buyBtn.innerText = "Sold Out";
                    buyBtn.disabled = true;
                    alert("All tickets for this movie are sold out!");
                }
            })
            .catch((error) => {
                console.error("Error fetching the film data:", error);
            });
    }

    // Display film details for film with ID 1
    displayFilmDetails(1);

    // Function to list all movies
    function listMovies() {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then((data) => {
                const parentList = document.getElementById("films");
                parentList.innerHTML = '';  // Clear the list first
                data.forEach(film => {
                    const listItem = document.createElement('li');
                    listItem.textContent = film.title;
                    listItem.classList.add('film', 'item');
                    let movieId = film.id;
                    const deleteBtn = document.createElement("button");
                    deleteBtn.innerText = "Delete Film";
                    if ((film.capacity - film.tickets_sold) < 1) {
                        listItem.classList.add("sold-out");
                    }
                    deleteBtn.onclick = (event) => {
                        event.stopPropagation(); // Prevent triggering the listItem click event
                        fetch(`http://localhost:3000/films/${movieId}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => response.json())
                            .then(() => {
                                listItem.remove();
                                alert("Film deleted successfully");
                            })
                            .catch((error) => {
                                console.error("Error deleting the film:", error);
                            });
                    };
                    listItem.onclick = () => displayFilmDetails(movieId);
                    parentList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching the films list:", error);
            });
    }

    // Function to show sold-out movies
    function showSoldOutMovies() {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then((data) => {
                const soldOutList = document.getElementById("sold-out-films");
                soldOutList.innerHTML = '';  // Clear the list first

                const soldOutFilms = data.filter(film => (film.capacity - film.tickets_sold) < 1);
                if (soldOutFilms.length === 0) {
                    soldOutList.innerHTML = "<p>No sold-out films available.</p>";
                } else {
                    soldOutFilms.forEach(film => {
                        const listItem = document.createElement('li');
                        listItem.textContent = film.title;
                        soldOutList.appendChild(listItem);
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching the sold-out films list:", error);
            });
    }

    // Function to search films by title
    function searchFilms() {
        const searchInput = document.getElementById("search-input");
        const searchButton = document.getElementById("search-button");

        searchButton.onclick = () => {
            const query = searchInput.value.toLowerCase();
            fetch("http://localhost:3000/films")
                .then((response) => response.json())
                .then((data) => {
                    const searchResults = data.filter(film => film.title.toLowerCase().includes(query));
                    const parentList = document.getElementById("films");
                    parentList.innerHTML = '';  // Clear the list first

                    if (searchResults.length === 0) {
                        parentList.innerHTML = "<p>No films found matching your search.</p>";
                    } else {
                        searchResults.forEach(film => {
                            const listItem = document.createElement('li');
                            listItem.textContent = film.title;
                            listItem.classList.add('film', 'item');
                            let movieId = film.id;
                            listItem.onclick = () => displayFilmDetails(movieId);
                            parentList.appendChild(listItem);
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching the films list for search:", error);
                });
        };
    }

    listMovies();
    showSoldOutMovies();
    searchFilms();
});
