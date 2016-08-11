(function(){
	// ============== 加载皮肤 ==============
	var skin = 'windows';
	if(localStorage.skin)
		skin = localStorage.skin;
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
		link.setAttribute('id', 'skin');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', 'resources/skins/'+ skin +'/' + skin + '.css');
	head.appendChild(link);
	// 加载标题栏
	var body = document.getElementsByTagName('body')[0];
	var titlebar = document.createElement('div');
		titlebar.setAttribute('id', 'titlebar');
	
	var icon = document.createElement('img');
		icon.setAttribute('src', document.getElementById('icon').getAttribute('href'));
	var title = document.createElement('span');
		title.innerText = document.title;
	var caption = document.createElement('div');
		caption.setAttribute('id', 'caption');
		caption.appendChild(icon);
		caption.appendChild(title);
		
	titlebar.appendChild(caption);
		var buttons = document.createElement('div');
			buttons.setAttribute('id', 'buttons');
			var set = document.createElement('a');
				set.setAttribute('id', 'set');
				set.setAttribute('title', '设置');
			var min = document.createElement('a');
				min.setAttribute('id', 'min');
				min.setAttribute('title', '最小化');
			var max = document.createElement('a');
				max.setAttribute('id', 'max');
				max.setAttribute('title', '最大化');
				max.setAttribute('class', 'max1');
			var close = document.createElement('a');
				close.setAttribute('id', 'close');
				close.setAttribute('title', '关闭');
		buttons.appendChild(set);
		buttons.appendChild(min);
		buttons.appendChild(max);
		buttons.appendChild(close);
		
	titlebar.appendChild(buttons);
	body.insertBefore(titlebar, document.getElementById('main'));
	// ============== 皮肤颜色 ==============
	var color = 'default';
	if(localStorage.color)
		color = localStorage.color;
	body.className = color;
}());