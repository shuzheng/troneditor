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
var MD5 = require('md5');
var rf = require('fs');
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
var editor_options = {
	id: '',
	mode: 'text/css',	// 语言模式
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
	//scrollbarStyle: 'simple',	// 美化滚动条
	keyMap: 'sublime',		// 使用sublime快捷键
	extraKeys: {	// 扩展全屏快捷键
		'F11': function(cm) {
			cm.setOption('fullScreen', !cm.getOption('fullScreen'));
		},
		'Esc': function(cm) {
			if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
		},
		'Alt-/': 'autocomplete',
		'Ctrl-S': function(cm) {
			// 撤消&重做
			//var doc = editor.getDoc();
			//console.log(doc.undo());
			//console.log(doc.redo());
			// 获取文件路径
			var path = '';
			var minPath = '';
			var i = editors.length;
			while (i--) {
				if (MD5(editors[i].path) === cm.options.id) {
					path = editors[i].path;
					var basePath = path.substring(0, path.lastIndexOf('.'));
					var suffix = path.substring(path.lastIndexOf('.'));
					minPath = basePath + '.min' + suffix;
					break;
				}
			}
			// 获取值
			var value = cm.getValue();
			// 保存文件
			rf.writeFile(path, value, 'utf-8', function() {
				console.log('save:' + path);
				// js压缩
				if (cm.options.mode == 'application/javascript' || cm.options.mode == 'text/javascript') {
					//var result = UglifyJS.minify(path);
					//console.log(result);
					var result = UglifyJS.minify(value, {fromString: true, warnings: true});
					console.log(result.code);
				}
				// css压缩
				if (cm.options.mode == 'text/css') {
					var minValue = new CleanCSS().minify(value).styles;
					rf.writeFile(minPath, minValue, 'utf-8', function() {
						console.log('save:' + minPath);
					});
				}
				// html压缩
				if (cm.options.mode == 'text/html') {
					var minValue = value;
				}
			});
		}
	},
	matchBrackets: true
};
var editors = new Array();
$(document).bind("drop", function (e) {
	e.preventDefault();
	e.stopPropagation();
	var files = e.originalEvent.dataTransfer.files;
	for (var i = 0; i < files.length; i ++) {
		Tab.openTab(files[i]);
	}
}).bind("dragover", function (e) {
	e.preventDefault();
	e.stopPropagation();
});
/*
astModified:1466996183937
lastModifiedDate:Mon Jun 27 2016 10:56:23 GMT+0800 (中国标准时间)
name:"CMD.js"
path:"C:\Users\shzuheng\Desktop\CMD.js"
size:144
type:"application/javascript"
webkitRelativePath:""
*/
window.Tab = {
	openTab: function(file) {
		// 判断是否一打开同路径文件
		var i = editors.length;
		while (i--) {
			if (editors[i].path === file.path) {
				// 激活选项卡
				this.focusTab(MD5(file.path));
				return false;
			}
		}
		// 新增选项卡，打开文件
		var id = MD5(file.path);
		$('#tabs .cur').removeClass('cur');
		$('#tabs').append($('<li class="cur" id="' + id + '">' + file.name + '<i onclick="Tab.closeTab(\'' + id + '\')">×</i></li>'));
		// 初始化编辑器
		$('#code').append($('<div id="' + id + '_content" class="editor"><textarea id="' + id + '_editor" name="editor"></textarea></div>'));
		$('#' + id + '_editor').val(rf.readFileSync(file.path, 'utf-8'));
		editor_options.mode = file.type;
		editor_options.id = id;
		// 加入编辑器数组
		editors.push(file);
		// 显示当前
		$('.editor').hide();
		$('#' + id + '_content').show(0, function() {
			CodeMirror.fromTextArea(document.getElementById(id + '_editor'), editor_options)
			.on('drop', function(editor, e) {
				e.preventDefault();
				e.stopPropagation();
			});
			//var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('editor'), editor_options);
			//CodeMirror.on("keyup", function (cm, event) {
			//    if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
			//        event.keyCode != 13) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
			//        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
			//    }
			//});
		});
	},
	closeTab: function(id) {
		var i = editors.length;
		while (i--) {
			if (MD5(editors[i].path) === id) {
				// 删除选项卡
				editors.splice(i, 1);
				$('#' + id).remove();
				$('#' + id + '_content').remove();
				return false;
			}
		}
	},
	focusTab: function(id) {
		$('#tabs .cur').removeClass('cur');
		$('#' + id).addClass('cur');
		$('.editor').hide();
		$('#' + id + '_content').show();
	}
}
$(function() {
	$(document).on('click', '#tabs li', function () {
		Tab.focusTab($(this).attr('id'));
	});
});



// 编辑器
$(function() {
	//editor.on("dragstart",function(editor,e){console.log('dragstart')});
    //editor.on("dragenter",function(editor,e){console.log('dragenter');console.log(e)});
    //editor.on('drop', function(editor, e) {
	//	console.log(e);
	//	console.log(e.srcElement.baseURI)
	//});
	//var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('editor'), editor_options);
	//CodeMirror.on("keyup", function (cm, event) {
    //    if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
    //        event.keyCode != 13) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
    //        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
    //    }
    //});
});