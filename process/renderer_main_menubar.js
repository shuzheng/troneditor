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
const Menu_functions = require('./renderer_main_menubar_functions');
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
	$('#New').click(function() {
		Menu_functions.newFile();
	});
	// Open
	$('#Open').click(function() {
		Menu_functions.open();
	});
	// Close
	$('#Close').click(function() {
		Menu_functions.close();
	});
	// Close All
	$('#CloseAll').click(function() {
		Menu_functions.closeAll();
	});
	// Save All
	$('#SaveAll').click(function() {
		Menu_functions.saveAll();
	});
	// Save As...
	$('#SaveAs').click(function() {
		Menu_functions.saveAs();
	});
	// Save & Exit
	$('#SaveExit').click(function() {
		Menu_functions.saveExit();
	});
	// Exit
	$('#Exit').click(function() {
		Menu_functions.exit();
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
		setTimeout(function() {
			ipcRenderer.send('showMessageBox', {
				type: 'info',
				title: 'About',
				message: 'Copyright © 2016, Zhang Shuzheng All rights reserved.',
				buttons: []
			});
		}, 50);
	});
});