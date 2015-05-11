'use strict'

//можно сделать классом - оберткой над document для удобного создания элементов
let domGenWrapperObject = {
	//arrow function
	createByTag:(tagName, stack)=>{
		let self = this;
		if (!this.elemsStack)
			let elemsStack = [];
		elemsStack.push(document.createElement(tagName));
		//object literals
		return {
			createByTag: self.createByTag,
			elemsStack
		};
	},
	appendChilds:(elements,classes)=>{
		if (elements.length < 2)
			return elements;
		
		let DomRootElem = elements[0];
		DomRootElem.className = classes[0]
		
		//let scope
		for (let i = 1; i < elements.length; i++){
			elements[i].className = classes[i];
			elements[0].appendChild(elements[i]);
		};
		return elements[0];
	}
}

//class!
class MInput {
    constructor(location, classes, eventListeners){
        this.inputContainer = this.buildDom(classes);
		this.listenDom(this.inputContainer, eventListeners);
    }
	
    buildDom(clsasses){
		//array destructing
		let [inputContainer, input, clearCross] = domGenWrapperObject.createByTag('div').createByTag('input').createByTag('div');
		
		//spread operator
		let appendArgs = [[inputContainer, input, clearCross], clsasses];
		return domGenWrapperObject.appendChilds(...appendArgs);
	}
	
	listenDom(dom, listeners){
		for (let i = 0; i < listeners.length; i++){
			let domElem;
			if listeners.type == "tag"
				domElem = dom.getElementsByTagName(listeners.mark);
			if listeners.type == "class"
				domElem = dom.getElementsByClassName(listeners.mark);
			else
				continue;
			domElem.addEventListener(listeners.eventName, listeners.eventItself, false);
		}
	}
}

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
	
    buildDom(clsasses){
        let baseInputContainer = super(clsasses);
		
		baseInputContainer.appendChild('div');
		//и тд, докрутить до инпута с опциями
    }
}

let initMElements = function(){
	let inputElems = document.getElementsByTagName("m-input");
	let selectInputElems = document.getElementsByTagName("m-select-input");
	let multiSelectInputElems = document.getElementsByTagName("m-multi-select-input");
	
	for (let i = 0; i < inputElems.length; i++){
		let mInput = new MInput(
							["m-input-container", "inptCls", "clear-cross"], 
							[{'type':'class','mark':'clear-cross','eventName':'click','eventItself':(event)=>{
								event.target.previousSibling.value = '';
								//this.previousSibling.value = ''
								/*отсюда надо как-то сослаться на инпут и почистить его*/}}])
		document.replaceChild(inputElems[i], mInput.inputContainer);
	}	
};

document.addEventListener('DOMContentLoaded', initMElements, false);