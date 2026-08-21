const { runBlock } = require("./run_block_cleanup");

const dryRun = process.argv.includes("--dry");
const result = runBlock({ block: "mi", dryRun });
console.log(JSON.stringify(result, null, 2));
