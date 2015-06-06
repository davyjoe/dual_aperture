var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/da_posts';

var connection = new pg.Client(connectionString);
connection.connect(function(err) {
    if (err) {
        console.error('could not connect to postgres', err);
    } else {
        console.log('Connected to postgres!');
    }
    return;
});
// ensure the table exists
var query = connection.query("CREATE TABLE IF NOT EXISTS da_posts(id SERIAL PRIMARY KEY, title VARCHAR(128), body text, createdate bigint);");
query.on('end', function() { connection.end(); });

function ArticleProvider(){}

ArticleProvider.prototype.findAll = function(callback) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query("SELECT * FROM da_posts ORDER BY id DESC;");
        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            callback(err, results);
        });

        if(err) {
          console.log(err);
        }
    });
};

ArticleProvider.prototype.findById = function(id, callback) {
    var result = null;
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            console.log(err);
            callback(err, result);
            return;
        }

        var query = client.query("SELECT * FROM da_posts WHERE id=" + id + " LIMIT 1;");
        query.on('row', function(row) {
            result = row;
        });

        query.on('end', function() {
            client.end();
            callback(err, result);
        });
    });
};

ArticleProvider.prototype.save = function(article, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(err) {
            console.log(err);
            callback(err, article);
            return;
        }

        var query = client.query("INSERT INTO da_posts(title, body, createdate) values($1, $2, $3)", [article.title, article.body, new Date().valueOf()]);
        query.on('end', function() {
            client.end();
            callback(null, article);
        });
    });
};

ArticleProvider.prototype.update = function(article, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(err) {
          console.log(err);
          callback(err);
          return;
        }

        var query = client.query("UPDATE da_posts SET title=($1), body=($2) WHERE id=($3)", [article.title, article.body, article.id]);
        query.on('end', function() {
            client.end();
            callback();
        });
    });

};

ArticleProvider.prototype.delete = function(id, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(err) {
          console.log(err);
          callback(err);
          return;
        }

        var query = client.query("DELETE FROM da_posts WHERE id=($1)", [id]);
        query.on('end', function() {
            client.end();
            callback();
        });
    });
};

var articleProviderSingleton = new ArticleProvider();

module.exports = exports = articleProviderSingleton;
