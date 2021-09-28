export const jsonToHtml = async (data) => {
    const convertedHtml = await convertDataToHtml(data.blocks, "layout1")
    return convertedHtml;
};

async function convertDataToHtml(blocks, layout) {
    var convertedHtml = "";
    convertedHtml += `<div class="${layout}_blog_posr_conatainer">`
    blocks.map(block => {

        switch (block.type) {
            case "header":
                convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case "embded":
                convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                break;
            case "paragraph":
                convertedHtml += `<p class="${layout}_blog_post_paragraph">${block.data.text}</p>`;
                // convertedHtml += `<p className=${styles.blog_post_paragraph}>${block.data.text}</p>`;
                break;
            case "delimiter":
                convertedHtml += "<hr />";
                break;
            case "image":
                convertedHtml += `<img class="${layout}_blog_post_image" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                break;
            case "list":
                convertedHtml += "<ul>";
                block.data.items.forEach(function (li) {
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

    convertedHtml += `</div>`
    return convertedHtml;
}
