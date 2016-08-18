QUnit.module("bootstrap-treenav");
QUnit.test("GetData",function(assert){
	  var actual_obj = navTreeTesting.getData($('#TESTli'));
	  console.log (actual_obj);
	  var expected_obj = [];	  
	  expected_obj["test"]="aaa";
		   expected_obj["tset"]= "bbb";
		   expected_obj["tets"]= "ccc";
		   expected_obj["ttse"]="ddd";
	  assert.strictEqual(actual_obj,expected_obj,"GetData failed");
});