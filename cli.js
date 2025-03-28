import yargs from "yargs/yargs";
import hideBin from "yargs/helpers";
import { searchK, searchKS, showKeywordHistory, showSelecctionHistory} from "./app.js";

/*
  CLI setup with yargs
  this js page sets up the commands for user execution
*/
const argv = yargs(hideBin(process.argv))
// command to search the api by the keyword.
  .command("search <keyword>", "Search DnD Api by Keyword", (yargs) => {
    yargs.positional("keyword", {
      describe: "keyword search",
      type: "string"
    });

  },
  async (argv) => {
    await searchK(argv.keyword);
    
  })
  .command ("detail <keyword> <slug>", "Detailed data for items via unique identifier", (yargs) => {
  yargs
  .positional("keyword",{
    describe:"keyword search",
    type: "string"
  })s
  .positional("slug", {
    describe:"keyword search",
    type: "string"
  });
  }, 

  // executes searchK function
  // it displays api results
  async (argv) => {
    await searchKS(argv.keyword, argv.slug);
  })

  /*
  commands to view previous keywrods from the history, additionally it allows users
  to view previous history searches
  */
  .command("history keywords","View previous search keywords", async () => {
    await showKeywordHistory();
  })
  .command("history selection","View previous selection", async () => {
    await showSelecctionHistory();
  })
  // help function that provides information to the user
  .help()
  .argv;


