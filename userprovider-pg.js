var pg = require('pg');
var connectionString = process.env.DATABASE_URL; // || 'postgres://localhost:5432/da_posts';


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

    //email, user, pass, company, interest, agreement, (subscribe), role* (admin|user)

    // connected; run query
    var qs = "CREATE TABLE IF NOT EXISTS da_users(" +
        "id SERIAL PRIMARY KEY, " +
        "username VARCHAR(64), " +
        "password VARCHAR(64), " +
        "email VARCHAR(256), " +
        "company VARCHAR(128), " +
        "interests text, " +
        "role VARCHAR(16), " +
        "createdate bigint" +
    ")";

    client.query(qs, function(err, result){
        if (handleError(err, client, done)) {
            console.error('could not create table da_users', err);
            return;
        }

        done();
    });
});


function UsersProvider(){}

UsersProvider.prototype.findAll = function(callback) {
    pg.connect(connectionString, function(err, client, done) {

        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to retrieve all da_users rows', err);
            callback(err);
            return;
        }

        var query = client.query("SELECT * FROM da_users ORDER BY id DESC");
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            done();
            callback(err, result.rows);
        });
        query.on('error', function(err){
            done(client);
            console.error('error reading da_users rows', err);
        });
    });
};

var superadmin = {
    id: 0,
    username: "admin",
    password: "dualap2015",
    email: "davyjoe@gmail.com",
    company: "",
    interests: "",
    role: "admin",
    createdate: 1
};

UsersProvider.prototype.findById = function(id, callback) {
    // superadmin
    if (id === 0){
        callback(null, [superadmin]);
        return;
    }

    pg.connect(connectionString, function(err, client, done) {

        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to retrieve da_users row by id', err);
            callback(err);
            return;
        }

        var query = client.query("SELECT * FROM da_users WHERE id=" + id + " LIMIT 1");
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            done();
            callback(err, result.rows);
        });
        query.on('error', function(err){
            done(client);
            console.error('error reading da_users row', err);
        });
    });
};

UsersProvider.prototype.findByUsername = function(un, callback) {
    // superadmin
    if (un === superadmin.username){
        callback(null, [superadmin]);
        return;
    }

    pg.connect(connectionString, function(err, client, done) {

        if (handleError(err, client, done)) {
            console.error('could not connect to postgres to retrieve da_users row by username', err);
            callback(err);
            return;
        }

        console.log("looking up un " + un);

        var query = client.query("SELECT * FROM da_users WHERE username='" + un + "' LIMIT 1");
        query.on('row', function(row, result) {
            result.addRow(row);
        });
        query.on('end', function(result) {
            done();
            callback(err, result.rows);
        });
        query.on('error', function(err){
            done(client);
            console.error('error reading da_users row', err);
        });
    });
};

UsersProvider.prototype.save = function(userObj, callback) {
    // make sure user doesn't exist
    if (userObj.username === superadmin){
        callback("Username already exists!");
        return;
    }

    this.findByUsername(userObj.username, function(err, result){
        if (err){
            callback(err);
            return;
        }

        if (result.length){
            callback("Username already exists! Please try again.");
            return;
        }

        // create user
        pg.connect(connectionString, function(err, client, done) {
            if (handleError(err, client, done)) {
                console.error('could not connect to postgres to save new da_users row', err);
                callback(err);
                return;
            }

            // combine interests and interestsOther; ie. "{interests}; other:{interestsOther}"
            var interestsAll = userObj.interests;
            if (userObj.interestsOther) {
                if (interestsAll) {
                    interestsAll += "; ";
                }
                interestsAll += "other: " + userObj.interestsOther;
            }

            var query = client.query("INSERT INTO da_users(" +
                    "username, " +
                    "password, " +
                    "email, " +
                    "company, " +
                    "interests, " +
                    "role, " +
                    "createdate" +
                ") values($1, $2, $3, $4, $5, $6, $7)", [
                    userObj.username, 
                    userObj.password,
                    userObj.email,
                    userObj.company,
                    interestsAll,
                    "user",
                    new Date().valueOf()
                ]);
            query.on('end', function() {
                done();
                callback(null);
            });
            query.on('error', function(err){
                done(client);
                console.error('error saving da_users row', err);
            });
        });
    });
};

UsersProvider.prototype.update = function(userObj, callback) {
    // no db entry for superadmin
    if (userObj.id === 0){
        callback(null, userObj);
    }

    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(handleError(err, client, done)) {
          console.error('could not connect to postgres to update da_users row', err);
          callback(err);
          return;
        }

        var query = client.query("UPDATE da_users SET " +
                "username=($1), " +
                "password=($2), " +
                "email=($3), " +
                "company=($4), " +
                "interests=($5), " +
                "role=($6) " +
                "WHERE id=($7) ", 
            [
                userObj.username, 
                userObj.password, 
                userObj.email, 
                userObj.company, 
                userObj.interests, 
                userObj.role, 
                userObj.id
            ]
        );
        query.on('end', function() {
            done();
            callback();
        });
        query.on('error', function(err){
            done(client);
            console.error('error updating da_users row', err);
        });
    });

};

UsersProvider.prototype.delete = function(id, callback) {
    pg.connect(connectionString, function(err, client, done) {
        // Handle Errors
        if(handleError(err, client, done)) {
          console.error('could not connect to postgres to delete da_users row', err);
          callback(err);
          return;
        }

        var query = client.query("DELETE FROM da_users WHERE id=($1)", [id]);
        query.on('end', function() {
            done();
            callback();
        });
        query.on('error', function(err){
            done(client);
            console.error('error deleting da_users row', err);
        });
    });
};

var usersProviderSingleton = new UsersProvider();

module.exports = exports = usersProviderSingleton;
