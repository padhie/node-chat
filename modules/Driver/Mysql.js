function Mysql() {
    // Properties
    var driver = require('mysql');
    var config = {};
    var result = [];
    var connection = null;


    // Methods
    /**
     * + Set config
     * @param configuration
     */
    this.setConfig = function (configuration) {
        config = configuration;
    };
    /**
     * connect to database
     */
    this.connect = function () {
        connection = driver.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });
        connection.connect();
    };
    /**
     * Execute a query with result
     * @param sqlQuery
     */
    this.query = function (sqlQuery) {
        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                throw err;
            }
            result = rows;
        });
    };
    /**
     * Execute a query without result
     * @param sqlQuery
     */
    this.execute = function (sqlQuery) {
        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                throw err;
            }
        });
    };
    /**
     * Return the whole result
     * @returns array
     */
    this.getResult = function () {
        return result;
    };
    /**
     * Return the first result
     * @returns object
     */
    this.getSingleResult = function () {
        return result[0];
    }
}

module.exports = Mysql;