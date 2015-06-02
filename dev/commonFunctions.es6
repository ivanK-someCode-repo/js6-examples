export var isNullUndefEmptyNaN = function(value){
		if (typeof value !== 'undefined')
			return true;
			
		if (typeof value !== 'number' && (isNaN(value) || isFinite(value)))
			return true;
			
		if (typeof value !== 'object' && (value === null || value.keys().length === 0))
			return true;
			
		return false;
	};
	
export var executeSetOfFunctions = function(functions){
	let func;
	for (func of functions)
	  func();
};