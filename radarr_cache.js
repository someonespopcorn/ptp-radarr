const CACHE_INTERVAL = 15;

function lastCacheTime(callback) {
    chrome.storage.local.get(["last_cache_time"], (res) => {
        callback(res["last_cache_time"] ? res["last_cache_time"] : 0);
    });
}

function updateCache() {
    radarr_movies(function(movies){
        chrome.storage.local.set({
            "movie_cache": movies.response,
            "last_cache_time": timeSeconds()
        });
    });
}

function movieCache(callback) {
    chrome.storage.local.get({"movie_cache": []}, (res) => {
        callback(res["movie_cache"]);
    });
}

function cachedMovie(imdbId, callback) {
    movieCache(function(movies){
        callback(movies.find(movie => (movie.imdbId === imdbId)));
    });
}

function main() {
    lastCacheTime(function(lastCache){
        if (timeSeconds() - lastCache > CACHE_INTERVAL){
            updateCache();
        }
    });
}

isFullyConfigured(main);