var Zepto = (function(){
	var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,

	document = window.document,

	elementDisplay = {},

	classCache = {},

	cssNumber = {'column-count' : 1, 'columns' : 1,'line-height' : 1, 'opacity': 1,'z-index' : 1,'zoom' : 1},
	fragment = /^\s*<(\w+|!)[^>]*>/,

	singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rootNodeRE = /^(?:body|html)$/i,//分组捕获 
	capitalRE = /([A-Z])/g,

	methodAttributes = ['val','css','html','text','data','width','height','offset'],

	adjacencyOperators = ['after','prepend','before','append'],
	table = document.createElement('table'),
	tableRow = document.createElement('tr'),

	containers = {
		'tr' : document.createElement('tbody'),
		'tbody' : table, 'thead' : table, 'tfoot' : table,
		'td' : tableRow, 'th' : tableRow,
		'*' : document.createElement('div')
	},

	readyRE = /complete|loaded|interactive/,
	simpleSelectorRE = /^[\w-]*$/,

	class2type = {},
	toString = class2type.toString,
	zepto = {},
	camelize,uniq,
	temParent = document.createElement('div'),
	propMap = {
		'tabindex' : 'tabIndex',
		'readonly' : 'readOnly',
		'for' : 'htmlFor',
		'class' : 'className',
		'maxlength' : 'maxLength',
		'cellspacing' : 'cellSpacing',
		'cellpadding' : 'cellPadding',
		'rowspan' : 'rowSpan',
		'colspan' : 'colSpan',
		'usemap' : 'useMap',
		'frameborder' : 'frameBorder',
		'contenteditable' : 'contentEditable'
	},

	isArray = Array.isArray || function(object){
		return object instanceof Array
	};

	zepto.matches = function(element,selector){//nodetype == 1 元素节点
		if(!selector || !element || element.nodeType !== 1) return false;

		var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || 
							element.oMatchesSelector || element.matchesSelector;
		if(matchesSelector) return matchesSelector.call(element,selector);

		var match, patent = element.parentNode,temp = !parent;

		if(temp) (parent = tempParent).appendChild(element);

		match = ~zepto.qsa(parent, selector).indexOf(element);

		temp && tempParent.removeChild(element);

		return match;
	}

	function type(obj){
		return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object'
	}
	function isFunction(value){return type(value) == 'function'}
	function isWindow(obj){ return obj != null && obj == obj.window }
	function isDocument(obj){ return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	function isObject(obj){
		return type(obj) == 'object'
	}

	function isPlainObject(obj){
		return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	}

	//伪数组、数组   方法也有length属性，为参数个数
	function likeArray(obj){ return typeof obj.length == 'number' }

	function compact(array){ return filter.call(array,function(item){ return item != 'null' }) }

	function flatten(array){
		return array.length > 0 ? $.fn.concat.apply([], array) : array;
	}

	camelize = function(str){
		return str.replace(/-+(.)?/g,function(match,chr){
			return chr ? chr.toUpperCase() : '';
		})
	}

	function dasherize(str){
		return str.replace(/::/g,'/')
					.replace(/([A-Z]+)([A-Z][a-z])/g,'$1_$2')//大小写之间插入下划线(_)，比如AAAbb->AAA_bb
					.replace(/([a-z\d])([A-Z])/g,'$1_$2')//在大写字母前插入下划线，比如 bb123AA->bb123_AA
					.replace(/_/g,'-')//将下划线替换为'-'
					.toLowerCase() //转换为小写
	}

	uniq = function(array){
		return filter.call(array,function(item,idx){
			return array.indexOf(item) == idx;
		})
	}

	function classRE(name){
		return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(|\\s)' + name + '(\\s|$)'))
	}

	function maybeAddPx(name,value){
		return (typeof value == 'number' && !cssNumber[dasherize(name)]) ? value + 'px' : value
	}

	// 获取元素默认的display值  使用show、hide之类切换的时候，会先记录默认值，要切换回去的时候，就从缓存里面取
	function defaultDisplay(nodeName){
		var element, display;
		if(!elementDisplay[nodeName]){
			element = document.createElement(nodeName);
			document.body.appendChild(element);
			display = getComputedStyle(element,'').getPropertyValue('display');
			element.parentNode.removeChild(element);

			display == 'none' && (display = 'block');

			elementDisplay[nodeName] = display; //缓存起来
		}

		return elementDisplay[nodeName];
	}

	function children(element){
		return 'children' in element ? 
			slice.call(element,children) : 
			$.map(element.childNodes,function(none){ if(node.nodeType == 1) return node; })
	}

	function Z(dom,selector){
		var i, len = dom ? dom.length : 0;
		for(i = 0; i < len ; i++){
			this[i] = dom[i]
		}
		this.length = len;
		this.selector = selector || '';
	}








})()

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);