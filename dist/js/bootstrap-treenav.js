/**
* bootstrap-treenav.js v1.0.1 by @morrissinger
* Copyright 2016 Morris Singer
* http://www.apache.org/licenses/LICENSE-2.0
*/
if (!jQuery) { throw new Error("Bootstrap Tree Nav requires jQuery"); }

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
    var oldContainer;
    $.fn.navTree = function (args) {
        
        var defaults = {
            navTreeExpanded: 'fa fa-plus-square',
            navTreeCollapsed: 'fa fa-minus-square',
            orderMember: 'orden',
            doubleTap: function (e, dataRow) { },
            enableDragDrop: false,
            source: null,
            createBadge: false,
        };
        
        var options = $.extend(defaults, args);
        
        if (options.enableDragDrop && typeof $.fn.nestedSortable !== 'function') {
            throw new Error('Bootstrap Tree Nav drag and drop requires jquery-ui-nestedSortable plugin');
        }
        
        if ($(this).prop('tagName') === 'LI') {
            collapsible(this, options);
        } else if ($(this).prop('tagName') === 'UL') {
            collapsible(this, options);
        }
        else if ($(this).prop('tagName') === 'DIV') {
            jQuery(this).html('<ul class="nav nav-pills nav-stacked nav-tree" id="myTree" data-toggle="nav-tree">' + createTree(options.source, options) + '</ul>');
            if (options.enableDragDrop) {
            //if (false) {
                $(this).children('ul').nestedSortable({
                    listType:'ul',
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
                    change: function () {
                        console.log('Relocated item');
                    }
                });
            }
            collapsible(this, options);
        }
        
        setDoubleClick(options);
	
    };
    
    var setDoubleClick = function (options) {
        $.touchtime = 0;
        $('.nav-tree > li').off('click').on('click', function (evt) {
            if ($.touchtime === 0) {
                $.touchtime = new Date().getTime();
            } else {
                if (((new Date().getTime()) - $.touchtime) < 800) {
                    if (typeof options.doubleTap === 'function') {
                        options.doubleTap(evt, getData(this));
                    }
                    $.touchtime = 0;
                } else {
                    $.touchtime = 0;
                }
            }
            return false;
        });
    };
    
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
        
        
        if (hasChildren) {
            var child = [];
            Object.keys(Node.children).forEach(function (key) {
                var childNode = Node.children[key];
                var x = level + 1;
                child[childNode[options.orderMember]] = createTree(childNode, options, x) + '\n';
            });
            childHtml = '<ul class="nav nav-pills nav-stacked nav-tree">\n';
            child.forEach(function (obj) {
                childHtml = childHtml + obj;
            });
            childHtml = childHtml + '</ul>';
            attribs = attribs + 'data-badge="' + (child.length - 1) + '" ';
        }
        return '<li><div class="contentElement" ' + attribs + '><a href="#" >' + Node.name + '</a></div>' + childHtml + '</li>';
    };
    
    var collapsible = function (element, options) {
        var $childrenLi = $(element).find('li');
        $childrenLi.each(function (index, li) {
            collapsibleAll($(li), options);
            if (options.createBadge && typeof $(li).children('div').attr('data-badge') !== 'undefined') {
                $(li).children('div').append('<span class="badge pull-right">' + $(li).children('div').attr('data-badge') + '</span>');
            }
            
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
    
    var collapsibleAll = function (element, options) {
        var $childUl = $(element).children('ul');
        if ($childUl.length > 0) {
            $childUl.hide();
            $(element).children('div').prepend('<span class="opener closed"><span class="tree-icon-closed"><i class="' + options.navTreeCollapsed + ' aria-hidden="true"></i></span><span class="tree-icon-opened"><i class="' + options.navTreeExpanded + '"></i></span></span>');
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
    
    $('ul[data-toggle=nav-tree]').each(function () {
        var $tree;
        $tree = $(this);
        $tree.navTree($tree.data());
    });
    
}(window.jQuery);