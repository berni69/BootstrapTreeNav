describe('navTree', function () {
	'use strict';
    describe('#GetData(): should return array of data- attribs inside a div childs', function () {
        it('Multiple div inside container', function () {
            console.log(typeof navTreeTesting.getData);
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
            console.log(actual_obj);
            var expected_obj = [];
            expected_obj.test = 'aaa';
            expected_obj.tset = 'bbb';
            chai.assert.deepEqual(actual_obj, expected_obj, 'msg test');
        });
    });
});