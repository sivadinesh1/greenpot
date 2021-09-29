import EDITOR_JS_TOOLS from '../components/utils/constants';
import EditorJs from 'react-editor-js';
import React, { useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { content } from '../utils/content';
import { useSnapshot } from 'valtio';

function MyEditor({ data }) {
	const instanceRef = useRef(null);
	async function handleSave() {
		const savedData = await instanceRef.current.save();
		console.log('savedData', savedData);
		content.obj = savedData;
	}
	return (
		<>
			<EditorJs
				onChange={handleSave}
				instanceRef={(instance) => (instanceRef.current = instance)}
				tools={EDITOR_JS_TOOLS}
				//  readOnly= {true}
				placeholder={'Let`s write an awesome story!'}
				data={data}
			/>

		</>
	);
}

export default MyEditor;
