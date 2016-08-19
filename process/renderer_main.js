// 这是main.html窗口引用并执行在渲染进程中的的文件，这里允许使用Node.js APIs。
const electron = require('electron');
// 通信进程
const ipcRenderer = electron.ipcRenderer;
// shellAPI
const shell = electron.shell;
// ============================ 第三方node模块 ============================/
const $ = require('jquery');
// ============================ 标题栏操作 ============================/
require('./renderer_main_titlebar');
// ============================ 菜单栏操作 ============================/
require('./renderer_main_menubar');
// ============================ 编辑器操作 ============================/
require('./renderer_main_editor');
// ============================ 全局快捷键操作 ============================/
require('./renderer_main_shortcut');
// ============================ 根据文件路径获取文件名和文件类型 ============================/
const Mode = require('./utils_mode');
// ============================ 通信操作 ============================/
// 启动时打开文件
ipcRenderer.once('openFiles', function(event, filenames) {
	console.log(filenames);
	for (var i in filenames) {
		if (Mode.getSuffix(filenames[i]) != 'exe' && Mode.getSuffix(filenames[i]) != '') {
			Tab.openTab(filenames[i], Mode.getName(filenames[i]), Mode.getType(filenames[i]));
		}
	}
});