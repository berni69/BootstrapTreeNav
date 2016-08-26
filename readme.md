BootstrapTreeNav
====================
[http://berni69.github.io/BootstrapTreeNav](http://berni69.github.io/BootstrapTreeNav) [![Build Status](https://travis-ci.org/berni69/BootstrapTreeNav.svg?branch=master)](https://travis-ci.org/berni69/BootstrapTreeNav)

BootstrapTreeNav is a javascript plugin for [Twitter Bootstrap 3](http://getbootstrap.com/) to help you create tree navigation menus, created and maintained by [Morris Singer](http://morrissinger.com).

*Setting Up the dev-environment*
We need install node.js, ruby and it's devkit.
Once we have this we need install jshint and grunt:
```
npm update
```
After that we are going to install libssas for ruby:
```
gem install sassc
```
Example
-------
![Bootstrap Tree Nav by Morris Singer](http://www.bitsdelocos.es/wp-content/uploads/2016/08/workingtree-1.png)

Quick start
-----------

Clone the repo, `git clone git://github.com/berni69/BootstrapTreeNav.git`, or [download the latest release](https://github.com/berni69/BootstrapTreeNav/zipball/master).

Add CSS, or SASS to your project, as appropriate, and add JS. Also, add [Font Awesome](http://fontawesome.io/) to your project, if you are not already including it with your installation of Twitter Bootstrap. Then, write your HTML:
```html
 <ul class="nav nav-pills nav-stacked nav-tree" id="myTree" data-toggle="nav-tree">
	 <li>
		 <div><a href="http://www.example.com" target="_blank">Item One (With Children) (has link)</a></div>
		 <ul class="nav nav-pills nav-stacked nav-tree">
			 <li>
				 <div><a href="#">Item A (Without Children)</a></div>
			 </li>
			 <li>
				 <div><a href="#">Item B (Without Children)</a></div>
			 </li>
			 <li>
				 <div><a href="#">Item C (Without Children)</a></div>
			 </li>
		 </ul>
	 </li>
	 <li>
		 <div><a href="#">Item Two (Without Children)</a></div>
	 </li>
	 <li>
		 <div><a href="#">Item Three (With Children and Grandchildren)</a></div>
		 <ul class="nav nav-pills nav-stacked nav-tree">
			 <li>
				 <div><a href="#">Item A (With Children)</a></div>
				 <ul class="nav nav-pills nav-stacked nav-tree">
					 <li>
						 <div><a href="#">Item I (Without Children)</a></div>
					 </li>
					 <li>
						 <div><a href="#">Item II (Without Children)</a></div>
					 </li>
					 <li class="active">
						 <div><a href="#">Item III (Without Children)</a></div>
					 </li>
				 </ul>
			 </li>
			 <li>
				 <div><a href="#">Item B (Without Children)</a></div>
			 </li>
			 <li>
				 <div><a href="#">Item C (With Children)</a></div>
				 <ul class="nav nav-pills nav-stacked nav-tree">
					 <li>
						 <div><a href="#">Item I (Without Children)</a></div>
					 </li>
					 <li>
						 <div><a href="#">Item II (Without Children)</a></div>
					 </li>
					 <li>
						 <div><a href="#">Item III (Without Children)</a></div>
					 </li>
				 </ul>
			 </li>
		 </ul>
	 </li>
 </ul>	 
```
In Javascript call it with:


```js
jQuery(document).ready(function()
{
		jQuery('#myTree').navTree();
});
```


Create tree from datasource:
```html
<div class="row">
	<div id="mnu"></div>
</div>
<script>
var dataSource = [
		   {
			  "id":"0",
			  "name":"Lorem Ipsum",
			  "id_par":null,
			  "orden":"1",
			  "children":{
				 "41":{
					"id":"41",
					"name":"Nam sollicitudin ",
					"id_par":"0",
					"orden":"1",
					"children":{
					   "3057":{
						  "id":"3057",
						  "name":"Nulla vestibulum",
						  "id_par":"41",
						  "orden":"1",
					   },
					   "3058":{
						  "id":"3058",
						  "name":"Second child",
						  "id_par":"41",
						  "orden":"2",
					   },
					   "3059":{
						  "id":"3059",
						  "name":"Second child",
						  "id_par":"41",
						  "orden":"3",
					   },
						
					}
				 },
				  "3057":{
							  "id":"1",
							  "name":"Aliquam faucibus",
							  "id_par":null,
							  "orden":"2",
						   }
			  }
		   },
		   
		];

var createTree= function(){
		jQuery('#mnu').navTree({source:dataSource[0],'createBadge':true});
}				
jQuery(document).ready(function()
{
	createTree();
});

</script>

```



Using the data API, you can also specify the following icons:


* `data-nav-tree-expanded="icon-collapse-alt"`: Use the Font Awesome icon `icon-collapse-alt` next to expanded items.
* `data-nav-tree-collapsed="icon-expand-alt"`: Use the Font Awesome icon `icon-expand-alt` next to collapsed items.

**OPTIONS**

Passing options to the plugin you can also specify the following icons:
* `navTreeExpanded`: Use the Font Awesome icon `fa fa-plus-square` next to expanded items.
* `navTreeCollapsed`: Use the Font Awesome icon `fa fa-minus-square` next to expanded items.
* `iconDeleteButton`: Use the Font Awesome icon `fa fa-trash-o fa-fw` next to expanded items.
* `iconEditButton"`: Use the Font Awesome icon `fa fa-pencil-square-o` next to expanded items.

The following options allows configure the datasource:

* `source`: Array that contains data that will be displayed on the tree.  (`Default`=`null`)
* `orderMember`: This field allows to specify in which order will be ordened the tree. (`Default`=`orden`)
* `parentMember`: This field contains the parentId of current element. (`Default`=`par_id`)
* `idMember`: This field contains the id of the current element. (`Default`=`id`)
* `nameMember`: This field contains the text of the element. (`Default`=`name`)

**Note: All members passed into json datasource will be inserted as attribs into the div element.**


*Events*

* `onClickEditButton`: This callback will be called if edit button is pressed. 
* `onClickDeleteButton`: This callback will be called if delete button is pressed. 
* `doubleTap`: This callback will be called if double click on a element is performed.

*Render Options*
* `createBadge`: This options add a badge to each element who has childs. (`Default`=`false`)
* `showEditButton`: This option enable an edit button when mouse is hover an element. (`Default`=`false`)
* `showDeleteButton`: This option enable a delete button when mouse is hover an element. (`Default`=`false`)
* `enableDragDrop`: This option enable a sortable tree. Requires (jquery.mjs.nestedSortable.js) . (`Default`=`false`)
* `treeClasses`: This classes will be appended to default tree-nav classes . (`Default`=``)
* `treeId`: This option specify the id of the first ul element. (`Default`=`myTree`)

*Buttons*
This option enable a toolbar on hover icon. Every object on this array must have the following fields:
* `label`: This will be the title of the button-
* `click`: This field is a function, it will be called when the event click would be fired.
* `icon`: Font Awesome icon of the button. 
* `class`: String, this will be added to the icon default classes-

```js
 buttons: [
   {
	   label: 'Edit',
	   click: function (e, data) {console.log(data);},
	   icon: 'fa fa-pencil-square-o',
	   'class': 'test'
   },
   {
	   label: 'Delete',
	   click: function (e, dataRow) { },
	   icon: 'fa fa-trash-o fa-fw',
	   'class': ''
   }
],
```


Authors
-------

**Morris Singer (since 2013)**
**Bernat Mut (since 2016)**


+ http://twitter.com/morrissinger
+ http://github.com/morrissinger


Copyright and license
---------------------

Copyright 2013 Morris Singer

Copyright 2016 Bernat Mut

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.