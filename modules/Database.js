function Database(parameter) {
    // Properties
    var config = {
        driver:     'mysql',
        host:       '',
        user:       '',
        password:   '',
        file:       ':memory:',
        database:   ''
    };
    var connection = null;
    var connected = false;


    // Methods
    /**
     * Set congif for connection
     * @param configuration
     */
    this.setConfig = function (configuration) {
        config = configuration;
    };
    /**
     * Connect with driver
     */
    this.connect = function () {
        switch(config.driver) {
            case 'mysql':
                var driver = require('./Driver/Mysql');
                connection = driver.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });
                connection.connect();
                connected = true;
                break;

            case 'sqlite3':
                connection = require('./Driver/Sqlite');
                connection.setConfig({
                    file: config.file
                });
                connection.connect();
                connected = true;
                break;
        }
    };
    /**
     * Returns is connected
     * @returns {boolean}
     */
    this.isConnected = function () {
        return connected;
    };
    this.insert = function (query) {
        if (this.isConnected()) {
            connection.execute(query);
        }
    };
}
module.exports = Database;