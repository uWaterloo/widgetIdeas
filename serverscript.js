// DATABASE
// keys: CREATE TABLE keys(id NVARCHAR(50) PRIMARY KEY, value NVARCHAR(255))

const API_BASE = 'https://uwportal.uservoice.com/api/v1';

/**
 * getKeys()
 * Returns the keys stored in the database.
 *
 * Returned in KVP format (e.g keys[key] = value)
 */
function getKeys() {
    var keys = {};
    var rkeys = JSON.parse(db.Execute('SELECT * FROM keys'));
    
    for (var i in rkeys) {
        keys[rkeys[i]['id']] = rkeys[i]['value'];
    }
    
    return keys;
}

/**
 * getSuggestions()
 * Loads all available suggestions.
 */
function getSuggestions() {
    var keys = getKeys();
    
    // TODO: Properly handle pagination, so the day (we hope!) when there are more than 500
    // 		 suggetsions, we get them all.
    return proxy.GetProxy(API_BASE + '/suggestions.json?per_page=500&client=' + keys['secret']);
}// End of getSuggestions method

/**
 * getComments(suggestion)
 * Loads the comments for the given suggestion.
 * 	suggestion: Suggestion object to load comments for.
 */
function getComments() {
    var keys = getKeys();
    var path = args.Get('path');
    // TODO: Again, handle the pagination
    return proxy.GetProxy(API_BASE + path + '/comments.json?per_page=500&client=' + keys['secret']);
}// End of getComments method
