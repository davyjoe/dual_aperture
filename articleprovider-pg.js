var pg = require('pg');
var connectionString = process.env.DATABASE_URL; // || 'postgres://localhost:5432/da_posts';

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

function handleError(err, client, done){
    if (!err) {
        return false;
    }

    done(client);
    return true;
}

// ensure the table da_posts exists
pg.connect(connectionString, function(err, client, done){

    if (handleError(err, client, done)) {
        console.error('could not connect to postgres', err);
        return;
    }

    // connected; run query
    var qs = "CREATE TABLE IF NOT EXISTS da_posts(id SERIAL PRIMARY KEY, title VARCHAR(128), body text, createdate bigint)";
    client.query(qs, function(err, result){
        if (handleError(err, client, done)) {
            console.error('could not create table da_posts', err);
            return;
        }

        done();
    });
});


function ArticleProvider(){}

ArticleProvider.prototype.findAll = function(callback) {
    pg.connect(connectionString, function(err, client, done) {

        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to retrieve all da_posts rows', err);
            callback(err);
            return;
        }

        var query = client.query("SELECT * FROM da_posts ORDER BY id DESC");
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            done();
            callback(err, result.rows);
        });
        query.on('error', function(err){
            done(client);
            console.error('error reading da_posts rows', err);
        });
    });
};

ArticleProvider.prototype.findById = function(id, callback) {
    pg.connect(connectionString, function(err, client, done) {

        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to retrieve da_posts row by id', err);
            callback(err);
            return;
        }

        var query = client.query("SELECT * FROM da_posts WHERE id=" + id + " LIMIT 1");
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            done();
            callback(err, result.rows);
        });
        query.on('error', function(err){
            done(client);
            console.error('error reading da_posts row', err);
        });
    });
};

ArticleProvider.prototype.save = function(article, callback) {
    pg.connect(connectionString, function(err, client, done) {
        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to save new da_posts row', err);
            callback(err);
            return;
        }

        var query = client.query("INSERT INTO da_posts(title, body, createdate) values($1, $2, $3)", [article.title, article.body, new Date().valueOf()]);
        query.on('end', function() {
            done();
            callback(null, article);
        });
        query.on('error', function(err){
            done(client);
            console.error('error saving da_posts row', err);
        });
    });
};

ArticleProvider.prototype.update = function(article, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(handleError(err, client, done)) {
          console.error('could not connect to postgres to update da_posts row', err);
          callback(err);
          return;
        }

        var query = client.query("UPDATE da_posts SET title=($1), body=($2) WHERE id=($3)", [article.title, article.body, article.id]);
        query.on('end', function() {
            done();
            callback();
        });
        query.on('error', function(err){
            done(client);
            console.error('error updating da_posts row', err);
        });
    });

};

ArticleProvider.prototype.delete = function(id, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(handleError(err, client, done)) {
          console.error('could not connect to postgres to delete da_posts row', err);
          callback(err);
          return;
        }

        var query = client.query("DELETE FROM da_posts WHERE id=($1)", [id]);
        query.on('end', function() {
            done();
            callback();
        });
        query.on('error', function(err){
            done(client);
            console.error('error deleting da_posts row', err);
        });
    });
};

var articleProviderSingleton = new ArticleProvider();

module.exports = exports = articleProviderSingleton;
