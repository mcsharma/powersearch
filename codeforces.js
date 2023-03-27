const { el } = require("date-fns/locale");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

var data = "";
rl.on("line", (line) => {
  data += line + "\n";
});

rl.once("close", () => {
  data = data.trimEnd();
  rows = data.split("\n");
  c = 0;
  var n = +rows[c];
  c++;
  for (var i = 0; i < n; i++) {
    var len = +rows[c];
    var s = rows[c + 1].toLowerCase();
    if (s.match(/^(m|M)+(e|E)+(o|O)+(w|W)+$/)) {
      console.log("yes");
    } else {
      console.log("no");
    }
    c += 2;
  }
  //  console.log(rows);
  // end of input
  process.exit(0);
});
