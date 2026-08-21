const { runBlock } = require("./run_block_cleanup");

const dryRun = process.argv.includes("--dry");
const result = runBlock({ block: "ped", dryRun });
console.log(JSON.stringify(result, null, 2));
