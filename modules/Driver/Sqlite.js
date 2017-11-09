function Sqlite() {
    // Properties
    var driver = require('sqlite3');
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
        connection = new driver.Database(config.file);
    };
    /**
     * Execute a query with result
     * @param sqlQuery
     */
    this.query = function (sqlQuery) {
        connection.serialize(function() {
            db.each(sqlQuery, function(err, row) {
                if(err) {
                    throw err;
                }
                result.push(row);
            });
        });
    };
    /**
     * Execute a query without result
     * @param sqlQuery
     */
    this.execute = function (sqlQuery) {
        connection.serialize(function() {
            db.run(sqlQuery);
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

module.exports = Sqlite;