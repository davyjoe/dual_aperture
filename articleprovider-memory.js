var articleCounter = 1;

function ArticleProvider(){}

ArticleProvider.prototype.dummyData = [];

ArticleProvider.prototype.findAll = function(callback) {
	callback( null, this.dummyData.sort(function(a, b){
        // by decending id
        if (a.id < b.id){
            return 1;
        } else if (a.id > b.id){
            return -1;
        } else {
            return 0;
        }
    }) );
};

ArticleProvider.prototype.findById = function(id, callback) {
	var result = null;
	for(var i =0;i<this.dummyData.length;i++) {
		if( this.dummyData[i].id == id ) {
			result = this.dummyData[i];
			break;
		}
	}
	callback(null, result);
};

ArticleProvider.prototype.save = function(articles, callback) {
	if( typeof(articles.length)=="undefined")
		articles = [articles];

	for( var i =0;i< articles.length;i++ ) {
		var article = articles[i];
		article.id = articleCounter++;
		//article.createdate = new Date();
		this.dummyData[this.dummyData.length] = article;
	}
	callback(null, articles);
};

ArticleProvider.prototype.update = function(article, callback) {
    this.findById(article.id, function(error, result){
        if (error){
            callback(error);
        } else if (!result){
            callback("Article " + article.id + " not found!");
        } else {
            result.title = article.title;
            result.body = article.body;
            callback();
        }
    });
};

ArticleProvider.prototype.delete = function(id, callback) {
    var dummyData = this.dummyData;
    this.findById(id, function(error, result){
        if (error){
            callback(error);
        } else if (!result){
            callback("Article " + id + " not found!");
        } else {
            dummyData.splice(dummyData.indexOf(result), 1);
            callback();
        }
    });
};

var articleProviderSingleton = new ArticleProvider();

/* Lets bootstrap with dummy data */
articleProviderSingleton.save([
	{title: 'Post one', body: 'Body one'},
	{title: 'Post two', body: 'Body two'},
	{title: 'Post three', body: 'Body three'}
], function(error, articles){});

module.exports = exports = articleProviderSingleton;
