const split = document.querySelector("#imdb-title-link").href.split("/");
const imdbId = split[split.length - 2];

function addLinkToElement(element, movie, search) {
    element.href = "#";
    element.onclick = thunkify(radarr_movie_add, [
        movie,
        true,
        search,
        function () {
            alert('Movie added successfully');
            updateCache();
        },
        function () {
            alert('Error adding movie');
        }
    ]);
}

function addAddLink(element, movie) {
    addLinkToElement(element, movie, false);
}

function addSearchLink(element, movie) {
    addLinkToElement(element, movie, true);
}

function setupLinks(movie) {
    const downloaded = movie.downloaded;
    const monitored = movie.monitored;

    const parentElement = document.querySelector(".linkbox");

    const textElement = document.createElement("span");
    textElement.innerHTML = " | Radarr: ";
    parentElement.appendChild(textElement);

    const addElement = document.createElement("a");
    if (monitored) {
        addElement.innerHTML = "[Already Added] ";
        addElement.style = "pointer-events: none; cursor: default; text-decoration: line-through";
    } else {
        addElement.innerHTML = "[Add] ";
        addAddLink(addElement, movie);
    }
    parentElement.appendChild(addElement);

    const searchElement = document.createElement("a");
    if (downloaded) {
        searchElement.innerHTML = "[Already Downloaded]";
        searchElement.style = "pointer-events: none; cursor: default; text-decoration: line-through";
    } else {
        searchElement.innerHTML = "[Search]";
        addSearchLink(searchElement, movie);
    }
    parentElement.appendChild(searchElement);

}

function main() {
    cachedMovie(imdbId, function(movie){
        if (!movie) {
            radarr_imdb_search(imdbId, function (res) {
                const movie = res.response;
                setupLinks(movie);
            }, function(res) {
                // Movie not found during search
            });
        } else {
            setupLinks(movie);
        }
    });
}

isFullyConfigured(main);





