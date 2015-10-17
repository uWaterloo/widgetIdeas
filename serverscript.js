// DATABASE
// keys: CREATE TABLE keys(id NVARCHAR(50) PRIMARY KEY, value NVARCHAR(255))

const API_BASE = 'https://uwportal.uservoice.com/api/v1';

function getKeys() {
    var keys = {};
    var rkeys = JSON.parse(db.Execute('SELECT * FROM keys'));
    
    for (var i in rkeys) {
        keys[rkeys[i]['id']] = rkeys[i]['value'];
    }
    
    return keys;
}

function getSuggestions() {
    var keys = getKeys();
    return proxy.GetProxy(API_BASE + '/suggestions.json?client=' + keys['secret']);
}