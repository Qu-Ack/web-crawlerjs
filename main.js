import { crawl_web_page } from "./crawl.js";
function main() {
		if (process.argv.length == 3) {
				crawl_web_page(process.argv[2]);
							
		} else {
				console.log("bad command line arguments");
		}
}


main()

