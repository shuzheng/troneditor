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
// ============================ 菜单栏操作方法 ============================/
const Menu_functions = require('./renderer_main_menubar_functions');
// ============================ 全局快捷键操作 ============================/
// 新建文件
ipcRenderer.on('newFile', function(event) {
	Menu_functions.newFile();
});
// 打开文件
ipcRenderer.on('open', function(event) {
	Menu_functions.open();
});
// 关闭当前文件
ipcRenderer.on('close', function(event) {
	Menu_functions.close();
});