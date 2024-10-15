document.addEventListener("DOMContentLoaded", () => {
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
                                console.log("success");
                            })
                            .catch((error) => {
                                console.error("Error updating the tickets sold:", error);
                            });
                    };
                } else {
                    buyBtn.innerText = "Sold Out";
                }
            })
            .catch((error) => {
                console.error("Error fetching the film data:", error);
            });
    }

    displayFilmDetails(1);

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
                    deleteBtn.onclick = () => {
                        fetch(`http://localhost:3000/films/${movieId}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => response.json())
                            .then(() => {
                                listItem.remove();
                                console.log("successfully");
                            })
                            .catch((error) => {
                                console.error("Error deleting the film:", error);
                            });
                    };
                    listItem.appendChild(deleteBtn);
                    listItem.onclick = () => displayFilmDetails(movieId);
                    parentList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching the films list:", error);
            });
    }

    listMovies();
});
