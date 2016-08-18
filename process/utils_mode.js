// 根据文件路径获取文件名和文件类型
var Mode = {
	getName: function(path) {
		path = path.replace(new RegExp('\\\\','gm'),'/');
		return path.substring(path.lastIndexOf('/') + 1);
	},
	getType: function(path) {
		var name = this.getName(path);
		// 无后缀
		if (name.lastIndexOf('.') < 0) {
			return '';
		}
		// 根据后缀名返回mode类型
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
	},
	getMode: function(path) {
		var type = this.getType(path);
		if (type == 'text/javascript') {
			return 'javascript';
		} else if (type == 'text/css') {
			return 'css';
		} else if (type == 'text/html') {
			return 'htmlmixed';
		} else {
			return '';
		}
	}
};

module.exports = Mode;