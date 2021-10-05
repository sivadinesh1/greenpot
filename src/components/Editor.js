import EDITOR_JS_TOOLS from '../components/utils/constants';
import EditorJs from 'react-editor-js';
import React, { useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { content } from '../utils/content';
import { useSnapshot } from 'valtio';
import Undo from 'editorjs-undo';

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			func.apply(context, args);
		}, wait);
	};
}

function MyEditor({ data, blogId }) {
	const instanceRef = useRef(null);
	const saveBlog = async () => {
		const savedData = await instanceRef.current.save();
		console.log('savedData', savedData);
		content.obj = savedData;
		let request = {
			id: blogId,
			content: savedData,
		};
		let resp = await axios.put(`/api/blog/updateContent`, request);
		console.log('test response content updtea--->1', resp);
	};

	const debounceOnChange = React.useCallback(debounce(saveBlog, 5000), []);

	// async function handleSave() {
	// 	const savedData = await instanceRef.current.save();
	// 	console.log('savedData', savedData);
	// 	content.obj = savedData;
	// 	setEditorData(savedData)
	// 	 saveBlog();
	// }
	// const handleReady = (editor) => {
	// 	debugger;
	// 	const undo = new Undo({ editor });
	// 	undo.initialize(data);
	// };

	// const handleReady = (editor) => {
	// 	const undo = new Undo({ editor });
	// 	undo.initialize(data);
	// };

	const handleReady = (editor) => {
		const undo = new Undo({ editor });
		undo.initialize(data === undefined || data == null ? jsonData : data);
	};

	return (
		<>
			<EditorJs
				// onChange={() => {
				// 	handleSave();
				// 	debounceOnChange()
				// }}
				onChange={(e) => debounceOnChange()}
				instanceRef={(instance) => (instanceRef.current = instance)}
				tools={EDITOR_JS_TOOLS}
				//  readOnly= {true}
				placeholder={'Let`s write an awesome story!'}
				data={data === undefined || data == null ? jsonData : data}
				onReady={handleReady}
			/>
		</>
	);
}

export default MyEditor;

const jsonData = {
	"time": 1633350325493,
	"blocks": [
		{
			"id": "4VvemuLPe_",
			"type": "header",
			"data": {
				"text": "Editor.js",
				"level": 2
			}
		},
		{
			"id": "h8ZN5wH8TV",
			"type": "paragraph",
			"data": {
				"text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text."
			}
		},
		{
			"id": "bbx0slP88v",
			"type": "header",
			"data": {
				"text": "Key features",
				"level": 3
			}
		},
		{
			"id": "2-qYQqx0xy",
			"type": "list",
			"data": {
				"style": "unordered",
				"items": [
					"It is a block-styled editor",
					"It returns clean data output in JSON",
					"Designed to be extendable and pluggable with a simple API"
				]
			}
		},
		{
			"id": "i1c4zIHA5R",
			"type": "header",
			"data": {
				"text": "What does it mean «block-styled editor»",
				"level": 3
			}
		},
		{
			"id": "UxrKRvRBqf",
			"type": "paragraph",
			"data": {
				"text": "Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\"cdx-marker\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core."
			}
		},
		{
			"id": "aOf1vNe5CP",
			"type": "paragraph",
			"data": {
				"text": "There are dozens of <a href=\"https://github.com/editor-js\">ready-to-use Blocks</a> and the <a href=\"https://editorjs.io/creating-a-block-tool\">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games."
			}
		},
		{
			"id": "iLThl6wF1m",
			"type": "header",
			"data": {
				"text": "What does it mean clean data output",
				"level": 3
			}
		},
		{
			"id": "CVrQZh2H7v",
			"type": "paragraph",
			"data": {
				"text": "Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below"
			}
		},
		{
			"id": "1nM5ENS7_6",
			"type": "paragraph",
			"data": {
				"text": "Given data can be used as you want: render with HTML for <code class=\"inline-code\">Web clients</code>, render natively for <code class=\"inline-code\">mobile apps</code>, create markup for <code class=\"inline-code\">Facebook Instant Articles</code> or <code class=\"inline-code\">Google AMP</code>, generate an <code class=\"inline-code\">audio version</code> and so on."
			}
		},
		{
			"id": "39VWA9Qsyz",
			"type": "paragraph",
			"data": {
				"text": "Clean data is useful to sanitize, validate and process on the backend."
			}
		},
		{
			"id": "LuYFn1IWWg",
			"type": "delimiter",
			"data": {}
		},
		{
			"id": "g-zFdDiLzy",
			"type": "paragraph",
			"data": {
				"text": "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏"
			}
		},
		{
			"id": "QU91eP62no",
			"type": "image",
			"data": {
				"file": {
					"url": "https://res.cloudinary.com/sanjayaalam/image/upload/v1623842405/ywrylwf97gcofvhmbj9r.jpg"
				},
				"caption": "",
				"withBorder": false,
				"stretched": false,
				"withBackground": false
			}
		}
	],
	"version": "2.22.2"
}
