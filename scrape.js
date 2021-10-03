import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const url = "https://www.aeon.info/company/group/";
const html = await (await fetch(url)).text();
const dom = HTMLParser.parse(html);
//const divs = dom.querySelectorAll(".corp-group_box_title");
const divs = dom.querySelectorAll(".box");
console.log(divs.length);
const res = divs.map(div => {
  const url = div.querySelector("a")?.attributes.href || "";
  return {
    title: div.querySelector(".title")?.text,
    public: div.querySelector(".public")?.text,
    url: url.startsWith("/") ? "https://www.aeon.info" + url : url,
  };
}).filter(d => d.title);

// fix
res.forEach(d => {
  const chk = "https://jpn01.safelinks.protection.outlook.com/?url=";
  //console.log(d.url, d.url.startsWith("https://jpn01.safelinks.protection.outlook.com/?url="))
  if (d.url.startsWith(chk)) {
    console.log(d.url)
    const url1 = decodeURIComponent(d.url.substring(chk.length));
    console.log(url1, url1.lastIndexOf("&"))
    const url = url1.substring(0, url1.indexOf("&"));
    d.url = url;
  }
});

await Deno.writeTextFile("aeon-company.csv", CSV.stringify(res));
