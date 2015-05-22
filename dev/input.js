'use strict'

//можно сделать классом - оберткой над document для удобного создания элементов
let domAssistant = (function(){
	let elementsStack = [];
	let elementsCount = 0;
	
	function assistant(tagName){
		elementsStack = [];
		elementsCount = 1;
		
		if (typeof tagName == "string")
			elementsStack[0] = document.createElement(tagName);
		else
			elementsStack[0] = tagName;
	};
	
	assistant.createByTag = function(){
		elementsStack[0] = (document.createElement(tagName));
		return this;
	};

	assistant.appendChilds = function(elements, content){
		if (!elements || elements.length == 0)
			return;
			
		for (let i = 1; i < elements.length; i++){
			let newElement = document.createElement(elements[i]);
			if (content)
				newElement.innerHTML = content;
			elements[0].appendChild(newElement);
			elementsStack.push(newElement);
			elementsCount++;
		};	
			
		return this;
	};

	assistant.getDocumentElementsWithAttribute = function(attributeName, element = document){
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

	assistant.getDocumentElementsWithTagName = function(tagName, element = document){
		let matchingElements = element.querySelectorAll(`${className}`);
		return matchingElements;
	};

	assistant.getDocumentElementsWithClassName = function(className, element = document){
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

	assistant.get = function(last){
		if (last)
			return elementsStack[elementsCount-1];
		return elementsStack[0];
	};
	
	return assistant;
})();

let appointEvent = function(eventType, eventTarget, eventFunction){
	eventTarget[`on${eventType}`] = eventFunction;
};

let disappointEvent = function(eventType, eventTarget){
	eventTarget[`on${eventType}`] = null;
};

let valueCheck = function(value){
	if (typeof value !== 'undefined' || !value)
		return true;
	return false;
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

class MSelectInput extends MInput{
    constructor(targetElement, optionsList = [], offsetMultiplier = 0.1){
        super(targetElement);
		
		this.optionsList = optionsList;
		
		this.lastOptionIndex = 0;
		
		this.element = domAssistant(this.element).appendChilds(['ul','div']).addClass('ul-arrow').get();
		
		this.arrow = domAssistant.getDocumentElementsWithClassName('ul-arrow',this.element)[0];
		
		this.ul = domAssistant.getDocumentElementsWithTagName('ul',this.element)[0];
		
		this.offset = this.ul.scrollHeight * offsetMultiplier;
		
		this.currentOptionValue = null;
		
		//события скрытия-показа списка
		appointEvent('click',this.arrow,()=>{
			domAssistant(this.ul).removeClass('display-none');
			appointEvent('click',domAssistant.getDocumentElementsWithTagName("html")[0],(e)=>{this.htmlClickProcess(e)});
		});
		
		//события скролла и рендеринга списка
		appointEvent('scroll',this.ul,()=>{
			if (this.ul.scrollTop + this.ul.offsetHeight >= this.ul.scrollHeight - this.offset) {
				renderOption(this.ul,optionsList[this.lastOptionIndex],(e)=>{
					this.currentOptionValue = e.target.innerHTML;
					domAssistant(this.ul).addClass('display-none');
					disappointEvent('click',domAssistant.getDocumentElementsWithTagName("html")[0]);
				});
				
				lastOptionIndex++;
				if (lastOptionIndex == optionsList.length)
					disappointEvent('scroll',this.ul);
			}
		});
    }

	htmlClickProcess(e){
		if ($(event.target).closest('div.linbox-only-select') && $(event.target).closest('div.linbox-only-select')[0] != element[0]) {
			domAssistant(this.ul).addClass('display-none');
			disappointEvent('click',domAssistant.getDocumentElementsWithTagName("html")[0]);
		};
	}
	
	renderOption(parentElement, optionContent, event){
		let optionElement = domAssistant(parentElement).appendChilds(['li'], optionContent).get('last');
		appointEvent('click',optionElement,event);
	}
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