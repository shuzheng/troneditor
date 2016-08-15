// 这是main.html窗口引用并执行在渲染进程中的的文件，这里允许使用Node.js APIs。
const electron = require('electron');
// 通信进程
const {ipcRenderer} = electron;
// shellAPI
const {shell} = require('electron');
// ============================ 第三方node模块 ============================/
const $ = require('jquery');
const UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
// ============================ 标题栏操作 ============================/
let min = document.getElementById('min');
let max = document.getElementById('max');
let close = document.getElementById('close');
// 最小化
min.onclick = function() {
	ipcRenderer.send('min');
}
// 最大化
max.onclick = function() {
	ipcRenderer.send('max');
}
// 关闭
close.onclick = function() {
	ipcRenderer.send('close');
}
ipcRenderer.on('unmax', (event, arg) => {
	max.setAttribute('class', 'max1');max.setAttribute('title', '最大化');
});
ipcRenderer.on('max', (event, arg) => {
	max.setAttribute('class', 'max2');max.setAttribute('title', '还原');
});
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
		if (editor) {
			editor.focus();
		}
		event.stopPropagation();
	});
	// 空白处点击，取消菜单激活状态
	$(document).click(function(event) {
		menubar_status = 'hover';
		// 编辑器获取焦点
		if (editor) {
			editor.focus();
		}
	});
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
	// 文档
	$('#document').click(function() {
		shell.openExternal('http://www.zhangshuzheng.cn/');
	});
	// 关于
	$('#about').click(function() {
		alert('软件版权声明：Copyright © 2016, Zhang Shuzheng All rights reserved');
	});
});
// ============================ 编辑器操作 ============================/
// 编辑器
var editor;
$(function() {
	editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
		mode: 'text/html',	// 语言模式
		theme: 'bespin',	// 高亮主题
		lineNumbers: true,	// 显示行数
		smartIndent: true,	// 回车智能缩进
		indentUnit: 4,	// 首行缩进单位(1个tab)
		tabSize: 4,		// tab键宽度为4个空格宽度
		indentWithTabs: true,// 换行自动缩进为tab键
		maxHighlightLength: Infinity,	// 支持无限着色
		lineWrapping: false,	// 是否换行
		styleActiveLine: true,	// 当前行加背景
		autofocus: true,		// 自动获取焦点
		matchTags: {bothTags: true},	// 提示配对标签
		autoCloseBrackets: true, // 自动匹配括号、引号等
		autoCloseTags: true,		// 自动闭合标签
		showTrailingSpace: true,	// 多余空白提示错误
		lineWiseCopyCut: true,	// 不选择任何字符时，默认复制当前行
		scrollbarStyle: 'simple',	// 美化滚动条
		keyMap: 'sublime',		// 使用sublime快捷键
		extraKeys: {	// 扩展全屏快捷键
			'F11': function(cm) {
				cm.setOption('fullScreen', !cm.getOption('fullScreen'));
			},
			'Esc': function(cm) {
				if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
			},
			'Ctrl-S': function(cm) {
				// 撤消&重做
				/*var doc = editor.getDoc();
				console.log(doc.undo());
				console.log(doc.redo());*/
				// 获取值
				var value = editor.getValue();
				console.log(value);
				// js压缩
				var result = UglifyJS.minify("var b = function () { alert(1); };", {fromString: true}).code;
				console.log(result);
				// css压缩
				var CleanCSS = require('clean-css');
				var source = 'a{ font-weight: bold; width: 100px; height: 200px; font-familay: "微软雅黑"}';
				var minified = new CleanCSS().minify(source).styles;
				console.log(minified);
			}
		},
		matchBrackets: true
	});
	editor.on("dragstart",function(editor,e){console.log('dragstart')});
    editor.on("dragenter",function(editor,e){console.log('dragenter');console.log(e)});
    editor.on("drop",function(editor,e){console.log('drop')});
});