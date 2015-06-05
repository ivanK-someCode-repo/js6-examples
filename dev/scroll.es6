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
	
	scrollAreaChangeEvent(){
		if (this.element.offsetWidth < this.element.scrollWidth && !this.vSliderBar){
			vScrollElementsAttach();
			this.vScrollMouseDownEventBind();
			this.vScrollAreaWheelEventBind();
			this.vScrollBarClickEventBind();
		}
			
		if (this.element.offsetWidth == this.element.scrollWidth && this.vSliderBar){
			vScrollElementsDetach();
			this.vScrollMouseDownEventUnbind();
			this.vScrollAreaWheelEventUnbind();
			this.vScrollBarClickEventUnbind();
		}
		
		if (this.element.offsetWidth < this.element.scrollWidth && !this.hSliderBar){
			this.hScrollElementsAttach();
			this.hScrollMouseDownEvent();
			this.hScrollBarClickEventBind();
			if (this.element.offsetWidth == this.element.scrollWidth)
				this.hScrollAreaWheelEventBind();
		}
		
		if (this.element.offsetWidth == this.element.scrollWidth && this.hSliderBar){
			hScrollElementsDetach();
			this.hScrollMouseDownEventUnbind();
			this.hScrollAreaWheelEventUnbind();
			this.hScrollBarClickEventUnbind();
		}
	}		
	
	vScrollElementsAttach(){
		this.vSlider = dA(this.element).appendChild('v-slider-bar')
							.lastNodeAppendChild('v-slider').get();
		this.vSliderBar = this.vSlider.parentNode;
		this.vSlider.style.Height = this.element.scrollHeight/this.element.offsetHeight;
	}
	
	vScrollElementsDetach(){
		 dA(this.vSliderBar).removeChild(this.vSlider).removeChild(this.vSliderBar);
	}
	
	hScrollElementsAttach(){
		this.hSlider = dA(this.element).appendChild('h-slider-bar')
							.lastNodeAppendChild('h-slider').get();
		this.hSliderBar = this.hSlider.parentNode;
		this.hSlider.style.Width = this.element.scrollWidth/this.element.offsetWidth;
	}
	
	hScrollElementsDetach(){
		 dA(this.hSliderBar).removeChild(this.hSlider).removeChild(this.hSliderBar);
	}
	
	vScrollMouseDownEventBind(){
		dA.appointEvent('mousedown', this.vSlider, (mDownEvent)=>{
			dA.appointEvent('mousemove', window, (moveEvent)=>{
				this.vSliderBar.style.top = moveEvent.clientY;
			})
		})
	}
	
	vScrollMouseDownEventUnbind(){
		dA.disappointEvent('mousedown', this.vSliderBar);
	}
	
	vScrollAreaWheelEventBind(){
		dA.appointEvent('wheel', this.vSliderBar, (mWheelEvent)=>{
			if (this.vSliderBar.style.top > 0 && this.vSliderBar.style.top < this.vSlider.style.offsetHeight)
				this.vSliderBar.style.top += mWheelEvent.deltaY;
		})
	}
	
	vScrollAreaWheelEventUnbind(){
		dA.disappointEvent('wheel', this.vSliderBar);
	}
	
	vScrollBarClickEventBind(){
		
	}
	
	vScrollBarClickEventUnbind(){
		
	}
	
	hScrollMouseDownEventBind(){	
		dA.appointEvent('mousedown', this.hSlider, (mDownEvent)=>{
			dA.appointEvent('mousemove', window, (moveEvent)=>{
				this.hSliderBar.style.left = moveEvent.clientX;
			})
		})
	}
	
	hScrollMouseDownEventUnbind(){	
		dA.disappointEvent('mousedown', this.hSliderBar);
	}
	
	hScrollAreaWheelEventBind(){	
		dA.appointEvent('mousedown', this.hSliderBar, (mWheelEvent)=>{
			if (this.hSliderBar.style.left > 0 && this.hSliderBar.style.top < this.hSlider.style.offsetWidth)
				this.hSliderBar.style.left += mWheelEvent.deltaX;
		})
	}
	
	hScrollAreaWheelEventUnbind(){	
		dA.appointEvent('mousedown', this.hSliderBar);
	}
	
	hScrollBarClickEventBind(){
		
	}
	
	hScrollBarClickEventUnbind(){
		
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
	window.addEventListener("mouseup", ()=>{ dA.disappointEvent('mousemove', window) });
};

domReady(function () {
	initMScroll();
});