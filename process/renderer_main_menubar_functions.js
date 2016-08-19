// 这是main.html窗口引用并执行在渲染进程中的的文件，这里允许使用Node.js APIs。
const electron = require('electron');
// 通信进程
const ipcRenderer = electron.ipcRenderer;
// shellAPI
const shell = electron.shell;
// 弹出框
const dialog = electron.remote.dialog;
// ============================ 第三方node模块 ============================/
const $ = require('jquery');
var fs = require('fs');
// ============================ 根据文件路径获取文件名和文件类型 ============================/
const Mode = require('./utils_mode');
// ============================ 菜单栏操作方法 ============================/
var Menu_functions = {
	// ============================ File ============================/
	// 新建文件
	newFile: function() {
		var path = electron.remote.app.getAppPath() + '/temp/';
		var name = new Date().getTime();
		var file = path + name;
		// 新建选项卡
		Tab.openTab(file, 'NewFile', Mode.getType(file));
		/*
		// 如果不存在临时文件夹，则创建
		if (!fs.existsSync(path)) {
			fs.mkdir(path, function(err) {
				if (err) {
					throw err;
				}
			});
		}
		// 新建临时文件
		fs.writeFile(file, '', 'utf-8', function(err) {
			if (!err) {
				// 新建选项卡
				Tab.openTab(file, 'NewFile', Mode.getType(file));
			}
		});*/
	},
	// 打开文件
	open: function() {
		dialog.showOpenDialog({
			title: 'Open...',
			filters: [
				{ name: 'HTML/JS/CSS', extensions: ['html', 'htm', 'js', 'css'] },
				{ name: 'All Files', extensions: ['*'] }
			],
			properties: [
				'openFile',
				'multiSelections'
			]
		}, function(filenames) {
			for (var i in filenames) {
				Tab.openTab(filenames[i], Mode.getName(filenames[i]), Mode.getType(filenames[i]));
			}
		});
	},
	// 关闭当前文件
	close: function() {
		if ($('#tabs .cur').length) {
			Tab.closeTab($('#tabs .cur').attr('id'));
		}
	},
	// 关闭全部
	closeAll: function() {
		Tab.closeAllTab();
	},
	// 保存全部
	saveAll: function() {
		// TODO
		alert('TODO');
	},
	// 另存为
	saveAs: function() {
		// TODO
		alert('TODO');
	},
	// 保存并退出
	saveExit: function() {
		// TODO
		alert('TODO');
	},
	// 退出
	exit: function() {
		ipcRenderer.send('close');
	}
};
module.exports = Menu_functions;