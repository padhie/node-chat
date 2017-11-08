function Database(parameter) {
    // Properties
    var config = {
        driver:     'mysql',
        host:       '',
        user:       '',
        password:   '',
        file:       '',
        database:   ''
    };
    var driver = null;
    var connection = null;
    var connected = false;


    // Constuctor
    if (typeof parameter.host != 'undefined' || typeof parameter.file != 'undefined') {
        this.setConfig(parameter);
        this.connect();
    }


    // Methods
    this.setConfig = function (configuration) {
        config = configuration;
    };
    this.connect = function () {
        if (config.driver == 'mysql') {
            driver = require('mysql');
            connection = driver.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });
            connection.connect();
            this.connected = true;
        }
    };
    this.isConnected = function () {
        return connected;
    };
    this.insert = function (query) {
        if (this.isConnected()) {
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
            });
        }
    };
}
module.exports = Database;