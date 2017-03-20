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
            ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
            (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
             slice.call(
                 isSimple && !maybeID && element.getElementsByClassName ?
                     maybeClass ? element.getElementsByClassName(nameOnly) :
                         element.getElementsByTagName(selector) :
                     element.querySelectorAll(selector);
             )
        
    }

    function filtered(nodes, selector){
        return selector == null ? $(nodes) : $(nodes).filter(selector);
    }

    $.contains = document.documentElement.contains ?
        function(parent,node){
            return parent != node && parent.contains(node)
        } :
        function(parent, node){
            while (node && (node = node.parentNode)){
                if (node === parent) return true;
            }
            return false;
        }

    function funcArg(context, arg, idx, payload){
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }

    function setAttribute(node, name, value){
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
    }

    function className(node,value){
        var klass = node.className || '',
            svg = klass && klass.baseVal !== undefined;

        if(value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
    }

    function deserializeValue(value){
        try{
            return value ?
                value == "true" ||
                ( value == "false" ? false :
                  value == "null" ? null :
                  +value + "" == value ? +value :
                  /^[\[\{]/.test(value) ? $.parseJSON(value) :
                  value
                ) : value
        }catch(e){
            return value;
        }
    }
    }

    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;

    $.isEmptyObject = function(obj){
        var name;
        for(name in obj) return false;
        return true;
    }

    $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array,elem,i);
    }

    $.camelCase = function(str){
        return str.replace(/-+(.)?/g,function(match, chr){
            return chr ? chr.toUpperCase() : '';
        })
    }

    $.trim = function(str){
        return str == null ? "" : String.prototype.trim.call(str);
    }

    $.uuid = 0;
    $.support = { };
    $.expr = { }
    $.noop = function(){};

    $.map = function(elements, callback){
        var value, values = [], i , key;
        if(likeArray(elements)){
            for(i = 0; i < elements.length; i++){
                value = callback(elements[i],i)
                if(value != null) values.push(value);
            }
        }else{
            for(key in elements){
                value = callback(elements[key],key);
                if(value != null) values.push(value);
            }
        }

        return flatten(values);
    }

    $.each = function(elements, callback){
        var i, key;
        if(likeArray(elements)){
            for(i = 0; i< elements.length; i++){
                if(callback.call(elements[i],i,elements[i]) === false) return elements;
            }
        }else{
            for(key in elements){
                if(callback.call(elements[key],key,elements[key]) === false) return elements;
            }
        }
        return elements;
    }

    $.grep = function(elements, callback){
        return filter.call(elemetns,callback);
    }

    if(window.JSON) $.parseJSON = JSON.parse;

    $.each("Boolean Number String Array Date RegExp Object Error".split(" "),function(i,name){
        class2type["[object "+ name +"]"] = name.toLowerCase();
    })

    $.fn = {
        constructor : zepto.Z,
        length : 0,
        forEach : emptyArray.forEach,
        reduce : emptyArray.reduce,
        push : emptyArray.push,
        sort : emptyArray.sort,
        splice : emptyArray.splice,
        indexOf : emptyArray.indexOf,

        concat : function(){
            var i, value, args = [];
            for(i = 0; i < arguments.length; i++){
                value = arguments[i];
                args[i] = zepto.isZ(this) ? value.toArray() : value;
            }
            return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
        },
        
        map : function(fn){
            return $($.map(this,function(el,i){return fn.call(el,i,el)}))
        },
        
        slice : function(){
            return $(slice.apply(this, arguments))
        },
        
        ready : function(callback){
            if(readyRE.test(document.readyState) && document.body) callback($)
            else document.addEventListener('DOMContentLoaded',function(){ callback($); },false)

            return this;
        },

        get : function(idx){
            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
        },

        toArray : function(){
            return this.get();
        },

        size : function(){
            return this.length;
        },

        remove : function(){
            return this.each(function(){
                if(this.parentNode != null){
                    this.parentNode.removeChild(this);
                }
            })
        },

        each : function(callback){
            emptyArray.every.call(this,function(el,idx){
                return callback.call(el,idx,el) !== false;
            });

            return this;
        },

        filter : function(selector){
            if(isFunction(selector)) return this.not(this.not(selector));

            return $(filter.call(this,function(element){
                return zepto.matches(element,selector);
            }))
        },
        add : function(selector,context){
            return $(uniq(this.concat($(selector,context))))
        },
        is : function(selector){
            return this.length ? 0 && zepto.matches(this[0], selector);
        },
        not : function(selector){
            var nodes = [];
            if(isFunction(selector) && selector.call !== undefined){
                this.each(function(idx){
                    if(!selector.call(this,idx)) nodes.push(this);
                })
            }else{
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                    (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector);

                this.forEach(function(el){
                    if(excludes.indexOf(el) < 0) nodes.push(el);
                })
            }

            return $(nodes)
        },
        has : function(selector){
            return this.filter(function(){
                return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size()
            })
        },
        eq : function(idx){
            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
        },
        first : function(){
            var el = this[0]
            return el && !isObject(el) ? el : $(el);
        },
        last : function(){
            var el = this[this.length - 1];
            return el && !isObject(el) ? el : $(el);
        },
        find : function(selector){
            var result, $this = this;
            if(!selector) result = $()
            else if (typeof selector == 'object')
                result = $(selector).filter(function(){
                    var node = this;
                    return emptyArray.some.call($this,function(parent){
                        return $.contains(parent,node)
                    })
                })
            else if(this.length == 1) result = $(zepto.qsa(this[0],selector))
            else result = this.map(function(){ return zepto.qsa(this, selector) })
            return result;
        }
        
        


    }











})()

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);