const noteRoutes = require('./note_routes');
const projectRoutes = require('./project_routes');
const defaultRoutes = require('./default_route');
const fileRoutes = require('./file_routes');
const json_download_routes = require('./json_download_routes');

// new normal way - >
const api_project_route = require('./api_project_route');




module.exports = function(app, db) {
    noteRoutes(app, db);
    projectRoutes(app, db);
    defaultRoutes(app, db);
    fileRoutes(app, db);
    json_download_routes(app, db);

    // new normal way 
    api_project_route(app, db);
};