// 这是main.html窗口引用并执行在渲染进程中的的文件，这里允许使用Node.js APIs。
const electron = require('electron');
// 通信进程
const {ipcRenderer} = electron;

// 标题栏操作
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