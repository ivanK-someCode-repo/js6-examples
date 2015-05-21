'use strict';

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

//TODO
//проверка на null и тд

//можно сделать классом - оберткой над document для удобного создания элементов
var domAssistant = (function () {
	var elementsStack = [];
	var elementsCount = 0;

	//хотелось бы, чтоб как в jquery - объект еще и функция
	function assistant(tagName) {
		elementsStack = [];
		elementsStack[0] = document.createElement(tagName);
		elementsCount = 1;
	};

	assistant.createByTag = function () {
		elementsStack[0] = document.createElement(tagName);
		return this;
	};

	assistant.appendChilds = function (elements, classes) {
		if (!elements || elements.length == 0) return;

		for (var i = 1; i < elements.length; i++) {
			var newElement = document.createElement(elements[i]);
			/*
   if (classes.hasKey(elements[i])){
   	for (let j = 1; j < classes[elements[i]].length; j++)
   		newElement.className = classes[elements[i]][j];
   }
   */
			elements[0].appendChild(elements[i]);
			elementsStack.push(elements[i]);
			elementsCount++;
		};

		return this;
	};

	assistant.getDocumentElementsWithAttribute = function (attributeName) {
		var element = arguments[1] === undefined ? document : arguments[1];

		//старый код
		/*
  let matchingElements = [];
  let allElements = element.getElementsByTagName('*');
  for (let i = 0, n = allElements.length; i < n; i++){
  	if (allElements[i].getAttribute(attribute) !== null){
  		  // Element exists with attribute. Add to array.
  		  matchingElements.push(allElements[i]);
  		}
  }
  */
		//шаблонные строки
		var matchingElements = element.querySelectorAll('[' + attributeName + ']');
		return matchingElements;
	};

	assistant.getDocumentElementsWithClassName = function (className) {
		var element = arguments[1] === undefined ? document : arguments[1];

		//старый код
		/*
   let matchingElements = [];
   matchingElements = element.getElementsByClassName(className);
   */
		//шаблонные строки
		var matchingElements = element.querySelectorAll('.' + className);
		return matchingElements;
	};

	assistant.addClass = function (className) {
		elementsStack[elementsCount - 1].classList.add(className);
		return this;
	};

	assistant.removeClass = function (className) {
		elementsStack[elementsCount - 1].classList.remove(className);
		return this;
	};

	assistant.addAttribute = function (attributeName, attributeContent) {
		elementsStack[elementsCount - 1].setAttribute(attributeName, attributeContent);
		return this;
	};

	assistant.replace = function (targetElement) {
		document.replaceChild(targetElement, elementsStack[0]);
		return this;
	};

	assistant.get = function () {
		return elementsStack[0];
	};

	return assistant;
})();

var appointEvent = function appointEvent(eventType, eventTarget, eventFunction) {
	eventTarget['on' + eventType] = eventFunction;
};

//class

var MInput = function MInput(targetElement) {
	var _this = this;

	_classCallCheck(this, MInput);

	this.element = domAssistant('div').addClass('m-input-container').appendChilds(['input']).addAttribute('type', 'text').appendChilds(['div']).addClass('clr-cross').addClass('display-none').replace(targetElement).get();

	this.input = domAssistant.getDocumentElementsWithAttribute('text', this.element)[0];

	Object.defineProperty(this, 'value', {
		get: function get() {
			return _this.input.value;
		},
		set: function set(nweValue) {
			_this.input.value = newValue;
		},
		enumerable: true,
		writable: true
	});

	this.cross = domAssistant.getDocumentElementsWithClassName('clr-cross', this.element)[0];

	appointEvent('click', this.cross, function () {
		_this.value = '';
		domAssistant(_this.cross).addClass('display-none');
	});

	appointEvent('input', this.input, function () {
		if (_this.value != '') domAssistant(_this.cross).removeClass('display-none');else domAssistant(_this.cross).addClass('display-none');
	});
};

//обертка для хранения приватных полей и методов класса
/*
let mInputClassWrapper = function(cls){
	let _MInputContainerBaseClass;
	let _MInputTextElement;
	return cls;
}
*/

//из-за обертки проблемка, для наследования надо или переписать обертку или забить на приветные переменные, или вынести как-то класс из обертки

var MSelectInput = (function (_MInput) {
	function MSelectInput(location, classes, eventListeners) {
		_classCallCheck(this, MSelectInput);

		_get(Object.getPrototypeOf(MSelectInput.prototype), 'constructor', this).call(this, location, classes, eventListeners);
	}

	/*
    newMtd(){
        return "111";
    }
 */

	/* надо проверить, что будет, если явно не переопределить неизменяемую при наследовании функцию
 listenDom(dom, listeners){
 	super(location, classes, eventListeners);
 }
 */
	/*
    buildDom(clsasses){
        let baseInputContainer = super(clsasses);
 	
 	baseInputContainer.appendChild('div');
 	//и тд, докрутить до инпута с опциями
    }*/

	_inherits(MSelectInput, _MInput);

	return MSelectInput;
})(MInput);

var initMElements = function initMElements() {
	var inputElements = document.getElementsByTagName('m-input');
	var selectInputElems = document.getElementsByTagName('m-select-input');
	var multiSelectInputElems = document.getElementsByTagName('m-multi-select-input');

	var inputObjectList = [];

	//вариант с использованием обертки, содержащей приветные поля класса
	//let clsWithLocal = mInputClassWrapper(MInput);
	//let mInput = new (mInputClassWrapper())("blc");

	for (var i = 0; i < inputElements.length; i++) {
		var inputObject = new MInput(inputElements[i]);
		inputObjectList.push(inputObject);
	}
};

document.addEventListener('DOMContentLoaded', initMElements, false);
//# sourceMappingURL=scripts.js.map