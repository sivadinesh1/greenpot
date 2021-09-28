import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";


const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  marker: Marker,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      uploader: {
        async uploadByFile(file) {
          let res = await onDrop(file);
          console.log("check upload file data --->", res)
          return res;
        },
        async uploadByUrl(url) {

          return {
            success: 1,
            file: {
              url: url,
            }
          }
        }
      }
    }
  },
  raw: Raw,
  header: Header,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage
};

export default EDITOR_JS_TOOLS;

const onDrop = async (acceptedFile) => {
  let path = `C${789}/B${48}/`;
  const { signature, timestamp } = await getSignature(path);
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;


  const formData = new FormData();
  formData.append('file', acceptedFile);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
  formData.append('folder', path);

  const response = await fetch(url, {
    method: 'post',
    body: formData,
  });
  const data = await response.json();
  let result = {
    success: 1,
    file: {
      url: data.url,
      caption: 'Here is a caption field',
      withBorder: false,
      withBackground: true,
      stretched: false
    }
  }
  return result;
}


async function getSignature(folderPath) {
  const response = await fetch(`/api/cloudinary/${folderPath}`);
  const data = await response.json();
  const { signature, timestamp } = data;
  return { signature, timestamp };
}