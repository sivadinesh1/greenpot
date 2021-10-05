import EDITOR_JS_TOOLS from '../components/utils/constants';
import EditorJs from 'react-editor-js';
import React, { useCallback, useState, useRef } from 'react';

function EditorView({ content }) {
    console.log("check blog data----->", content)
    const instanceRef = useRef(null);
    return (
        <>
            <EditorJs
                instanceRef={(instance) => (instanceRef.current = instance)}
                tools={EDITOR_JS_TOOLS}
                readOnly={true}
                data={content}
            />

        </>
    );
}

export default EditorView;
