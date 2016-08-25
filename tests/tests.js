// funcion endsWith
String.prototype.endsWith = function (suffix) {
	'use strict';
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
// funciones auxiliares de traverseTree
var existsInNodeList = function (Node, List, sortable, tagName) {
	'use strict';
	for (var i = 0, len = List.length; i < len; i++) {
		var item = List.item(i);
		if ((Node.name === item.name) && (Node.value === item.value)) {
			return true;
		} else {
			if (sortable && (item.name === 'class')) {
				if (tagName === 'DIV') {
					if (item.value.endsWith('ui-sortable-handle')) {
						return true;
					}
				} else if (tagName === 'UL') {
					if (item.value.endsWith('ui-sortable')) {
						return true;
					}
				} else if (tagName === 'LI') {
					if (item.value.endsWith('mjs-nestedSortable-branch mjs-nestedSortable-expanded')) {
						return true;
					}
				}
			}
		}
	}
	console.log('ERROR: En ' + tagName + ' -> el atributo ' + Node.name + ' no coincide');
	return false;
};
var checkAttributeList = function (attrNode1, attrNode2, sortable, tagName) {
	'use strict';
	for (var i = 0, len = attrNode1.length; i < len; i++) {
		if (!existsInNodeList(attrNode1.item(i), attrNode2, sortable, tagName)) {
			return false;
		}
	}
	return true;
};

// Con sortable === false ->
//		recorre todo el arbol desde la raiz comprobando que todos los TAGs y Atributos coincidan con lo esperado
// Con sortable === true ->
//		recorre el arbol desde la raiz, comprobando que la única diferencia entre los dos
//		parámetros es el atributo añadido por la funcion sortable
var traverseTree = function (responseNode, expectedNode, sortable) {
	'use strict';
    var children1 = responseNode.children;
    var children2 = expectedNode.children;
	if (children1.length !== children2.length) {
		console.log('tag: ' + responseNode.tagName + ' -> children length not equal, response has ' + (children1.length - children2.length) + ' node(s) more than expected (minimum)');
		return false;
    }
    for (var i = 0, len = children1.length; i < len; i++) {
        var ch1 = children1[i];
        var ch2 = children2[i];
        if (ch1.tagName !== ch2.tagName) {
            return false;
        }
        // check attr
        var chAtt1 = ch1.attributes;
		var chAtt2 = ch2.attributes;
		if (chAtt1.length !== chAtt2.length) {
			if (!((sortable && (chAtt1.length + 1 === chAtt2.length) && (ch1.tagName === 'LI')) ||
				(sortable && (ch1.tagName === 'UL') && ((chAtt1.length === 1) && (chAtt2.length === 2))))) {
				console.log('tag: ' + ch1.tagName + ' sortable===' + sortable + ' -> attr length not equal, response has ' + (chAtt1.length - chAtt2.length) + ' attr(s) more than expected (minimum)');
				return false;
			}
		} else {
			if (sortable) {
				if (((ch1.tagName === 'UL') && (chAtt1.length !== 0)) || (ch1.tagName === 'LI')) {
					console.log('Error Sortable Test: attribute number mismatch');
					return false;
				}
			}
		}
		if (chAtt1.length !== 0) {
			if (!checkAttributeList(chAtt1, chAtt2, sortable, ch1.tagName)) {
				return false;
			}
		}
		// check text
		var str1 = ch1.textContent.replace(/\n|\r/g, '').replace(/ /g, '');
		var str2 = ch2.textContent.replace(/\n|\r/g, '').replace(/ /g, '');
		if (str1 !== str2) {
			console.log('tag: ' + ch1.tagName + ' -> text mismatch:');
			console.log('"' + str1 + '"');
			console.log('instead of');
			console.log('"' + str2 + '"');
			return false;
		}
        // go down
        if (traverseTree(ch1, ch2, sortable) === false) {
            return false;
        }
    }
    return true;
};

describe('navTree', function () {
	'use strict';
    describe('#GetData(): should return array of data- attribs inside a div childs', function () {
        it('Multiple div inside container', function () {
            var actual_obj = navTreeTesting.getData($('#getDataMultiplediv'));
            
            var expected_obj = [];
            expected_obj.test = 'aaa';
            expected_obj.tset = 'bbb';
            expected_obj.tets = 'ccc';
            expected_obj.ttse = 'ddd';
            chai.assert.deepEqual(actual_obj, expected_obj, 'MultipleDivs');

        });
        it('Multiple attribs in same div', function () {
            var actual_obj = navTreeTesting.getData($('#getDataElementdiv'));
            var expected_obj = [];
            expected_obj.test = 'aaa';
            expected_obj.tset = 'bbb';
            chai.assert.deepEqual(actual_obj, expected_obj, 'MultipleAttribs');
        });
        it('Multiple numeric divs inside container', function () {
            var actual_obj = navTreeTesting.getData($('#getDataMultipleNumericdiv'));
            var expected_obj = [];
            expected_obj['123'] = 'aaa';
            expected_obj['234'] = 'bbb';
            expected_obj['345'] = 'ccc';
            expected_obj['456'] = 'ddd';
            chai.assert.deepEqual(actual_obj, expected_obj, 'MultipleNumericDivs');
        });
        it('Multiple numeric attribs in same div', function () {
            var actual_obj = navTreeTesting.getData($('#getDataNumericElementdiv'));
            var expected_obj = [];
            expected_obj['123'] = 'aaa';
            expected_obj['234'] = 'bbb';
            expected_obj['345'] = 'ccc';
            expected_obj['456'] = 'ddd';
            chai.assert.deepEqual(actual_obj, expected_obj, 'MultipleNumericAttribs');
        });
        it('Multiple string, numeric and stringnumeric attribs in multiple divs', function () {
            var actual_obj = navTreeTesting.getData($('#getDataStringNumericAttribsdiv'));
            var expected_obj = [];
            expected_obj.test = 'aaa'; expected_obj['123'] = 'bbb'; expected_obj.tets = 'ccc'; expected_obj['234'] = 'ddd';
            expected_obj.ttes = 'aaa'; expected_obj['345'] = 'bbb'; expected_obj.ttse = 'ccc'; expected_obj['456'] = 'ddd';
            expected_obj.test1 = 'aaa'; expected_obj.test2 = 'bbb'; expected_obj['123t'] = 'ccc'; expected_obj['234t'] = 'ddd';
            expected_obj['000tes'] = 'aaa'; expected_obj['111tes'] = 'bbb'; expected_obj['222tes'] = 'ccc'; expected_obj['333tes'] = 'ddd';
            chai.assert.deepEqual(actual_obj, expected_obj, 'MultipleStrinNumericAttribsDivs');
        });
        it('data- string inside keys and values', function () {
            var actual_obj = navTreeTesting.getData($('#getDataDataTestdiv'));
            var expected_obj = [];
            expected_obj['data-aaa'] = 'aaa'; expected_obj['234'] = 'data-eee1';
            chai.assert.deepEqual(actual_obj, expected_obj, 'DataAttribs');
        });
        it('Random tests', function () {
            var actual_obj = navTreeTesting.getData($('#getDataRandomTest'));
            var expected_obj = [];
            expected_obj['-----endattribute'] = '---- nothing';
            expected_obj.attrib = '12e3';
            expected_obj['-'] = '';
            chai.assert.deepEqual(actual_obj, expected_obj, 'DataAttribs');

        });
        it('Random tests 2', function () {
            var actual_obj = navTreeTesting.getData($('#getDataRandomTest2'));
            var expected_obj = [];
            expected_obj['#'] = 'something';
            expected_obj['data-data-'] = 'somet';
            expected_obj['data-data-data'] = 'smt';
            expected_obj.test = 's';
            expected_obj.testing = 'testing';
            chai.assert.deepEqual(actual_obj, expected_obj, 'DataAttribs');

        });
    });
    describe('#CreateTree(): should create a tree from a nested array', function () {
        it('Create Tree test 1', function () {
            var options = $.fn.navTree.defaults;
            var dataSource = [
                {
                    'id': 'test1_root',
                    'name': 'Root',
                    'id_par': null,
                    'orden': '1',
                    'children': {
                        'test1_11': {
							'id': 'test1_11',
                            'name': 'First Child',
							'id_par': 'test1_root',
                            'orden': '1',
                        },
                        'test1_12': {
							'id': 'test1_12',
                            'name': 'Second Child',
							'id_par': 'test1_root',
                            'orden': '2',
                        }
                    }
                },
            ];
            
            var ht = navTreeTesting.createTree(dataSource[0], options);
            document.getElementById('createTreeResponse1').innerHTML = ht;
            var ResponseNode = document.getElementById('createTreeResponse1');
            
            var ExpectedNode = document.getElementById('createTreeTest1');
            
            chai.assert.deepEqual(traverseTree(ResponseNode.children[0], ExpectedNode.children[0], false), true, 'Create Tree 1 Failed');
		});
        it('Create Tree test 2, more children', function () {
            var options = $.fn.navTree.defaults;
            var dataSource = [
                {
					'id': 'test2_raiz',
                    'name': 'Root',
                    'id_par': null,
                    'orden': '1',
                    'children': {
                        'test2_11': {
							'id': 'test2_11',
                            'name': 'First Child',
							'id_par': 'test2_raiz',
                            'orden': '1',
                        },
                        'test2_12': {
							'id': 'test2_12',
                            'name': 'Second Child',
							'id_par': 'test2_raiz',
                            'orden': '2',
                            'children': {
                                'test2_121': {
									'id': 'test2_121',
                                    'name': 'First Second Child',
									'id_par': 'test2_12',
                                    'orden': '1',
                                },
                                'test2_122': {
									'id': 'test2_122',
                                    'name': 'Second Second Child',
									'id_par': 'test2_12',
                                    'orden': '2',
                                }
                            }
                        }
                    }
                },
            ];
            
            var ht = navTreeTesting.createTree(dataSource[0], options);
            document.getElementById('createTreeResponse2').innerHTML = ht;
            var ResponseNode = document.getElementById('createTreeResponse2');
            
            var ExpectedNode = document.getElementById('createTreeTest2');
            chai.assert.deepEqual(traverseTree(ResponseNode.children[0], ExpectedNode.children[0], false), true, 'Create Tree 2 Failed');
		});



        it('Create Tree test 4, children test in random positions', function () {
            var options = $.fn.navTree.defaults;
            var dataSource = [
                {
					'id': 'test4_raiz',
                    'name': 'Root',
                    'id_par': null,
                    'orden': '1',
                    'children': {
                        'test4_11': {
							'id': 'test4_11',
                            'name': 'First Child',
							'id_par': 'test4_raiz',
							'orden': '1',
							'children': {
								'test4_111': {
									'id': 'test4_111',
									'name': 'First First Child',
									'id_par': 'test4_11',
									'orden': '1',
									'children': {
										'test4_1111': {
											'id': 'test4_1111',
											'name': 'First First First Child',
											'id_par': 'test4_111',
											'orden': '1',
										},
										'test4_1112': {
											'id': 'test4_1112',
											'name': 'First First Second Child',
											'id_par': 'test4_111',
											'orden': '2',
										}
									}
								}
							}
                        },
                        'test4_12': {
							'id': 'test4_12',
                            'name': 'Second Child',
							'id_par': 'test4_raiz',
                            'orden': '2',
                            'children': {
                                'test4_121': {
									'id': 'test4_121',
                                    'name': 'Second First Child',
									'id_par': 'test4_12',
                                    'orden': '1',
                                },
                                'test4_122': {
									'id': 'test4_122',
                                    'name': 'Second Second Child',
									'id_par': 'test4_12',
                                    'orden': '2',
                                }
                            }
                        }
                    }
                },
            ];
            
            var ht = navTreeTesting.createTree(dataSource[0], options);
            document.getElementById('createTreeResponse4').innerHTML = ht;
            var ResponseNode = document.getElementById('createTreeResponse4');
            
            var ExpectedNode = document.getElementById('createTreeTest4');
            
            chai.assert.deepEqual(traverseTree(ResponseNode.children[0], ExpectedNode.children[0], false), true, 'Create Tree 4 Failed');
        });
	});
	describe('#sortable()', function () {

		it('Sortable Test 1', function () {
			var options = $.fn.navTree.defaults;
			var original = document.getElementById('test1_container_original');
			var container = document.getElementById('test1_container_original2'); //div con ul
			var sort = navTreeTesting.sortable($(container), options);
			chai.assert.deepEqual(traverseTree(original, container, true), true, true, 'Error Sortable Test 1');
		});
		it('Sortable Test 2, testing createTree + Sortable', function () {
			var options = $.fn.navTree.defaults;
			var dataSource = [
				{
					'id': 'test1_root',
					'name': 'Root',
					'id_par': null,
					'orden': '1',
					'children': {
						'test1_11': {
							'id': 'test1_11',
							'name': 'First Child',
							'id_par': 'test1_root',
							'orden': '1',
						},
						'test1_12': {
							'id': 'test1_12',
							'name': 'Second Child',
							'id_par': 'test1_root',
							'orden': '2',
						}
					}
				},
			];
			var ht = navTreeTesting.createTree(dataSource[0], options);
			document.getElementById('test2_original').innerHTML = ht;
			document.getElementById('test2_sortable').innerHTML = ht;
			var OriginalNode = document.getElementById('test2_container_original');

			var SortableNode = document.getElementById('test2_container_sortable');
			var sort = navTreeTesting.sortable($(SortableNode), options);
			
			var typ = document.createAttribute('id');
			typ.value = 'test2_sortable';
			document.getElementById('test2_original').attributes.setNamedItem(typ);
			chai.assert.deepEqual(traverseTree(OriginalNode, SortableNode, true), true, true, 'Error Sortable Test 2');
		});

	});
});

