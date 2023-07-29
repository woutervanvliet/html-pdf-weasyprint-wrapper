# htmlToPdf WeasyPrint Wrapper

This is a lightweight Node.js wrapper for the [weasyprint](http://weasyprint.org/) command-line tool. It converts HTML documents to PDFs asynchronously using WebKit.

[![NPM](https://nodei.co/npm/htmltopdf-wasyprint.svg)](https://nodei.co/npm/htmltopdf-wasyprint/)

## Installation

This is merely a wrapper, so you still need the WeasyPrint binary. First, install the `weasyprint` command line tool on your system. However, the process might be as simple as installing it with pip3.

    pip3 install weasyprint -g

You can also check the [Official Document](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#installation) for more system-specific details.

Finally, to install the node module, use `npm`:

    npm install htmltopdf-weasyprint --save

Be sure the `weasyprint` command line tool is in your PATH when you're done installing. If you don't want to do this, change
the `require('weasyprint').command` property to the path to the `weasyprint` command line tool.

## Usage

### Promise weasyprint(source, [options], [callback]);

```javascript
const weasyprint = require("htmltopdf-weasyprint");

// URL
const buffer = await weasyprint("https://google.com", {
  optimizeImages: true,
});
fs.writeFileSync("output.pdf", buffer);
// Path can be specified as ./path/output.pdf

// HTML
const buffer = await weasyprint("<h1>Hello</h1><p>Dolly!</p>");
// HTML Unescape
const buffer = await weasyprint(content, { unescapeHTML: true });
// The unescapeHTML function in a string performs the opposite action of escape.
// However, it can increase execution time, so use it only if necessary.

// Stream input and output
const buffer = await weasyprint("samplefile.html");

// output to a file directly
await weasyprint("https://apple.com/", { output: "output.pdf" });

// can be converted directly to binary
const buffer = await weasyprint("<h1>Test</h1><p>Hello world</p>");
const binary = `${buffer}`;

// Optional callback
try {
  const buffer = await weasyprint("https://apple.com");
  fs.writeFileSync("apple.pdf", buffer);
} catch (err) {
  console.error(err);
}
```

## Example

```javascript
const fs = require("fs");
const weasyprint = require("htmltopdf-weasyprint");

(async () => {
  try {
    const buffer = await weasyprint("<h1>Hello</h1><p>Dolly!</p>");
    fs.writeFileSync("output.pdf", buffer);
  } catch (err) {
    console.error(err);
  }
})();
```

`weasyprint` is just a function, which you call with either a URL or an inline HTML string, and it returns
a stream that you can read from or pipe to wherever you like (e.g. a file, or an HTTP response).

## Options

Command line API reference (https://doc.courtbouillon.org/weasyprint/stable/api_reference.html) available to
weasyprint. All command line options are supported as documented on the page linked above. The
options are camelCased instead of dashed as in the command line tool. Note that options that do not have values, must be specified as a boolean, e.g. **uncompressedPdf: true**

There is also an `output` option that can be used to write the output directly to a filename, instead of returning
a stream.

### Debug Options

There is only offical supported debugg option is **debug**. However you can use **debugStdOut** which will help you debug rendering issues, by outputting data to the console. **debug** prints and **stderr** messages while **debugStdOut** prints any **stdout** warning messages.

## Tests

Run `npm test` and manually check that generated files are like the expected files. The test suit prints the paths of the files that needs to be compared.

## License

MIT

> **_NOTE:_** This module is a slightly updated version of this [repo](https://github.com/tdzienniak/node-weasyprint), and has been re-uploaded to npm.
