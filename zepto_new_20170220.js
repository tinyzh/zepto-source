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
	}





})()

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);