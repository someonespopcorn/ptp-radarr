function base_radarr_request(url, method, params, success, failure) {
    chrome.storage.sync.get({
        'radarr_base_url': '',
        'radarr_api_key': ''
    }, (res) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, res.radarr_base_url + url, true);
        xhr.responseType = "json";
        xhr.setRequestHeader('X-Api-Key', res.radarr_api_key);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    success(xhr);
                } else {
                    failure(xhr);
                }
            }
        };
        if (params) {
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    })
}

function radarr_quality_profiles(success, failure) {
    base_radarr_request("/api/profile", "GET", null, success, failure);
}

function radarr_root_folders(success, failure) {
    base_radarr_request("/api/rootfolder", "GET", null, success, failure);
}

function radarr_movies(success, failure) {
    base_radarr_request("/api/movie", "GET", null, success, failure);
}

function radarr_imdb_search(imdbId, success, failure) {
    base_radarr_request("/api/movie/lookup/imdb?imdbId=" + imdbId, "GET", null, success, failure);
}

function radarr_movie_add(movie, monitor, search, success, failure) {
    // If the movie is already added, don't add again. Just search
    if (search && movie.id) {
        base_radarr_request("/api/command", "POST", {name: "MoviesSearch", movieIds: [movie.id]}, success, failure);
    } else {
        chrome.storage.sync.get(['default_quality_profile', 'default_root_folder'], (res) => {
            options = {
                title: movie.title,
                qualityProfileId: movie.quality_profile_id || res.default_quality_profile, // Use already listed id if not 0
                titleSlug: movie.titleSlug,
                images: movie.images,
                tmdbId: movie.tmdbId,
                year: movie.year,
                rootFolderPath: movie.root_folder_path || res.default_root_folder,
                monitored: monitor
            };
            if (search) {
                options["searchForMovie"] = true;
            }

            base_radarr_request("/api/movie", "POST", options, success, failure);
        });
    }
}

