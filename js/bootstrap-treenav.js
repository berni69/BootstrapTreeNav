/**
* bootstrap-treenav.js v1.0.1 by @morrissinger @berni69
* Copyright 2013 Morris Singer
* http://www.apache.org/licenses/LICENSE-2.0
*/
if (!jQuery) { throw new Error('Bootstrap Tree Nav requires jQuery'); }

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
    var getData = function (li) {
        var attrs = [];
        $(li).children('div').each(function () {
            $.each(this.attributes, function () {
                if (this.specified && this.name.includes('data-')) {
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
    
    var createTree = function (Node, options, level) {
        
        var hasChildren = typeof Node.children !== 'undefined';
        var attribs = '';
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
                var x = level + 1;
                child[childNode[options.orderMember]] = createTree(childNode, options, x) + '\n';
            });
            child.forEach(function (obj) {
                childHtml = childHtml + obj;
            });
            attribs = attribs + 'data-badge="' + (child.length - 1) + '" ';
        }
        childHtml = childHtml + '</ul>';
        
        return '<li  id="li_' + Node.id + '"><div class="contentElement" ' + attribs + '><a href="#" id="url_' + Node[options.idMember] + '">' + Node[options.nameMember] + '</a></div>' + childHtml + '</li>';
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
    
    var createOpener = function (element, options, status) {
        $(element).children('div').children('span.opener').remove();
        var $childUl = $(element).children('ul');
        if ($childUl.length > 0 && $childUl.children().length) {
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
        createOpener(element, options, 'closed');
    };
    
    var collapsible = function (ul, options) {
        var $ul = $(ul);
        var $childrenLi = $ul.find('li');
        $ul.removeClass('nav nav-pills nav-stacked nav-tree ' + options.treeClasses).addClass('nav nav-pills nav-stacked nav-tree' + options.treeClasses);
        $childrenLi.each(function (index, li) {
            collapsibleAll($(li), options);
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
            idx++;
            if (options.createBadge) {
                $div.attr('data-badge', $(this).children('ul').first().children().length);
                appendBadge(this, options);
            }
            createOpener(this, options, 'opened');

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
    
    var _getJsonTree = function (ul, options){    
        var jsonTree = []
        $(ul).children().each(function () {
            var data = getData(this);
            var id = data[_options.idMember];
            jsonTree[id] = data;
            jsonTree[id].children = _getJsonTree($(this).children('ul').first(), options);
        });
        return jsonTree;

    }
    var _options = []
    var methods = {
        
        getJsonTree : function () {
            var t = _getJsonTree($(this).children('ul'), _options)
            return  t;
        }
    }
    
    

    $.fn.navTree = function (args) {
        
        
        
        if (methods[args]) {
            var defaults = $.fn.navTree.defaults;
            var options = $.extend(defaults, _options);
            _options = options;
            var t = methods[ args ].apply(this, Array.prototype.slice.call(arguments, 1));
            return t;
            console.log(t);

        } else if (typeof args === 'object' || !args) {
            var defaults = $.fn.navTree.defaults;
            var options = $.extend(defaults, args);
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
                //console.log(getJsonTree($(this).children('ul'), options));
            });
        }
    };
    
    $.fn.navTree.defaults = {
        navTreeExpanded: 'fa fa-plus-square',
        navTreeCollapsed: 'fa fa-minus-square',
        orderMember: 'orden',
        parentMember: 'par_id',
        idMember : 'id',
        nameMember : 'name',
        doubleTap: function (e, dataRow) { },
        enableDragDrop: false,
        source: null,
        treeId: 'myTree',
        treeClasses: '',
        createBadge: false,
    };
    
   
    
}(window.jQuery);