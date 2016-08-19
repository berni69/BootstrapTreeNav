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
		it('Create Tree test', function () {
			//TODO
			var options = $.fn.navTree.defaults;
			var dataSource = [
				{
					'id': '0',
					'name': 'Lorem Ipsum',
					'id_par': null,
					'orden': '1',
					'children': {
						'41': {
							'id': '41',
							'name': 'Nam sollicitudin',
							'id_par': '0',
							'orden': '1',
						},
						'3057': {
							'id': '3057',
							'name': 'Aliquam faucibus',
							'id_par': null,
							'orden': '2',
						}
					}
				},
			];
			var result = navTreeTesting.createTree(dataSource[0], options);
			var expected =
				console.log('RESULT TREE->');
			console.log(result);
			console.log('<- END TREE');
			//chai.assert.deepEqual(false, true, 'Always fails');
		});

	});

});