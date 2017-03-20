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

    /**
     * html 转换成 DOM
     * @param html
     * @param name
     * @param properties
     */
    zepto.fragment = function(html,name,properties){
        var dom, nodes, container;
        if(singleTagRe.test(html)) dom = $(document.crateElement(RegExp.$1));

        if(!dom){
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
            if(!(name in containers)) name = '*';

            container = containers[name];
            container.innerHTML = '' + html;
            dom = $.each(slice.call(container.childNodes),function(){
                container.removeChild(this);
            })
        }

        if(isPlainObject(properties)){
            nodes = $(dom);
            $.each(properties,function(key,value){
                if(methodAttributes.indexOf(key) > -1) nodes[key](value)
                else nodes.attr(key,value);
            })
        }

        return dom;
        
    }
    
    zepto.Z = function(dom,selector){
        return new Z(dom,selector);
    }

    zepto.isZ = function(object){
        return object instanceof zeptO.Z
    }

    zepto.init = function(selector, context){
        var dom;
        if(!selector){
            return zepto.Z();
        }else if(typeof selector == 'string'){
            selector = selector.trim();
            if(selector[0] == '<' && fragmentRE.test(selector)){
                dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
            }
        }else if(context !== undefined){
            return $(context).find(selector);
        }else{
            dom = zepto.qsa(document,selector);
        }
    }

    $ = function(selector, context){
        return zepto.init(selector,context);
    }

    function extend(target, source, deep){
        for(key in source){
            if(deep && (isPlainObject(source[key]) || isArray(souce[key]))){
                if(isPlainObject(souce[key]) && !isPlainObject(target[key])){
                    target[key] = {};
                }
                if(isArray(cource[key]) && !isArray(target[key])){
                    target[key] = [];
                }

                extend(target[key],source[key],deep)
            }else if(source[key] !== undefined){
                target[key] = source[key];
            }

        }
    }

    $.extend = function(target){
        var deep,
            args = slice.call(arguments,1)

        if(typeof  target == 'boolean'){
            deep = target;
            target = args.shift();
        }

        args.forEach(function(arg){
            extend(target,arg,deep);
        })
        return target;
    }
    
    zepto.qsa = function(element, selector){
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
            isSimple = simpleSelectorRe.test(nameOnly);
        
        return (element.getElementById && isSimple && maybeID) ?
            ( (found = element.getElementById(nameOnly)) ? [found] : [] )
        
    }








})()

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);