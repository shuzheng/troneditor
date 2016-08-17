const electron = require('electron');
// 通信进程
const ipcRenderer = electron.ipcRenderer;
// ============================ 标题栏操作 ============================/
var min = document.getElementById('min');
var max = document.getElementById('max');
var close = document.getElementById('close');
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
ipcRenderer.on('unmax', function(event, arg) {
	max.setAttribute('class', 'max1');max.setAttribute('title', '最大化');
});
ipcRenderer.on('max', function(event, arg) {
	max.setAttribute('class', 'max2');max.setAttribute('title', '还原');
});