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
		undo.initialize(data);
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
				data={data}
				onReady={handleReady}
			/>
		</>
	);
}

export default MyEditor;
