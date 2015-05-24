'use strict'

//можно сделать классом - оберткой над document для удобного создания элементов
import domAssistant from "domAssistant";

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
			.appendChild('input').addAttribute('type', 'text')
			.appendChild('div').addClass('clear-cross').addClass('display-none')
			.replace(targetElement).get();

		this.input = domAssistant.getDocumentElementsWithAttribute('type','text',this.element)[0];

		Object.defineProperty(this, "inputValue",{
			get: () => {
				if (this.input)
					return this.input.value;
				else
					return null;
			},
			set: (newValue) => {
				if (this.input)
					this.input.value = newValue;
			}
		});

		this.cross = domAssistant.getDocumentElementsWithClassName('clear-cross',this.element)[0];

		appointEvent('click',this.cross,()=>{
			this.inputValue = "";
			domAssistant(this.cross).addClass('display-none');
		});

		appointEvent('input',this.input,()=>{
			if (this.inputValue != "")
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
		
		this.element = domAssistant(this.element).appendChild('ul').appendChild('div').addClass('ul-arrow').get();
		
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
		let optionElement = domAssistant(parentElement).appendChild('li', optionContent).get('last');
		appointEvent('click',optionElement,event);
	}
}

let initMElements = function(){
	let inputElements = domAssistant.getDocumentElementsWithAttribute("m-input");
	let selectInputElems = domAssistant.getDocumentElementsWithAttribute("m-select-input");
	let multiSelectInputElems = domAssistant.getDocumentElementsWithAttribute("m-multi-select-input");

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