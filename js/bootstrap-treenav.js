if (!jQuery) { throw new Error('Bootstrap Tree Nav requires jQuery'); }
if (typeof chai !== 'undefined') {
	var navTreeTesting = function () { };

}
/* ==========================================================
 * bootstrap-treenav.js
 * https://github.com/morrissinger/BootstrapTreeNav
 * ==========================================================
 * Copyright 2013 Morris Singer
 * Copyright 2016 Bernat Mut
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

+function ($) {

	'use strict';

	var _options = [];
    /**
    * function getData(arg)
	* This function will return all attrib of div elements who's name starts with 'data-', example data-id,data-badge,...
    * @param li: DOM element who has div children
    */
	var getData = function (li) {
		var attrs = [];
		$(li).children('div').each(function () {
			$.each(this.attributes, function () {
				if (this.specified && this.name.startsWith('data-') && this.name.replace('data-', '').length > 0 && !this.name.includes('badge')) {
					attrs[this.name.replace('data-', '')] = this.value;
				}
			});
		});
		return attrs;
	};
	var setDoubleClick = function (options) {
		$.touchtime = [];
		$('.nav-tree > li').off('click').on('click', function (evt) {
			var id = $(this).attr('id');
			if (typeof $.touchtime[id] === 'undefined' || $.touchtime[id] === 0) {
				$.touchtime[id] = new Date().getTime();
			} else {
				if (((new Date().getTime()) - $.touchtime[id]) < 800) {
					if (typeof options.doubleTap === 'function') {
						options.doubleTap(evt, getData(this));
					}
					$.touchtime[id] = 0;
				} else {
					$.touchtime[id] = 0;
				}
			}
			return false;
		});
	};
    /**
     * Function createTree
	 * It will return a tree from a an object who has the attrib children, it's recursive. 
     * @param Node: Actual processing node
     * @param options: Object options
     * @param level: This expects the current deep
	 *
     */
	var createTree = function (Node, options, isNewElement) {

		var hasChildren = typeof Node.children !== 'undefined';
		var isNew = typeof isNewElement !== 'undefined' ? isNewElement : false;
		var attribs = '';

		var liId = '';
		var childHtml = '';

		Object.keys(Node).forEach(function (member) {
			if (member === 'children') { return; }
			var value = Node[member];
			if (value !== null) {
				attribs = attribs + 'data-' + member + '="' + value + '" ';
			}
		});
		childHtml = '<ul>\n';
		if (hasChildren) {
			var child = [];
			Object.keys(Node.children).forEach(function (key) {
				var childNode = Node.children[key];
				child[childNode[options.orderMember]] = createTree(childNode, options, isNew) + '\n';
			});
			child.forEach(function (obj) {
				childHtml = childHtml + obj;
			});
			attribs = attribs + 'data-badge="' + (Object.keys(Node.children).length - 1) + '" ';
		}
		childHtml = childHtml + '</ul>';
		if (isNew) {
			liId = parseInt(jQuery('[id^=li_]').sort(function (a, b) { return b.id.replace('li_', '') - a.id.replace('li_', ''); }).first().attr('id').replace('li_', '')) + 1;
		}
		else {
			liId = Node.id;
		}
		return '<li id="li_' + liId + '"><div class="contentElement" ' + attribs + '><a href="#" id="url_' + Node[options.idMember] + '">' + Node[options.nameMember] + '</a><span class="buttons pull-right" /></div>' + childHtml + '</li>';
	};

	var expand = function (li) {
		var $opener = $(li).children('div').children('span.opener');
		$opener.removeClass('closed').addClass('opened');
		$(li).children('ul').first().slideDown('fast');
	};

	var collapse = function (li) {
		var $opener = $(li).children('div').children('span.opener');
		$opener.removeClass('opened').addClass('closed');
		$(li).children('ul').first().slideUp('fast');
	};
	var appendBadge = function (li, options) {
		$(li).children('div').children('span.badge').remove();
		if (options.createBadge && typeof $(li).children('div').attr('data-badge') !== 'undefined' && $(li).children('div').attr('data-badge') > 0) {
			$(li).children('div').append('<span class="badge pull-right">' + $(li).children('div').attr('data-badge') + '</span>');
		}
	};
    /**  
    var createButton = function (li, options, action,callback) {
        var $buttons = $(li).children('div').children('span.buttons');
        $buttons.children('.' + action).remove();
        if (options['show' + action + 'Button']) {
            $buttons.append('<button class="btn btn-xs  btn-default ' + action + '" title="' + action + '"><i class="' + options['icon' + action + 'Button'] + '" aria-hidden="true"></i></button>');
            if(typeof callback === 'function' ){
                $('button.' + action).off('click').on('click', function (e) {
                    var data = getData($(this).parents('li').first());
                    callback(e, data);
                    
                });
            }            
        }
    };
   */
	var myHash = function (str) {
		/* jshint bitwise: false */
		var hash = 0; var i; var chr; var len;
		if (str.length === 0) { return hash; }
		for (i = 0, len = str.length; i < len; i++) {
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
		/* jshint bitwise: true */
	};
	var createButton = function (li, button) {
		var $buttons = $(li).children('div').children('span.buttons');
		var hash = myHash(button.class + button.label);

		$buttons.append('<button class="btn btn-xs  btn-default ' + hash + ' ' + button.class + '" title="' + button.label + '"><i class="' + button.icon + '" aria-hidden="true"></i></button>');
		if (typeof button.click === 'function') {
			$('button.' + hash).off('click').on('click', function (e) {
				var data = getData($(this).parents('li').first());
				button.click(e, data);

			});
		}

	};
	var createButtons = function (li, options) {
		$(li).children('div').children('span.buttons').html('');
		options.buttons.forEach(function (obj) {
			createButton(li, obj);
		});



	};

	var createOpener = function (element, options) {
		$(element).children('div').children('span.opener').remove();
		var $childUl = $(element).children('ul');
		if ($childUl.length > 0 && $childUl.children().length) {
			var status = $($childUl).is(':visible') ? 'opened' : 'closed';
			$(element).children('div').prepend('<span class="opener ' + status + '"><span class="tree-icon-closed"><i class="' + options.navTreeCollapsed + ' aria-hidden="true"></i></span><span class="tree-icon-opened"><i class="' + options.navTreeExpanded + '"></i></span></span>');
			$(element).children('div').children('a').first().off('click.bs.tree').on('click.bs.tree', function (e) {
				e.preventDefault();
				var $opener = $(this).children('span.opener').first();
				if ($opener.hasClass('closed')) {
					expand(element);

					// If there's a real target to this menu item link, then allow it to be
					// clicked to go to that page, now that the menu has been expanded.
					if (($(this).children('a').attr('href') !== '#') && ($(this).children('a').attr('href') !== '')) {
						$(this).off('click.bs.tree');
					}

				} else {
					collapse(element);
				}
			});
			$(element).children('div').children('span.opener').off('click.bs.tree').on('click.bs.tree', function (e) {
				var $opener = $(this);
				if ($opener.hasClass('closed')) {
					expand(element);
				} else {
					collapse(element);
				}
			});
		}
	};

	var collapsibleAll = function (element, options) {
		var $childUl = $(element).children('ul');
		$childUl.removeClass('nav nav-pills nav-stacked nav-tree ' + options.treeClasses).addClass('nav nav-pills nav-stacked nav-tree ' + options.treeClasses);
		$childUl.hide();
		createOpener(element, options);
	};

	var collapsible = function (ul, options) {
		var $ul = $(ul);
		var $childrenLi = $ul.find('li');
		$ul.removeClass('nav nav-pills nav-stacked nav-tree ' + options.treeClasses).addClass('nav nav-pills nav-stacked nav-tree' + options.treeClasses);
		$childrenLi.each(function (index, li) {
			collapsibleAll($(li), options);
			createButtons(li, options);
			appendBadge(li, options);

			// Expand the tree so that the active item is shown.
			if ($(li).hasClass('active')) {
				$(li).parents('ul').each(function (i, ul) {
					$(ul).show();
					$(ul).siblings('div').children('span.opener').first()
						.removeClass('closed')
						.addClass('opened');

					// If there's a real target to this menu item link, then allow it to be
					// clicked to go to that page, now that the menu has been expanded.
					if ($(ul).find('a').attr('href') !== '#' && $(ul).find('a').attr('href') !== '') {
						$(ul).siblings('a').off('click.bs.tree');
					}

				});
			}
		});
	};


	$('ul[data-toggle=nav-tree]').each(function () {
		var $tree;
		$tree = $(this);
		$tree.navTree($tree.data());
	});



	var updateTree = function (ul, options, parentId) {
		var idx = 0;

		$(ul).removeClass('nav nav-pills nav-stacked nav-tree' + options.treeClasses).addClass('nav nav-pills nav-stacked nav-tree' + options.treeClasses);
		$(ul).children().each(function () {
			var $div = $(this).children('div');
			$div.attr('data-' + options.orderMember, idx);
			$div.attr('data-' + options.parentMember, parentId);
			updateTree($(this).children('ul').first(), options, $div.attr('data-' + options.idMember));
			$div.attr('data-badge', $(this).children('ul').first().children().length);
			/** UI OPTIONS **/
			createButtons(this, options);
			appendBadge(this, options);
			createOpener(this, options);
			idx++;
		});
	};
	var sortable = function (container, options) {
		$(container).children('ul').nestedSortable({
			listType: 'ul',
			forcePlaceholderSize: true,
			handle: 'div',
			helper: 'clone',
			items: 'li',
			opacity: 0.6,
			placeholder: 'placeholder',
			revert: 250,
			tabSize: 25,
			tolerance: 'pointer',
			toleranceElement: '> div',
			maxLevels: 4,
			isTree: true,
			expandOnHover: 700,
			startCollapsed: false,
			relocate: function (e, e2) {
				updateTree($(container).children('ul'), options, 0);
			}

		});
	};

	var createAfter = function (ul, idAfterElement, data) {
		var element = createTree(data, _options, true);
		$(element).insertAfter('#' + idAfterElement);
		updateTree(ul, _options);

	};
	var deleteNode = function (ul, id) {
		console.log(id);
		console.log($('#' + id));
		$('#' + id).remove();
		updateTree(ul, _options);

	};

	var _getJsonTree = function (ul, options) {
		var jsonTree = [];
		$(ul).children().each(function () {
			var data = getData(this);
			var id = data[_options.idMember];
			jsonTree[id] = data;
			jsonTree[id].children = _getJsonTree($(this).children('ul').first(), options);
		});
		return jsonTree;

	};
	var methods = {
		getJsonTree: function () {
			return _getJsonTree($(this).children('ul'), _options);
		},
		createAfter: function (data) {
			return createAfter($(this).children('ul'), data.id, data.data);
		},
		deleteNode: function (data) {
			console.log('aa');
			console.log(data);
			return deleteNode($(this).children('ul'), data.id);
		},

	};
	//Main function of navTree plugin
	$.fn.navTree = function (args) {
		var defaults = $.fn.navTree.defaults;
		var options = null;
		if (methods[args]) {

			options = $.extend(defaults, _options);
			_options = options;
			return methods[args].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof args === 'object' || !args) {
			options = $.extend(defaults, args);
			_options = options;

			if (options.enableDragDrop && typeof $.fn.nestedSortable !== 'function') {
				throw new Error('Bootstrap Tree Nav drag and drop requires jquery-ui-nestedSortable plugin');
			}
			return this.each(function () {

				if ($(this).prop('tagName') === 'LI') {
					collapsible(this, options);
				} else if ($(this).prop('tagName') === 'UL') {
					collapsible(this, options);
				}
				else if ($(this).prop('tagName') === 'DIV') {
					jQuery(this).html('<ul class="nav nav-pills nav-stacked nav-tree ' + options.treeClasses + '" id="' + options.treeId + '" data-toggle="nav-tree">' + createTree(options.source, options) + '</ul>');
					if (options.enableDragDrop) {
						sortable(this, options);
					}
					collapsible(this, options);
				}

				setDoubleClick(options);
			});
		}
	};

	$.fn.navTree.defaults = {
		navTreeExpanded: 'fa fa-plus-square',
		navTreeCollapsed: 'fa fa-minus-square',
		orderMember: 'orden',
		parentMember: 'par_id',
		idMember: 'id',
		nameMember: 'name',
		buttons: [],
		doubleTap: function (e, dataRow) { },
		enableDragDrop: false,
		source: null,
		treeId: 'myTree',
		treeClasses: '',
		createBadge: false,
	};

	/** Only for testing purposes **/
	if (typeof navTreeTesting !== 'undefined') {
		navTreeTesting.getData = getData;
		navTreeTesting.createTree = createTree;
		navTreeTesting.sortable = sortable;
	}


} (window.jQuery);