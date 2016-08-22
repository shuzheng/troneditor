// 这是main.html窗口引用并执行在渲染进程中的的文件，这里允许使用Node.js APIs。
const electron = require('electron');
// 通信进程
const ipcRenderer = electron.ipcRenderer;
// ============================ 第三方node模块 ============================/
const $ = require('jquery');
const UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
var minify = require('html-minifier').minify;
var MD5 = require('md5');
var fs = require('fs');
// ============================ 根据文件路径获取文件名和文件类型 ============================/
const Mode = require('./utils_mode');
// ============================ 编辑器操作 ============================/
CodeMirror.modeURL = "resources/plugins/CodeMirror/mode/%N/%N.js";
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
			// 获取当前文件
			var path = '';
			var editor;
			var minPath = '';
			var i = editors.length;
			while (i--) {
				if (MD5(editors[i].path) === cm.options.id) {
					path = editors[i].path;
					editor = editors[i];
					// 打开文件保存
					if (editor.newfile == 0) {
						// 如果有后缀的文件，拼接min文件路径
						if (path.lastIndexOf('.') > 0) {
							var basePath = path.substring(0, path.lastIndexOf('.'));
							var suffix = path.substring(path.lastIndexOf('.'));
							minPath = basePath + '.min' + suffix;
						}
					}
					// 新建文件保存
					else {
						electron.remote.dialog.showSaveDialog({
							title: 'Save As...'
						}, function(filename) {
							// 取消保存
							if (!filename) {
								return false;
							}
							// 保存新文件
							fs.writeFile(filename, cm.getValue(), 'utf-8', function() {
								// 修改标签id为新id
								var newId = MD5(filename);
								$('#' + MD5(editor.path)).attr('id', newId);
								$('#' + MD5(editor.path) + '_content').attr('id', newId + '_content');
								// 修改编辑器id和mode
								cm.options.id = newId;
								cm.options.mode = Mode.getType(filename);
								CodeMirror.autoLoadMode(editor.codeMirror, Mode.getMode(filename));
								// 修改标签
								$('#' + newId + ' span').text(Mode.getName(filename));
								$('#' + newId + ' i').attr('onclick', 'Tab.closeTab(\'' + newId + '\')');
								// 修改打开文件路径为最新路径
								editor.path = filename;
							});
						});
					}
					break;
				}
			}
			// 获取值
			var value = cm.getValue();
			// 保存文件
			fs.writeFile(path, value, 'utf-8', function() {
				// js压缩
				if (cm.options.mode == 'application/javascript' || cm.options.mode == 'text/javascript') {
					var minValue = UglifyJS.minify(value, {fromString: true, warnings: true}).code;
					fs.writeFile(minPath, minValue, 'utf-8');
				}
				// css压缩
				if (cm.options.mode == 'text/css') {
					var minValue = new CleanCSS().minify(value).styles;
					fs.writeFile(minPath, minValue, 'utf-8');
				}
				// html压缩
				if (cm.options.mode == 'text/html') {
					var minValue = minify(value, {
						removeComments: true,
						collapseWhitespace: true,
						minifyJS:true,
						minifyCSS:true
					});
					fs.writeFile(minPath, minValue, 'utf-8');
				}
				// 修改当前文件修改状态为未修改，并去掉标题*
				editor.modified = 0;
				var $tab_name = $('#' + MD5(path) + ' span');
				$tab_name.text($tab_name.text().replace('\*', ''));
			});
		}
	},
	matchBrackets: true
};
$(document).bind("drop", function (e) {
	e.preventDefault();
	e.stopPropagation();
	var files = e.originalEvent.dataTransfer.files;
	for (var i in files) {
		if (files[i].path) {
			Tab.openTab(files[i].path, files[i].name, files[i].type);
		}
	}
}).bind("dragover", function (e) {
	e.preventDefault();
	e.stopPropagation();
});
/*
astModified:1466996183937
lastModifiedDate:Mon Jun 27 2016 10:56:23 GMT+0800 (中国标准时间)
name:"CMD.js"
path:"C:\Users\Desktop\CMD.js"
size:144
type:"application/javascript"
webkitRelativePath:""
*/
window.Tab = {
	openTab: function(path, name, type) {
		// 判断是否一打开同路径文件
		var i = editors.length;
		while (i--) {
			if (editors[i].path === path) {
				// 激活选项卡
				this.focusTab(MD5(path));
				return false;
			}
		}
		// 新增选项卡，打开文件
		var editor = {};
		var id = MD5(path);
		$('#tabs .cur').removeClass('cur');
		$('#tabs').append($('<li class="cur" id="' + id + '"><span>' + name + '</span><i onclick="Tab.closeTab(\'' + id + '\')">×</i></li>'));
		// 初始化编辑器
		$('#code').append($('<div id="' + id + '_content" class="editor"><textarea id="' + id + '_editor" name="editor"></textarea></div>'));
		// 初始化编辑器内容，新建文件内容为空
		if (!fs.existsSync(path)) {
			$('#' + id + '_editor').val('');
			editor.newfile = 1;
		} else {
			$('#' + id + '_editor').val(fs.readFileSync(path, 'utf-8'));
			editor.newfile = 0;
		}
		// 编辑器属性
		editor_options.mode = type;
		editor_options.id = id;
		// 编辑器对象
		editor.modified = 0;
		editor.path = path;
		// 显示当前
		$('.editor').hide();
		$('#' + id + '_content').show(0, function() {
			editor.codeMirror = CodeMirror.fromTextArea(document.getElementById(id + '_editor'), editor_options);
			editor.codeMirror.on('drop', function(editor, e) {
				e.preventDefault();
				e.stopPropagation();
			});
			// 自动补全快捷键
			editor.codeMirror.on('keyup', function (cm, event) {
				//console.log(event.keyCode);
				if (!cm.state.completionActive &&
					((event.keyCode >= 65 && event.keyCode <= 90) ||		// A-Z
					(event.keyCode >= 96 && event.keyCode <= 105) ||		// 0-9(小键盘)
					(event.keyCode >= 48 && event.keyCode <= 57) ||			// 0-9(控制键盘)
					(event.keyCode == 190 || event.keyCode == 110) ||		// .
					event.keyCode == 32 ||		// 空格
					//event.keyCode == 186 ||		// :
					event.keyCode == 188		// <
					)) {
					CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
				}
			});
			// 监听修改状态
			editor.codeMirror.on('change', function (cm, changeObj) {
				editor.modified = 1;
				// 有后缀文件，可提示是否保存，无后缀文件不提示
				var $tab_name = $('#' + MD5(editor.path) + ' span');
				if ($tab_name.text().indexOf('*') < 0 ) {
					$tab_name.text('* ' + $tab_name.text());
				}
			});
		});
		// 异步加载高亮
		if (Mode.getMode(path)) {
			CodeMirror.autoLoadMode(editor.codeMirror, Mode.getMode(path));
		}
		// 加入编辑器数组
		editors.push(editor);
	},
	closeTab: function(id) {
		var i = editors.length;
		while (i--) {
			if (MD5(editors[i].path) === id) {
				// 判断修改状态
				if (editors[i].modified == 1) {
					if (confirm('确认保存吗？')) {
						// TODO
						alert('saved');
					}
				}
				// 删除选项卡
				editors.splice(i, 1);
				$('#' + id).remove();
				$('#' + id + '_content').remove();
				return false;
			}
		}
	},
	closeAllTab: function() {
		var i = editors.length;
		while (i--) {
			$('#' + MD5(editors[i].path)).remove();
			$('#' + MD5(editors[i].path) + '_content').remove();
		}
		editors.length = 0;
	},
	focusTab: function(id) {
		$('#tabs .cur').removeClass('cur');
		$('#' + id).addClass('cur');
		$('.editor').hide();
		$('#' + id + '_content').show();
	}
};
$(function() {
	$(document).on('click', '#tabs li', function () {
		Tab.focusTab($(this).attr('id'));
	});
});