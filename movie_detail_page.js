const split = document.querySelector("#imdb-title-link").href.split("/");
const imdbId = split[split.length - 2];

isFullyConfigured(function(){
    cachedMovie(imdbId, function(movie){
        // Add information to page.
    });
});





