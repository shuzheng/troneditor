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
// ============================ 菜单栏操作 ============================/
var menubar_status = 'hover';
$(function() {
	// 鼠标悬浮添加菜单激活状态
	$('#menubar>ul>li').mouseenter(function() {
		$(this).addClass(menubar_status);
	}).mouseleave(function() {
		$('#menubar>ul>li').removeClass('hover').removeClass('active');
	});
	// 切换菜单激活状态
	$('#menubar>ul>li').click(function(event) {
		if (menubar_status == 'hover') {
			menubar_status = 'active';
		} else {
			menubar_status = 'hover';
		}
		$('#menubar>ul>li').removeClass('hover').removeClass('active');
		$(this).addClass(menubar_status);
		// 编辑器获取焦点
		//if (editor) {
		//	editor.focus();
		//}
		event.stopPropagation();
	});
	// 空白处点击，取消菜单激活状态
	$(document).click(function(event) {
		menubar_status = 'hover';
		// 编辑器获取焦点
		//if (editor) {
		//	editor.focus();
		//}
	});
});
// ============================ File ============================/
$(function() {
	// New
	$('#new').click(function() {
		var path = electron.remote.app.getAppPath() + '/temp/';
		var name = new Date().getTime();
		var file = path + name;
		// 如果不存在临时文件夹，则创建
		if (!fs.existsSync(path)) {
			fs.mkdir(path, function(err) {
				if (err) {
					throw err;
				}
			});
		}
		// 新建临时文件
		fs.writeFile(file, '', 'utf-8');
		// 新建选项卡
		Tab.openTab(file, Mode.getName(file), Mode.getType(file));
	});
	// Open
	$('#open').click(function() {
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
	});
});
// ============================ Edit ============================/
// ============================ View ============================/
// ============================ Search ============================/
// ============================ Tools ============================/
// ============================ Skins ============================/
$(function() {
	// 默认皮肤颜色
	var color = localStorage.color || 'default';
	$('#' + color).addClass('cur');
	// 切换皮肤颜色
	$('.skins li').click(function() {
		localStorage.color = $(this).attr('id');
		$('body').attr('class', $(this).attr('id'));
		$('.skins li').removeClass('cur');
		$(this).addClass('cur');
	});
});
// ============================ Help ============================/
$(function() {
	// 文档
	$('#document').click(function() {
		shell.openExternal('http://www.zhangshuzheng.cn/troneditor/');
	});
	// 关于
	$('#about').click(function() {
		ipcRenderer.send('showMessageBox', {
			type: 'info',
			title: 'About',
			message: 'Copyright © 2016, Zhang Shuzheng All rights reserved.',
			buttons: []
		});
	});
});