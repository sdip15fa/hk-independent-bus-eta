const express = require("express");
const fs = require("fs");
const resolve = require("path").resolve;
const puppeteer = require("puppeteer");
const jsdom = require("jsdom");
const CleanCSS = require("clean-css");
require("dotenv").config();
const cleanCss = new CleanCSS();

/**
 * @returns {object}
 */
async function readOptionsFromFile() {
  try {
    const config = await fs.readFileSync("./.rsp.json");
    const options = JSON.parse(config.toString());
    return options;
  } catch (err) {
    throw new Error(
      `Error: Failed to read options from '.rsp.json'.\nMessage: ${err}`
    );
  }
}

/**
 * @param {number} port
 * @param {string} routes
 * @param {string} dir
 * @returns {string|boolean}
 */
function runStaticServer(port, routes, dir) {
  try {
    const app = express();
    const resolvedPath = resolve(dir);
    app.use(express.static(resolvedPath));
    app.get("/*", (req, res) => {
      res.sendFile(`${resolvedPath}/index.html`);
    });

    app.listen(port);
    return `http://localhost:${port}`;
  } catch (err) {
    throw new Error(
      `Error: Failed to run puppeteer server on port ${port}.\nMessage: ${err}`
    );
  }
}

/**
 *
 * @param {string} route
 * @param {string} html
 * @param {string} dir
 */
async function createNewHTMLPage(route, html, dir) {
  try {
    const fname = decodeURIComponent(route === "/" ? "/index" : route);
    if (route.indexOf("/") !== route.lastIndexOf("/")) {
      const subDir = route.slice(0, route.lastIndexOf("/"));
      await ensureDirExists(`${dir}${subDir}`);
    }
    fs.writeFileSync(`${dir}${fname}.html`, html, {
      encoding: "utf-8",
      flag: "w",
    });
    console.log(`Created ${fname}.html`);
  } catch (err) {
    throw new Error(
      `Error: Failed to create HTML page for ${route}.\nMessage: ${err}`
    );
  }
}

/**
 *
 * @param {string} dir
 * @returns {Promise}
 */
function ensureDirExists(dir) {
  try {
    return fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    throw new Error(
      `Error: Failed to create directory for path ${dir}.\nMessage: ${err}`
    );
  }
}

/**
 * @param {object} page
 * @param {string} pageUrl
 * @returns {string|number}
 */
async function getHTMLfromPuppeteerPage(page, pageUrl, idx) {
  const url = new URL(pageUrl);
  await page.goto(pageUrl, { waitUntil: "networkidle0" });
  try {
    if (!pageUrl.includes("/route/")) {
      if (idx === 0) {
      } else if (pageUrl.includes("search")) {
        await page.click(`a[href="${url.pathname}"]`);
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      } else {
        await page.waitForTimeout(3000);
      }
      if (idx === 0) await page.waitForTimeout(3000); // wait decompression & loading data
    } else {
      const lang = pageUrl.split("/").slice(-3)[0];
      const q = decodeURIComponent(pageUrl.split("/").slice(-1)[0]);
      await page.evaluate(
        `document.querySelector('style[prerender]').innerText = ''`
      );
      // page.eva
      await page.evaluate(`
        if ( document.querySelector('[id="lang-selector"]').textContent === 'En' && '${lang}' === 'en' ) {
          document.querySelector('[id="lang-selector"]').click()
        }
        if ( document.querySelector('[id="lang-selector"]').textContent === '繁' && '${lang}' === 'zh' ) {
          document.querySelector('[id="lang-selector"]').click()
        }
      `);
      await page.evaluate((q) => {
        // programmatically change the search route value
        const input = document.getElementById("searchInput");
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(input, q);
        const ev2 = new Event("input", { bubbles: true });
        input.dispatchEvent(ev2);
      }, q);
      await page.waitForSelector(`input[id="${q}"][value="${q}"]`, {
        timeout: 1000,
      });
    }

    const html = await page.content();
    if (!html) return 0;

    const dom = new jsdom.JSDOM(html);
    const css = cleanCss.minify(
      Array.from(dom.window.document.querySelectorAll("style[data-emotion]"))
        .map((e) => e.textContent)
        .join("")
    ).styles;
    dom.window.document
      .querySelectorAll("style[data-emotion]")
      .forEach((e) => e.parentNode.removeChild(e));
    dom.window.document
      .querySelectorAll("img[role=presentation]")
      .forEach((e) => {
        e.style.opacity = 1;
        e.className = `${e.className} leaflet-tile-loaded`;
      });
    dom.window.document.querySelector("style[prerender]").textContent = css;

    return dom.serialize();
  } catch (err) {
    throw new Error(
      `Error: Failed to build HTML for ${pageUrl}.\nMessage: ${err}`
    );
  }
}

/**
 * @param {string} baseUrl
 * @param {string[]} routes
 * @param {string} dir
 * @returns {number|undefined}
 */
async function runPuppeteer(baseUrl, routes, dir) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const threads = 4;
  const arrLength = Math.ceil(routes.length / threads);
  const start = Date.now();
  await Promise.all(
    Array(threads)
      .fill(undefined)
      .map(async (v, index) => {
        const startIndex = index * arrLength;
        const arr = routes.slice(startIndex, startIndex + arrLength);
        const page = await browser.newPage();
        page.setRequestInterception(true);
        page.on("request", (request) => {
          // block map loading, google font, gov.hk and service-worker
          if (
            request.url().includes(process.env.REACT_APP_OSM_PROVIDER_HOST) ||
            request.url().includes("data.gov.hk") ||
            request.url().includes("gstatic") ||
            request.url().includes("service-worker")
          ) {
            request.abort();
          } else request.continue();
        });
        page.setUserAgent("prerendering");

        for (let i = 0; i < arr.length; i++) {
          const startTime = Date.now();
          let trial = 0;
          do {
            try {
              console.log(`Processing route "${arr[i]}"`);
              const html = await getHTMLfromPuppeteerPage(
                page,
                `${baseUrl}${arr[i]}`,
                i
              );
              if (html) {
                createNewHTMLPage(arr[i], html, dir);
                break;
              } else return 0;
            } catch (err) {
              console.log(`Retrying ${arr[i]}\nMessage: ${err}`);
              if (trial === 3) {
                console.error(
                  `Error: Failed to process route "${routes[i]}"\nMessage: ${err}`
                );
                process.exit(1);
              }
            }
            trial += 1;
          } while (trial < 3);
          console.log(`${(Date.now() - startTime) / 1000}s`);
        }
      })
  );

  await browser.close();
  console.log("Finished in " + (Date.now() - start) / 1000 + "s.");
}

async function run() {
  const options = await readOptionsFromFile();
  const staticServerURL = runStaticServer(
    options.port || 3000,
    options.routes || [],
    options.buildDirectory || "./build"
  );
  console.log(staticServerURL);
  if (!staticServerURL) return 0;

  await runPuppeteer(
    staticServerURL,
    ["/"].concat(options.routes),
    options.buildDirectory || "./build"
  );
  console.log("Finish react-spa-prerender tasks!");
  process.exit();
}

run();
