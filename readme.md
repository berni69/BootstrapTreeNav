BootstrapTreeNav
====================
http://berni69.github.io/BootstrapTreeNav

BootstrapTreeNav is a javascript plugin for [Twitter Bootstrap 3](http://getbootstrap.com/) to help you create tree navigation menus, created and maintained by [Morris Singer](http://morrissinger.com).

Example
-------
![Bootstrap Tree Nav by Morris Singer](http://i.imgur.com/BcwvICS.png)

Quick start
-----------

Clone the repo, `git clone git://github.com/berni69/BootstrapTreeNav.git`, or [download the latest release](https://github.com/berni69/BootstrapTreeNav/zipball/master).

Add CSS, or SASS to your project, as appropriate, and add JS. Also, add [Font Awesome](http://fontawesome.io/) to your project, if you are not already including it with your installation of Twitter Bootstrap. Then, write your HTML:
```html
     <ul class="nav nav-pills nav-stacked nav-tree" id="myTree" data-toggle="nav-tree">
         <li>
             <a href="http://www.example.com" target="_blank">Item One (With Children) (has link)</a>
             <ul class="nav nav-pills nav-stacked nav-tree">
                 <li>
                     <a href="#">Item A (Without Children)</a>
                 </li>
                 <li>
                     <a href="#">Item B (Without Children)</a>
                 </li>
                 <li>
                     <a href="#">Item C (Without Children)</a>
                 </li>
             </ul>
         </li>
         <li>
             <a href="#">Item Two (Without Children)</a>
         </li>
         <li>
             <a href="#">Item Three (With Children and Grandchildren)</a>
             <ul class="nav nav-pills nav-stacked nav-tree">
                 <li>
                     <a href="#">Item A (With Children)</a>
                     <ul class="nav nav-pills nav-stacked nav-tree">
                         <li>
                             <a href="#">Item I (Without Children)</a>
                         </li>
                         <li>
                             <a href="#">Item II (Without Children)</a>
                         </li>
                         <li class="active">
                             <a href="#">Item III (Without Children)</a>
                         </li>
                     </ul>
                 </li>
                 <li>
                     <a href="#">Item B (Without Children)</a>
                 </li>
                 <li>
                     <a href="#">Item C (With Children)</a>
                     <ul class="nav nav-pills nav-stacked nav-tree">
                         <li>
                             <a href="#">Item I (Without Children)</a>
                         </li>
                         <li>
                             <a href="#">Item II (Without Children)</a>
                         </li>
                         <li>
                             <a href="#">Item III (Without Children)</a>
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



Using the data API, you can also specify icons to display next to expanded and collapsed tree items:
* `data-nav-tree-expanded="icon-collapse-alt"`: Use the Font Awesome icon `icon-collapse-alt` next to expanded items.
* `data-nav-tree-collapsed="icon-expand-alt"`: Use the Font Awesome icon `icon-expand-alt` next to collapsed items.

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