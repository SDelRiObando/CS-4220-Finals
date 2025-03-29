import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import {
  searchK,
  showKeywordHistory,
  showSelectionHistory,
} from "./app.js";

/*
  CLI setup with yargs
  this js page sets up the commands for user execution
*/
const argv = yargs(hideBin(process.argv))
  .usage("$0: Usage <command> [options]")
  // Command to search the API by the keyword.
  .command(
    "search <keyword> [selection]",
    "Search DnD API by Keyword",
    (yargs) => {
      yargs
        .positional("keyword", {
          describe: "Searching by DnD keyword game mechanic",
          type: "string",
          choices: ["monsters", "spells", "classes"],
        })
        .positional("selection", {
          describe: "Detailed search of a specific DnD mechanic by unique identifier",
          type: "string",
        });
    },
    async (args) => {
      console.log(`Searching for keyword: ${args.keyword}`);
      await searchK(args.keyword, args.selection || null);
    }
  )
  // Command to search the history by keywords or selection
  .command(
    "history <option>",
    "View history for previously searched keyword or selections",
    (yargs) => {
      yargs.positional("option", {
        describe: "Searching history by keywords or selection",
        type: "string",
        choices: ["keywords", "selections"],
      });
    },
    async (args) => {
      switch (args.option) {
        case "keywords":
          console.log("Showing history - keywords!");
          await showKeywordHistory();
          break;
        case "selections":
          console.log("Showing history - selections!");
          await showSelectionHistory();
          break;
      }
    }
  )
  .help().argv;
