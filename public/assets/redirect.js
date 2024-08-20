// redirect.js
(function () {
    var currentPath = window.location.pathname + window.location.search;
    //var indexPath = "/tabito.release/index.html";
    var indexPath = "/index.html";

    // Check if we're already on the index page with a path parameter
    if (window.location.pathname === indexPath && window.location.search.includes("?path=")) {
        // Extract the path parameter
        var params = new URLSearchParams(window.location.search);
        var path = params.get('path');
        if (path) {
            // Update the browser's URL to reflect the original path
            history.replaceState(null, '', path);
        }
    } else {
        // Redirect to the index page with the original path as a query parameter
        window.location.replace(indexPath + "?path=" + encodeURIComponent(currentPath));
    }
})();
