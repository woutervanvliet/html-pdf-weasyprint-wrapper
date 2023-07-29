const fs = require("fs");
const weasyprint = require("htmltopdf-weasyprint");

(async () => {
  try {
    const buffer = await weasyprint("<h1>Hello</h1><p>Dolly!</p>");
    fs.writeFileSync("test.pdf", buffer);
  } catch (err) {
    console.error(err);
  }
})();
