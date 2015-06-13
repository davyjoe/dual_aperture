function UserProvider(){}

UserProvider.prototype.dummyUsers = [
    { id: 1, username: 'admin', password: 'dualap2015', email: 'youngcha@gmail.com' },
    { id: 2, username: 'david', password: 'passme', email: 'davyjoe@gmail.com' }
];

UserProvider.prototype.findById = function (id, callback) {
    var idx = id - 1;
    if (this.dummyUsers[idx]) {
        callback(null, this.dummyUsers[idx]);
    } else {
        callback(new Error('Invalid credentials. Please try again.'));
    }
};

UserProvider.prototype.findByUsername = function (username, callback) {
    for (var i = 0, len = this.dummyUsers.length; i < len; i++) {
        var user = this.dummyUsers[i];
        if (user.username === username) {
            return callback(null, user);
        }
    }
    return callback(null, null);
};


var userProviderSingleton = new UserProvider();

module.exports = exports = userProviderSingleton;
