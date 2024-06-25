import { URL } from "node:url"
import {JSDOM} from "jsdom"


function normalizeUrl(url) {
		if (url == "")  {
				return "invalid string"
		}
		let objecturl = new URL(url);	
		if (objecturl.pathname[objecturl.pathname.length - 1] == "/") {
				return objecturl.host + objecturl.pathname
		} else {
				return objecturl.host + objecturl.pathname + "/"
		}

}


async function crawl_web_page(url) {
		try {
				const response = await fetch(url);
				if (response.status >= 400){ 
						console.log("error occurred");
						return;
				}
				const contentType = response.headers.get('content-type')
				if (contentType !== "text/html; charset=utf-8") {
						console.log("bad return");
						return;
				} 
				const html = await response.text()
				console.log(html);
		} catch (err) {
				console.log("an unexpected error occured: ", err);
		}
}


function getUrlsFromHtml(htmlbody, rootURL) {
		const dom = new JSDOM(htmlbody)
		const tags = dom.window.document.querySelectorAll('a');
		const extractedURLs = []
		tags.forEach(tag => {
				if (tag.href[0] == '/') {
						// it's a relative url 
						const finalURL = `${normalizeUrl(rootURL)}${tag.href.substring(1)}/`;
						extractedURLs.push(finalURL)
				}
				else if (tag.href[0] == 'h'){
						//normal url 
						const finalURL = normalizeUrl(tag.href)
						console.log(finalURL)
						extractedURLs.push(finalURL)

				} else {
						console.log("not a valid url");
				}
		})
		if (extractedURLs.length == 0) {
				return [""]
		} else {
				return extractedURLs
		}
}

export { normalizeUrl , getUrlsFromHtml, crawl_web_page}
