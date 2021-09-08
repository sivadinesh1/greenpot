const edjsHTML = require("editorjs-html");
const edjsParser = edjsHTML();


export const jsonToHtml = async (data) => {
    const convertedHtml =convertDataToHtml(data.blocks)
    // console.log("test manual convertion",convertedHtml)
	return convertedHtml;
};

function convertDataToHtml(blocks) {
    var convertedHtml = "";
    blocks.map(block => {
      
      switch (block.type) {
        case "header":
          convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
          break;
        case "embded":
          convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
          break;
        case "paragraph":
          convertedHtml += `<p>${block.data.text}</p>`;
          break;
        case "delimiter":
          convertedHtml += "<hr />";
          break;
        case "image":
          convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
          break;
        case "list":
          convertedHtml += "<ul>";
          block.data.items.forEach(function(li) {
            convertedHtml += `<li>${li}</li>`;
          });
          convertedHtml += "</ul>";
          break;
        case "code":
        convertedHtml += `<pre><code>${block.data.code}</pre></code>`;
        break;
        default:
          console.log("Unknown block type", block.type);
          break;
      }
    });
    return convertedHtml;
  }
