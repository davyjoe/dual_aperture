var pg = require('pg');
var connectionString = process.env.DATABASE_URL; // || 'postgres://localhost:5432/da_subscribers';

function handleError(err, client, done){
    if (!err) {
        return false;
    }

    done(client);
    return true;
}


// create table, if needed
//var connection = new pg.Client(connectionString);
/*
connection.connect(function(err) {
    if (err) {
        console.error('could not connect to postgres', err);
    } else {
        console.log('Connected to postgres!');
    }
    return;
});
*/

// ensure the table da_subscribers exists
pg.connect(connectionString, function(err, client, done){

    if (handleError(err, client, done)) {
        console.error('could not connect to postgres', err);
        return;
    }

    // connected; run query
    var qs = "CREATE TABLE IF NOT EXISTS da_subscribers(id SERIAL PRIMARY KEY, emailaddr VARCHAR(128), subscribedate bigint)";
    client.query(qs, function(err, result){
        if (handleError(err, client, done)) {
            console.error('could not create table da_subscribers', err);
            return;
        }

        done();
    });
});

function SubscriberProvider(){}

SubscriberProvider.prototype.findAll = function(callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to retrieve all da_subscribers rows', err);
            callback(err);
            return;
        }

        var query = client.query("SELECT * FROM da_subscribers ORDER BY id;");
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            done();
            callback(err, result.rows);
        });
        query.on('error', function(err){
            done(client);
            console.error('error reading da_subscribers rows', err);
        });
    });
};

SubscriberProvider.prototype.save = function(subscriberEmail, callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to save new da_subscribers row', err);
            callback(err);
            return;
        }

        var query = client.query("INSERT INTO da_subscribers(emailaddr, subscribedate) values($1, $2)", [subscriberEmail, new Date().valueOf()]);
        query.on('end', function() {
            done();
            callback(null, subscriberEmail);
        });
        query.on('error', function(err){
            done(client);
            console.error('error saving da_subscribers row', err);
        });
    });
};

SubscriberProvider.prototype.delete = function(id, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(handleError(err, client, done)) {
          console.error('could not connect to postgres to delete da_subscribers row', err);
          callback(err);
          return;
        }

        var query = client.query("DELETE FROM da_subscribers WHERE id=($1)", [id]);
        query.on('end', function() {
            done();
            callback();
        });
        query.on('error', function(err){
            done(client);
            console.error('error deleting da_subscribers row', err);
        });
    });
};

var subscriberProviderSingleton = new SubscriberProvider();

module.exports = exports = subscriberProviderSingleton;
