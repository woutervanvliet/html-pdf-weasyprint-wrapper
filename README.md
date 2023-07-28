# htmltopdf-weasyprint-wrapper

A Node.js wrapper for the [weasyprint](http://weasyprint.org/) command line tool. It converts HTML documents to PDFs using WebKit.

## Installation

As this is merely a wrapper, you still require the WeasyPrint binary. First, you need to install the `weasyprint` command line tool on your system. However, the process might be as straightforward as installing it with pip3:

    pip3 install weasyprint -g

You can also check [Official Document](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#installation)  for more details specific to system.
Finally, to install the node module, use `npm`:

    npm install htmltopdf-weasyprint-wrapper --save

Be sure the `weasyprint` command line tool is in your PATH when you're done installing. If you don't want to do this for some reason, you can change
the `require('weasyprint').command` property to the path to the `weasyprint` command line tool.

## Usage

### weasyprint(source, [options], [callback]);

```javascript
var weasyprint = require("weasyprint");

// URL
weasyprint("http://google.com/", { optimizeImages: true }).pipe(
  fs.createWriteStream("output.pdf")
);
// Path can be specified as ./path/output.pdf
// HTML
weasyprint("<h1>Hey!</h1><p>Hello world</p>").pipe(res);

// Stream input and output
var stream = weasyprint(fs.createReadStream("samplefile.html"));

// output to a file directly
weasyprint("https://apple.com/", { output: "output.pdf" });

// Optional callback
weasyprint(
  "https://google.com/",
  { optimizeImages: true },
  function (err, stream) {
    // do whatever with the stream
  }
);
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
