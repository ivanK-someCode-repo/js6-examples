var domAssistant = (function(){
	//some private variables here
	
	let assistant = Object.create(null);

	assistant.push = Array.prototype.push;

	assistant.createByTag = function(){
		this[0] = (document.createElement(tagName));
		return this;
	};

	assistant.appendChild = function(element, content){
		let newElement = document.createElement(element);
		if (content)
			newElement.innerHTML = content;
		this[0].appendChild(newElement);
		this.push(newElement);

		return this;
	};

	assistant.lastNodeAppendChild = function(element, content){
		let newElement = document.createElement(element);
		if (content)
			newElement.innerHTML = content;
		this[this.length-1].appendChild(newElement);
		this.push(newElement);

		return this;
	};
	
	assistant.removeChild = function(element){
		this[0].removeChild(element);
		return this[0].parentElement;
	};
	
	assistant.getByAttribute = function(attributeName, attributeValue="", element = document){
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

	assistant.getByTagName = function(tagName, element = document){
		let matchingElements = element.querySelectorAll(`${className}`);
		return matchingElements;
	};

	assistant.getByClassName = function(className, element = document){
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
		this[this.length-1].classList.add(className);
		return this;
	};

	assistant.removeClass = function(className){
		this[this.length-1].classList.remove(className);
		return this;
	};

	assistant.addAttribute = function(attributeName, attributeContent){
		this[this.length-1].setAttribute(attributeName, attributeContent);
		return this;
	};

	assistant.replace = function(targetElement){
		targetElement.parentNode.replaceChild(this[0],targetElement);
		return this;
	};

	assistant.appointEvent = function(eventType, eventTarget = this[this.length-1], eventFunction = function(){}){
		eventTarget[`on${eventType}`] = eventFunction;
		return this;
	};
	
	assistant.disappointEvent = function(eventType, eventTarget = this[this.length-1]){
		eventTarget[`on${eventType}`] = null;
		return this;
	};
	
	assistant.rewriteCSSRule = function(rule, value){
		this[this.length-1].style[rule] = `${value}`;
		return this;
	};
	
	assistant.get = function(last){
		if (last)
			return this[this.length-1];
		return this[0];
	};

	function assistantInterface(tagName){
		let assistantObject = Object.create(assistant);

		if (typeof tagName == "string")
			assistantObject.push(document.createElement(tagName));
		else
			assistantObject.push(tagName);

		return assistantObject;
	};

	Object.setPrototypeOf(assistantInterface, assistant);

	return assistantInterface;
})();

export default domAssistant;