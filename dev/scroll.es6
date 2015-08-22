'use strict'

import dA from "./domAssistant";

import {isNullUndefEmptyNaN, executeSetOfFunctions} from "./commonFunctions";

import * as domReady from "js/domReady";

class MScroll {
	constructor(targetElement){
		let fff = this;
		this.element = dA(targetElement).appointEvent('DOMSubtreeModified', this.scrollAreaChangeEvent).get();
	}
	
	scrollAreaChangeEvent(){
		//событие вызываем или при ресайзе окна или при изменении контента-дерева внутри целевого элемента, на который вешае скродд
		console.log(this)
		//если контент шире - добавляем вертикальный ползунок и полоску
		if (this.element.offsetWidth < this.element.scrollWidth && !this.vBar){
			this.vScrollElementsAttach();
			this.vScrollMouseDownEventBind();
			this.vScrollAreaWheelEventBind();
			this.vBarClickEventBind();
		}
			//в противном случае убираем
		if (this.element.offsetWidth == this.element.scrollWidth && this.vBar){
			this.vScrollElementsDetach();
			this.vScrollMouseDownEventUnbind();
			this.vScrollAreaWheelEventUnbind();
			this.vBarClickEventUnbind();
		}
		//то же для горизонтальной прокрутки
		if (this.element.offsetWidth < this.element.scrollWidth && !this.hBar){
			this.hScrollElementsAttach();
			this.hScrollMouseDownEventBind();
			this.hBarClickEventBind();
			if (this.element.offsetWidth == this.element.scrollWidth)
				this.hScrollAreaWheelEventBind();
		}
		
		if (this.element.offsetWidth == this.element.scrollWidth && this.hBar){
			this.hScrollElementsDetach();
			this.hScrollMouseDownEventUnbind();
			this.hScrollAreaWheelEventUnbind();
			this.hBarClickEventUnbind();
		}
	}		

	//элементы скрола - полоска bar и ползунок
	vScrollElementsAttach(){
		this.vSlider = dA(this.element).appendChild('v-slider-bar')
							.lastNodeAppendChild('v-slider').get();
		this.vBar = this.vSlider.parentNode;
		this.vSlider.style.Height = this.element.scrollHeight/this.element.offsetHeight;
	}
	
	vScrollElementsDetach(){
		 dA(this.vBar).removeChild(this.vSlider).removeChild(this.vBar);
	}
	
	hScrollElementsAttach(){
		this.hSlider = dA(this.element).appendChild('h-slider-bar')
							.lastNodeAppendChild('h-slider').get();
		this.hBar = this.hSlider.parentNode;
		this.hSlider.style.Width = this.element.scrollWidth/this.element.offsetWidth;
	}
	
	hScrollElementsDetach(){
		 dA(this.hBar).removeChild(this.hSlider).removeChild(this.hBar);
	}

	//зажатие ползунка - биндим событие подъема-опускания мыши
	vScrollMouseDownEventBind(){
		dA.appointEvent('mousedown', this.vSlider, (mDownEvent)=>{
			dA.appointEvent('mousemove', window, (moveEvent)=>{
				this.vBar.style.top = moveEvent.clientY;
			});
		});
	}
	
	vScrollMouseDownEventUnbind(){
		dA.disappointEvent('mousedown', this.vBar);
	}
	//бинд колеса мыши
	vScrollAreaWheelEventBind(){
		dA.appointEvent('wheel', this.vBar, (mWheelEvent)=>{
			if (this.vBar.style.top > 0 && this.vBar.style.top < this.vSlider.style.offsetHeight)
				this.vBar.style.top += mWheelEvent.deltaY;
		})
	}
	
	vScrollAreaWheelEventUnbind(){
		dA.disappointEvent('wheel', this.vBar);
	}
	//бинд клика по полоске для быстрой прокрутки к месту клика
	vBarClickEventBind(){
		dA.appointEvent('click', this.vBar, (clickEvent)=>{
			if (clickEvent.target = this.vSlider)
				return;

			let vBarRectangle = this.vBar.getBoundingClientRect();

			if (clickEvent.clientY > r.top && this.vSlider.style.top >= 5)
				this.vSlider.style.top -= 5;
			if (clickEvent.clientY > r.top && this.vSlider.style.top <= this.vSlider.style.offsetHeight - 5)
				this.vSlider.style.top += 5;
		});
	}
	
	vBarClickEventUnbind(){
		dA.disappointEvent('click', this.vBar)
	}
	
	hScrollMouseDownEventBind(){	
		dA.appointEvent('mousedown', this.hSlider, (mDownEvent)=>{
			dA.appointEvent('mousemove', window, (moveEvent)=>{
				this.hBar.style.left = moveEvent.clientX;
			});
		});
	}
	
	hScrollMouseDownEventUnbind(){	
		dA.disappointEvent('mousedown', this.hBar);
	}
	
	hScrollAreaWheelEventBind(){	
		dA.appointEvent('mousedown', this.hBar, (mWheelEvent)=>{
			if (this.hBar.style.left > 0 && this.hBar.style.top < this.hSlider.style.offsetWidth)
				this.hBar.style.left += mWheelEvent.deltaX;
		})
	}
	
	hScrollAreaWheelEventUnbind(){	
		dA.appointEvent('mousedown', this.hBar);
	}
	
	hBarClickEventBind(){
		dA.appointEvent('click', this.hBar, (clickEvent)=>{
			if (clickEvent.target = this.hSlider)
				return;

			let hBarRectangle = this.hBar.getBoundingClientRect();

			if (clickEvent.clientY > r.top && this.hSlider.style.left >= 5)
				this.hSlider.style.left -= 5;
			if (clickEvent.clientY > r.top && this.hSlider.style.left <= this.hSlider.style.offsetHeight - 5)
				this.hSlider.style.left += 5;
		});
	}
	
	hBarClickEventUnbind(){
		dA.disappointEvent('click', this.hBar)
	}
};

let initMScroll = function(){
	let scrolledElements = dA.getDocumentElementsWithAttribute("m-scrolled");
	let scrollObjectList = new Map();
	let i = 0;
	
	for (; i < scrolledElements.length; i++){
		let scrollObject = new MScroll(scrolledElements[i]);
		scrollObjectList.set(scrollObject, scrollObject.scrollAreaChangeEvent.bind(scrollObject));
	};

	//ресайз окна - могут измениться размеры элементов и мы должны пересчитать им всем скроллы
	window.addEventListener("resize", ()=>{ executeSetOfFunctions( scrollObjectList.values() ) });

	//событие 'отпуска' мыши - нужно для случая когда была зажата мышь на ползунке и мы вышли за пределы элемента
	window.addEventListener("mouseup", ()=>{ dA.disappointEvent('mousemove', window) });
};

domReady(function () {
	//initMScroll();
	let scrolledElements = dA.getByAttribute("m-scrolled");
	let ddda = dA(scrolledElements[0]).addClass('class1').appendChild('v-slider-bar')
		.lastNodeAppendChild('v-slider').get()
});