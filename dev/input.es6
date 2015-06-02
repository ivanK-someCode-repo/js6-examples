'use strict'

//можно сделать классом - оберткой над document для удобного создания элементов
import dA from "./domAssistant";

import * as domReady from "js/domReady";

//class
class MInput {
	constructor(targetElement) {
		this.element = dA('div').addClass('m-input-container')
			.appendChild('input').addAttribute('type', 'text')
			.appendChild('div').addClass('clear-cross').addClass('display-none')
			.replace(targetElement).get();

		this.input = dA.getDocumentElementsWithAttribute('type','text',this.element)[0];

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

		this.cross = dA.getDocumentElementsWithClassName('clear-cross',this.element)[0];

		dA.appointEvent('click',this.cross,()=>{
			this.inputValue = "";
			dA(this.cross).addClass('display-none');
		});

		dA.appointEvent('input',this.input,()=>{
			if (this.inputValue != "")
				dA(this.cross).removeClass('display-none');
			else
				dA(this.cross).addClass('display-none');
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
		
		this.element = dA(this.element).appendChild('ul').appendChild('div').addClass('ul-arrow').get();
		
		this.arrow = dA.getDocumentElementsWithClassName('ul-arrow',this.element)[0];
		
		this.ul = dA.getDocumentElementsWithTagName('ul',this.element)[0];
		
		this.offset = this.ul.scrollHeight * offsetMultiplier;
		
		this.currentOptionValue = null;
		
		//события скрытия-показа списка
		dA.appointEvent('click',this.arrow,()=>{
			dA(this.ul).removeClass('display-none');
			dA.appointEvent('click',dA.getDocumentElementsWithTagName("html")[0],(e)=>{this.htmlClickProcess(e)});
		});
		
		//события скролла и рендеринга списка
		dA.appointEvent('scroll',this.ul,()=>{
			if (this.ul.scrollTop + this.ul.offsetHeight >= this.ul.scrollHeight - this.offset) {
				renderOption(this.ul,optionsList[this.lastOptionIndex],(e)=>{
					this.currentOptionValue = e.target.innerHTML;
					dA(this.ul).addClass('display-none');
					dA.disappointEvent('click',dA.getDocumentElementsWithTagName("html")[0]);
				});
				
				lastOptionIndex++;
				if (lastOptionIndex == optionsList.length)
					dA.disappointEvent('scroll',this.ul);
			}
		});
    }

	htmlClickProcess(e){
		if ($(event.target).closest('div.linbox-only-select') && $(event.target).closest('div.linbox-only-select')[0] != element[0]) {
			dA(this.ul).addClass('display-none');
			dA.disappointEvent('click',dA.getDocumentElementsWithTagName("html")[0]);
		};
	}
	
	renderOption(parentElement, optionContent, event){
		let optionElement = dA(parentElement).appendChild('li', optionContent).get('last');
		dA.appointEvent('click',optionElement,event);
	}
}

let initMElements = function(){
	let inputElements = dA.getDocumentElementsWithAttribute("m-input");
	let selectInputElems = dA.getDocumentElementsWithAttribute("m-select-input");
	let multiSelectInputElems = dA.getDocumentElementsWithAttribute("m-multi-select-input");

	let inputObjectList = [];
	let i = 0;
	
	//вариант с использованием обертки, содержащей приветные поля класса
	//let clsWithLocal = mInputClassWrapper(MInput);
	//let mInput = new (mInputClassWrapper())("blc");
	
	for (; i < inputElements.length; i++){
		let inputObject = new MInput(inputElements[i]);
		inputObjectList.push(inputObject);
	}	
};

domReady(function () {
		initMElements();
    });

//document.addEventListener('DOMContentLoaded', initMElements, false);