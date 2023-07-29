const spawn = require("child_process").spawn;
const slang = require("slang");

const quote = (val) =>
  typeof val === "string" && process.platform !== "win32"
    ? '"' + val.replace(/(["\\$`])/g, "\\$1") + '"'
    : val;

const weasyprint = async (input, options, callback) => {
  let child;
  const keys = [];
  const args = [weasyprint.command];

  if (!options) {
    options = {};
  } else if (typeof options == "function") {
    callback = options;
    options = {};
  }

  let output = options.output;
  let unescapeHTML = options.unescapeHTML;
  delete options.unescapeHTML;
  delete options.output;
  delete options.swnOptn;

  console.log("options", options);

  // make sure the special keys are last

  if (!options.debug) {
    args.push("--quiet");
  }

  keys.forEach(function (key) {
    var val = options[key];
    if (key === "debug" || key === "debugStdOut") {
      // skip adding the ignore/debug keys
      return false;
    }
    key = key.length === 1 ? "-" + key : "--" + slang.dasherize(key);

    if (Array.isArray(val)) {
      // add repeatable args
      val.forEach(function (valueStr) {
        args.push(key);
        if (Array.isArray(valueStr)) {
          // if repeatable args has key/value pair
          valueStr.forEach(function (keyOrValueStr) {
            args.push(quote(keyOrValueStr));
          });
        } else {
          args.push(quote(valueStr));
        }
      });
    } else {
      // add normal args
      if (val !== false) {
        args.push(key);
      }

      if (typeof val !== "boolean") {
        args.push(quote(val));
      }
    }
  });

  // Input
  var isArray = Array.isArray(input);
  if (isArray) {
    input.forEach(function (element) {
      var isUrl = /^(https?|file):\/\//.test(element);
      if (isUrl) {
        args.push(quote(element));
      } else {
        console.log(
          "[node-wkhtmltopdf] [warn] Multi PDF only supported for URL files (http[s]:// or file://)"
        );
      }
    });
  } else {
    var isUrl = /^(https?|file):\/\//.test(input);
    if (unescapeHTML) {
      String.prototype.unescapeHTML = function () {
        var ret = this.replace(/&gt;/g, ">");
        ret = ret.replace(/&lt;/g, "<");
        ret = ret.replace(/&quot;/g, '"');
        ret = ret.replace(/&apos;/g, "'");
        ret = ret.replace(/&amp;/g, "&");
        return ret;
      };
      input = input.unescapeHTML();
    }
    if (input) {
      args.push(isUrl ? quote(input) : "-"); // stdin if HTML given directly
    }
  }

  // Output
  args.push(output ? quote(output) : "-"); // stdout if no output file

  if (process.platform === "win32") {
    child = spawn(args[0], args.slice(1), {
      shell: true,
    });
  } else {
    child = spawn(
      "/bin/sh",
      ["-c", "set -o pipefail ; " + args.join(" ") + " | cat"],
      {
        shell: true,
      }
    );
  }

  child.once("error", function (err) {
    throw new Error(err); // critical error
  });

  // write input to stdin if it isn't a url
  if (!isUrl && !isArray) child.stdin.end(input);

  return new Promise((resolve, reject) => {
    const buffers = [];
    const errBuffers = [];
    child.stdout.on("data", (chunk) => {
      buffers.push(Buffer.from(chunk));
    });
    child.stderr.on("data", (chunk) => {
      errBuffers.push(Buffer.from(chunk));
      err(chunk.toString("utf8").trim());
    });
    child.on("exit", function () {
      if (buffers.length !== 0) {
        resolve(Buffer.concat(buffers));
      } else {
        reject(new Error(Buffer.concat(errBuffers).toString("utf8")));
      }
    });
  });
};

weasyprint.command = "weasyprint";
weasyprint.shell = "/bin/bash";
module.exports = weasyprint;
