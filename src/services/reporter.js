export function printPresetSummary(config) {
  console.log();
  console.log("Selected Configuration");
  console.log();

  console.log(`Format     : ${config.format}`);
  console.log(`Quality    : ${config.quality}`);
  console.log(`Metadata   : ${config.metadata}`);
  console.log(`Resize     : ${config.resize ?? "No"}`);

  console.log();
}
