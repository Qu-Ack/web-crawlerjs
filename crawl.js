import { URL } from "node:url"
import {JSDOM} from "jsdom"
import { log } from "node:console";


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


async function crawl_web_page(baseURL , currentURL = baseURL , pages  = {}) {

		const baseURLObject = new URL(baseURL)
		const currentURLObject = new URL(currentURL);
		if (baseURLObject.hostname !== currentURLObject.hostname) {
				return pages
		} 
		const normalCurrentURL = normalizeUrl(currentURL);
		console.log(normalCurrentURL);
		if (normalCurrentURL in pages) {
				pages[normalCurrentURL] += 1
		} else {
				pages[normalCurrentURL] = 1
		}
		let html = '';
		try {
				html = await getHTML(currentURL);
		} catch(err) {
				console.log("failed to fetch html", err);
				return pages;
		}
		const links = getUrlsFromHtml(html, baseURLObject.origin)
		links.forEach(link => {
				crawl_web_page(baseURL, link, pages);
		})
		return pages
}
console.log(await crawl_web_page("https://www.wagslane.dev/"));


async function getHTML(url)
{
		try {

				const response = await fetch(url);
				if (response.status >= 400) {
						console.log("bad response");
				}
				const contentType = response.headers.get('content-type');
				if (contentType !== "text/html; charset=utf-8") {
						console.log("bad content type");
				}
				const html = await response.text()
				return html;
		} catch (err) {
				console.log("An Unexpected Error has occured: ", err);
		}
}



function getUrlsFromHtml(htmlbody, rootURL) {
		const dom = new JSDOM(htmlbody)
		const tags = dom.window.document.querySelectorAll('a');
		const extractedURLs = []
		tags.forEach(tag => {
				if (tag.href[0] == '/') {
						// it's a relative url 
						const rootURLObject = new URL(rootURL)
						const finalURL = `${rootURLObject.origin}${tag.href}/`
						extractedURLs.push(finalURL)
				}
				else if (tag.href[0] == 'h'){
						//normal url 
						const finalURL = tag.href
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
