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
                if (xhr.status === 200) {
                    success(xhr);
                } else {
                    failure(xhr);
                }
            }
        };
        if (params) {
            xhr.send(params);
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

