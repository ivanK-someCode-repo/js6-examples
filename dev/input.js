'use strict'

//TODO
//проверка на null и тд

//можно сделать классом - оберткой над document для удобного создания элементов
let domAssistant = (function(){
	let elementsStack = [];
	let elementsCount = 0;
	
	//хотелось бы, чтоб как в jquery - объект еще и функция
	function assistant(tagName){
		elementsStack = [];
		elementsStack[0] = document.createElement(tagName);
		elementsCount = 1;
	};
	
	assistant.createByTag = function(){
		elementsStack[0] = (document.createElement(tagName));
		return this;
	};

	assistant.appendChilds = function(elements, classes){
		if (!elements || elements.length == 0)
			return;
			
		for (let i = 1; i < elements.length; i++){
			let newElement = document.createElement(elements[i]);
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

	assistant.getDocumentElementsWithAttribute = function(attributeName, element = document)
	{
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
		let matchingElements = element.querySelectorAll(`[${attributeName}]`);
		return matchingElements;
	};

	assistant.getDocumentElementsWithClassName = function(className, element = document)
	{
		//старый код
		/*
		 let matchingElements = [];
		 matchingElements = element.getElementsByClassName(className);
		 */
		//шаблонные строки
		let matchingElements = element.querySelectorAll(`.${className}`);
		return matchingElements;
	};

	assistant.addClass = function(className){
		elementsStack[elementsCount-1].classList.add(className);
		return this;
	};

	assistant.removeClass = function(className){
		elementsStack[elementsCount-1].classList.remove(className);
		return this;
	};

	assistant.addAttribute = function(attributeName, attributeContent){
		elementsStack[elementsCount-1].setAttribute(attributeName, attributeContent);
		return this;
	};

	assistant.replace = function(targetElement){
		document.replaceChild(targetElement, elementsStack[0]);
		return this;
	};

	assistant.get = function(){
		return elementsStack[0];
	};
	
	return assistant;
})();

let appointEvent = function(eventType, eventTarget, eventFunction){
	eventTarget[`on${eventType}`] = eventFunction;
};

//class
class MInput {
	constructor(targetElement) {
		this.element = domAssistant('div').addClass('m-input-container')
			.appendChilds(['input']).addAttribute('type', 'text')
			.appendChilds(['div']).addClass('clr-cross').addClass('display-none')
			.replace(targetElement).get();

		this.input = domAssistant.getDocumentElementsWithAttribute('text',this.element)[0];

		Object.defineProperty(this, "value",{
			get: () => { return this.input.value; },
			set: (nweValue) => { this.input.value = newValue; },
			enumerable: true,
			writable: true
		});

		this.cross = domAssistant.getDocumentElementsWithClassName('clr-cross',this.element)[0];

		appointEvent('click',this.cross,()=>{
			this.value = "";
			domAssistant(this.cross).addClass('display-none');
		});

		appointEvent('input',this.input,()=>{
			if (this.value != "")
				domAssistant(this.cross).removeClass('display-none');
			else
				domAssistant(this.cross).addClass('display-none');
		});
	}
}

//обертка для хранения приватных полей и методов класса
/*
let mInputClassWrapper = function(cls){
	let _MInputContainerBaseClass;
	let _MInputTextElement;
	return cls;
}
*/

//из-за обертки проблемка, для наследования надо или переписать обертку или забить на приветные переменные, или вынести как-то класс из обертки
class MSelectInput extends MInput{
    constructor(location, classes, eventListeners){
        super(location, classes, eventListeners);
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
}

let initMElements = function(){
	let inputElements = document.getElementsByTagName("m-input");
	let selectInputElems = document.getElementsByTagName("m-select-input");
	let multiSelectInputElems = document.getElementsByTagName("m-multi-select-input");

	let inputObjectList = [];

	//вариант с использованием обертки, содержащей приветные поля класса
	//let clsWithLocal = mInputClassWrapper(MInput);
	//let mInput = new (mInputClassWrapper())("blc");
	
	for (let i = 0; i < inputElements.length; i++){
		let inputObject = new MInput(inputElements[i]);
		inputObjectList.push(inputObject);
	}	
};

document.addEventListener('DOMContentLoaded', initMElements, false);