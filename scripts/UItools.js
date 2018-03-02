import debug from './debug.js';

const UItools = {
	////////////// BASE //////////////
	// Create a new DOM element and attach the classes/id's
	createElement: function(classes, id, elementName = 'div') {
		let element = document.createElement(elementName);
		if (id) {
			element.id = id;
		}
		this.addClasses(element, classes);
		return element;
	},
	// Add handler to element
	addHandler: function(element, handler, type = 'click') {
		element.addEventListener(type, handler);
		return element;
	},
	// Add classes to element
	addClasses: function(element, classes) {
		if (classes) {
			if (typeof classes === 'string') {
				try {
					element.classList.add(classes);
				} catch (e) {
					console.warn('Multiple classes should be an array');
				}
				return element;
			} else if (classes.length > 0) {
				classes.forEach(function(cl) {
					element.classList.add(cl);
				});
				return element;
			}
		}
		return element;
	},
	////////// BASE HELPERS //////////
	// Make sure the value is parsed into an array
	forceArray: function(value) {
		if (!value) {
			debug.warn('UItools: forceArray: No value passed');
		}
		if (!Array.isArray(value)) {
			value = [value];
		}
		return value;
	},
	// Create inline text element and set text
	getText: function(string, classes, id, elementName = 'p') {
		let element = this.createElement(classes, id, elementName);
		element.innerText = string;
		return element;
	},
	// Create A using getText, set path
	getLink: function(text, path, classes, id) {
		let element = this.getText(text, classes, id, 'a');
		element.href = path;
		return element;
	},
	// Create list
	getList: function(listItems, classes, id, type = 'ul') {
		var element = this.createElement(classes, id, type);
		listItems.forEach((listItem) => {
			if (typeof listItem === 'string') {
				listItem = this.getListItem(listItem);
			}
			element.appendChild(listItem);
		});
		return element;
	},
	// Create list item
	getListItem: function(text, classes, id) {
		var element = this.createElement(classes, id, 'li');
		// TODO: Make sure to accept either string or elements
		// Possibly use naming conventing "content"
		element.innerText = text;
		return element;
	},
	// Create A in list item
	getLinkListItem: function(text, path, classes, id) {
		var element = this.getListItem(null, classes, id);
		var linkElement = this.getLink(text, path);
		element.appendChild(linkElement);
		return element;
	},
	getLabel: function(string, classes, id) {
		var element = this.getText(string, classes, id, 'label');
		return element;
	},
	getInput: function(label, type, name, fieldValue = '', placeholder = ' ', classes) {
		if (typeof label === 'object') {
			label.setAttribute('for', name);
		}
		var element = this.createElement(classes, name, 'input');
		element.type = type;
		element.value = fieldValue;
		if (type !== 'submit') {
			element.name = name;
			element.placeholder = placeholder;
		}
		return this.wrap([label, element]);
	},
	getForm: function(name, fields, formAction = '/', submitText = 'Submit', classes, id) {
		var form = this.createElement(classes, id, 'form');
		form.action = formAction;
		form.name = name;
		fields = this.forceArray(fields);
		fields.forEach((field) => {
			form.appendChild(field);
		});
		form.appendChild(this.getInput('', 'submit', '', submitText));
		return form;
	},
	///////////// RENDER /////////////
	// Render in container
	render: function(content, container) {
		// TODO: Add position option
		content = this.forceArray(content);
		content.forEach((item) => {
			// if (typeof item === 'string') {
			// 	item = this.getText(item);
			// }
			container.appendChild(item);
		});
		// container.appendChild(content);
		return container;
	},
	// Wrap some content in new element
	wrap: function(content, classes, id, elementName = 'div') {
		var element = this.createElement(classes, id, elementName);
		content = this.forceArray(content);
		content.forEach((item) => {
			if (typeof item === 'string') {
				item = this.getText(item);
			}
			element.appendChild(item);
		});
		return element;
	},
	// Render in a wrapper (block)
	// uses render
	renderIn: function(content, container, classes, id, elementName = 'div') {
		if (!container) {
			debug.warn('No container/target, use wrap instead()');
		} else {
			return this.render(this.wrap(content, classes, id, elementName), container);
		}
	},
	// Render in an inline element
	// Uses renderDiv
	renderText: function(text, container, classes, id, type = 'p') {
		if (typeof text === 'string') {
			text = this.getText(text);
		}
		return this.renderIn(text, container, classes, id, type);
	},


	////////////// TEST //////////////
	////////////// TEST //////////////


	// TODO: FORM stuff
};

export default UItools;