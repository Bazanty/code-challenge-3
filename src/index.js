document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/films/1")
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
                buyBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    sold = data.tickets_sold + 1;
                    let patchData = {
                        tickets_sold: sold,
                    }
                    fetch("http://localhost:3000/films/1", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(patchData)

                    })
                        .then((response) => response.json())
                        .then((data) => {
                            document.getElementById('ticket-num').innerText = data.capacity - data.tickets_sold;
                            console.log("success")
                        })
                })
            } else {
                buyBtn.innerText = "Sold Out";
            }

        })
        .catch((error) => {
            console.error("Error fetching the film data:", error);
        });
    function listMovies() {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then((data) => {
                const parentList = document.getElementById("films");
                data.forEach(film => {
                    const listItem = document.createElement('li');
                    listItem.textContent = film.title;
                    listItem.classList.add('film', 'item');
                    let movieId = film.id;
                    const deletBtn = document.createElement("button");
                    deletBtn.innerText = "Delete Film"
                    if ((film.capacity - film.tickets_sold) < 1) {
                        listItem.classList.add("sold-out")
                    }
                    deletBtn.onclick = () => {
                        function deleteFilm() {
                            fetch(`http://localhost:3000/films/${movieId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    listItem.remove()
                                    function postTicket() {
                                        let postData = {
                                            film_id: filmId,
                                            number_of_tickets: numerOfTickets
                                        }
                                        fetch(`http://localhost:3500/tickets`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify(postData)
                                        })
                                    }
                                })
                        }
                        deleteFilm()
                    }
                    listItem.appendChild(deletBtn)
                    parentList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching the films list:", error);
            });
    }
    listMovies()
});




