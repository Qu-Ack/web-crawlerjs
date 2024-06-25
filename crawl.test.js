import {test, expect} from "@jest/globals"
import { getUrlsFromHtml, normalizeUrl } from "./crawl"


test("normalize url test1", () => {
		expect(normalizeUrl("https://boot.dev/path/")).toBe("boot.dev/path/")
})
test("normalize url test2", () => {
		expect(normalizeUrl("https://boot.dev/path")).toBe("boot.dev/path/")
})
test("normalize url test3",  () => {
		expect(normalizeUrl("http://boot.dev/path/")).toBe("boot.dev/path/")
})
test("normalize url test4", () => {
		expect(normalizeUrl("http://boot.dev/path")).toBe("boot.dev/path/")
})
test("normalize url test5", () => {
		expect(normalizeUrl("")).toBe("invalid string")
})


test("html test 1", () => {
		expect(getUrlsFromHtml("<html><body><a href='/xyz'></a></body></html>", "http://google.com/")).toStrictEqual(["google.com/xyz/"])
})

test("html test 2", () => {
		expect(getUrlsFromHtml("<html><body><a href='/xyz'></a></body></html>", "http://google.com")).toStrictEqual(["google.com/xyz/"])
})

test("html test 3", () => {
		expect(getUrlsFromHtml("<html><body><a href='https://google.com/'></a></body></html>", "http://google.com")).toStrictEqual(["google.com/"])
})

test("html test 4", () => {
		expect(getUrlsFromHtml("<html><body><a href='https://google.com/'></a><<a href='https://boot.dev/path'></a>/body></html>", "http://google.com")).toStrictEqual(["google.com/", "boot.dev/path/"])
})





