import yargs from "yargs/yargs";
import hideBin from "yargs/helpers";


//Tags for api calls 
//filters
//list
//orderby
const argv = yargs(hideBin(process.argv))


  .help()
  .argv;
