// 根据文件路径获取文件名和文件类型
var Mode = {
	getName: function(path) {
		return path.substring(path.lastIndexOf('\\') + 1);
	},
	getType: function(path) {
		var suffix = path.substring(path.lastIndexOf('.') + 1);
		if (suffix == 'js') {
			return 'text/javascript';
		} else if (suffix == 'css') {
			return 'text/css';
		} else if (suffix == 'html' || suffix == 'htm') {
			return 'text/html';
		} else {
			return '';
		}
	}
};

module.exports = Mode;