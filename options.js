function loadUserConfiguration() {
    loadQualityProfiles();
    loadRootFolders();
}

function restoreOptions() {
    loadFormValue('radarr_base_url', 'radarr_base_url', '');
    loadFormValue('radarr_api_key', 'radarr_api_key', '');
    loadUserConfiguration();
}

function saveAuthOptions(e) {
    chrome.storage.sync.set({
        radarr_base_url: document.querySelector("#radarr_base_url").value,
        radarr_api_key: document.querySelector("#radarr_api_key").value
    });
    if (e) {
        e.preventDefault();
    }
}

function saveQualityProfiles(profiles) {
    chrome.storage.sync.set({
        quality_profiles: profiles.map(profile => ({id: profile.id, name: profile.name}))
    });
}

function saveRootFolders(folders) {
    chrome.storage.sync.set({
        root_folders: folders.map(folder => ({path: folder.path}))
    });
}

function saveDefaults() {
    chrome.storage.sync.set({
        default_quality_profile: document.querySelector("#quality_profiles").value,
        default_root_folder: document.querySelector("#root_folders").value
    });
}

function loadQualityProfiles() {
    loadSelectorWithDefault('quality_profiles', 'quality_profiles', 'name', 'id', 'default_quality_profile');
}

function loadRootFolders() {
    loadSelectorWithDefault('root_folders', 'root_folders', 'path', 'path', 'default_root_folder');
}

function testConnection() {
    saveAuthOptions();
    radarr_movies(() => {
        document.querySelector("#connection_status").innerHTML = "Successful connection!";

        radarr_quality_profiles((xhr) => {
            saveQualityProfiles(xhr.response);
            loadQualityProfiles();
        });

        radarr_root_folders((xhr) => {
            saveRootFolders(xhr.response);
            loadRootFolders();
        });
    }, (xhr) => {
        document.querySelector("#connection_status").innerHTML = "Bad connection: code" + xhr.status;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions, false);
document.querySelector("#radarr_auth_button").addEventListener("click", saveAuthOptions);
document.querySelector("#test_connection").addEventListener("click", testConnection);
document.querySelector("#save_defaults").addEventListener("click", saveDefaults);
