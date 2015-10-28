
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Logger-ssh2' });
};

exports.anypage = function (req, res) {
	res.send('Welcome to the ' + req.params.page + ' page');
};