var domAssistant = (function(){
	let elementsStack = [];
	let elementsCount = 0;
	
	function assistant(tagName){
		elementsStack = [];
		elementsCount = 1;
		
		if (typeof tagName == "string")
			elementsStack[0] = document.createElement(tagName);
		else
			elementsStack[0] = tagName;

		return assistant;
	};
	
	assistant.createByTag = function(){
		elementsStack[0] = (document.createElement(tagName));
		return this;
	};

	assistant.appendChild = function(element, content){
		let newElement = document.createElement(element);
		if (content)
			newElement.innerHTML = content;
		elementsStack[0].appendChild(newElement);
		elementsStack.push(newElement);
		elementsCount++;

		return this;
	};

	assistant.lastNodeAppendChild = function(element, content){
		let newElement = document.createElement(element);
		if (content)
			newElement.innerHTML = content;
		elementsStack[elementsCount-1].appendChild(newElement);
		elementsStack.push(newElement);
		elementsCount++;

		return this;
	};
	
	assistant.removeChild = function(element){
		elementsStack[0].removeChild(element);
		return elementsStack[0].parentElement;
	};
	
	assistant.getDocumentElementsWithAttribute = function(attributeName, attributeValue="", element = document){
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
		let matchingElements = element.querySelectorAll(`[${attributeName}="${attributeValue}"]`);
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
		targetElement.parentNode.replaceChild(elementsStack[0],targetElement);
		return this;
	};

	assistant.appointEvent = function(eventType, eventTarget = elementsStack[elementsCount-1], eventFunction){
		eventTarget[`on${eventType}`] = eventFunction;
		return this;
	};
	
	assistant.disappointEvent = function(eventType, eventTarget = elementsStack[elementsCount-1]){
		eventTarget[`on${eventType}`] = null;
		return this;
	};
	
	assistant.rewriteCSSRule = function(rule, value){
		elementsStack[elementsCount-1].style[rule] = `${value}`;
		return this;
	};
	
	assistant.get = function(last){
		if (last)
			return elementsStack[elementsCount-1];
		return elementsStack[0];
	};
	
	return assistant;
})();

export default domAssistant;