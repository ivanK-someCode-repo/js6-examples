'use strict'

import domAssistant from "./domAssistant";

import {isNullUndefEmptyNaN, executeSetOfFunctions} from "./commonFunctions";

import * as domReady from "js/domReady";

class MScroll {
	constructor(targetElement){
		this.element = dA(targetElement)
			.appointEvent('DOMSubtreeModified', this.scrollAreaChangeEvent)
			.get();
			
	}
	
	verticalScrollElementsAttach(){
		this.vSlider = dA(this.element).appendChild('v-slider-bar')
							.lastNodeAppendChild('v-slider').get();
		this.vSliderBar = this.vSlider.parentNode;
	}
	
	verticalScrollElementsDetach(){
		 dA(this.vSliderBar).removeChild(this.vSlider).removeChild(this.vSliderBar);
	}
	
	horizontalScrollElementsAttach(){
		this.hSlider = dA(this.element).appendChild('h-slider-bar')
							.lastNodeAppendChild('h-slider').get();
		this.hSliderBar = this.hSlider.parentNode;
	}
	
	horizontalScrollElementsDetach(){
		 dA(this.hSliderBar).removeChild(this.hSlider).removeChild(this.hSliderBar);
	}
	
	scrollAreaChangeEvent(){
		if (this.element.offsetWidth < this.element.scrollWidth && !this.vSliderBar)
			verticalScrollElementsAttach();
			
		if (this.element.offsetWidth == this.element.scrollWidth && this.vSliderBar)
			verticalScrollElementsDetach();
			
		if (this.element.offsetWidth < this.element.scrollWidth && !this.hSliderBar)
			horizontalScrollElementsAttach();
		
		if (this.element.offsetWidth == this.element.scrollWidth && this.hSliderBar)
			horizontalScrollElementsDetach();
	}		
};

let initMElements = function(){
	let scrolledElements = dA.getDocumentElementsWithAttribute("m-scrolled");
	let scrollObjectList = new Map();
	let i = 0;
	
	for (; i < scrolledElements.length; i++){
		let scrollObject = new MScroll(scrolledElements[i]);
		scrollObjectList.set(scrollObject, scrollObject.scrollAreaChangeEvent);
	};
	
	window.addEventListener("resize", ()=>{ executeSetOfFunctions( scrollObjectList.values() ) });
};

domReady(function () {
		initMScroll();
    });