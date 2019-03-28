function loadFormValue(id, value, default_value) {
    let options = {};
    options[value] = default_value;
    chrome.storage.sync.get(options, (res) => {
        document.querySelector("#" + id).value = res[value];
    });
}

function loadToHtmlSelect(selector_id, storage_key, name_key, value_key){
    let options = {};
    options[storage_key] = [];
    chrome.storage.sync.get(options, (res) => {
        selector = document.querySelector("#" + selector_id);
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
        for (let idx in res[storage_key]) {
            let option = res[storage_key][idx];
            let child = document.createElement("option");
            child.text = option[name_key];
            child.value = option[value_key];
            selector.appendChild(child);
        }
    });
}

function setSelectedValue(selector_id, value) {
    const selector = document.querySelector("#" + selector_id);
    const options = selector.options;
    for (let i = 0, optionsLength = options.length; i < optionsLength; i++) {
        if (options[i].value == value) {
            selector.selectedIndex = i;
            return true;
        }
    }
    return false;
}

function loadSelectorWithDefault(selector_id, storage_id, name_key, value_key, default_value_storage_key) {
    loadToHtmlSelect(selector_id, storage_id, name_key, value_key);

    let options = {};
    options[default_value_storage_key] = '';
    chrome.storage.sync.get(options, (res) => {
        setSelectedValue(selector_id, res[default_value_storage_key]);
    });
}
