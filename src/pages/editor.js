//  import { EDITOR_JS_TOOLS } from "../components/utils/constants";
import React from "react";

// import EditorJs from "react-editor-js";

import dynamic from 'next/dynamic';

// let EditorJs;
// if (typeof window !== "undefined") {
//   // EditorJs = dynamic(() => import('react-editor-js'));
//   EditorJs = dynamic(() => import('react-editor-js'), { ssr: false });

// }

let MyEditor;
if (typeof window !== "undefined") {
  MyEditor = dynamic(() => import('../components/Editor'));
}




 const ReactEditor = () => {

  const instanceRef = React.useRef(null);

  
   
      return(
            <>
            {MyEditor &&
        <MyEditor   />
    }
            </>
      );

    // return(
    //   <React.Fragment>
    //   <button onClick={handleSave}>Save!</button>
    // {EditorJs &&  <EditorJs
    //     onChange={handleSave}
    //     instanceRef={instance => (instanceRef.current = instance)}
    //     tools={EDITOR_JS_TOOLS}
    //     data={{
    //       time: 1556098174501,
    //       version: "2.12.4"
    //     }}
    //   />}
    // </React.Fragment>
    // );
}

export default ReactEditor;