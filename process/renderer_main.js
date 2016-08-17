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