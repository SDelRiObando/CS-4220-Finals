import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import {
  searchK,
  searchKS,
  showKeywordHistory,
  showSelectionHistory,
} from "./app.js";

/*
  CLI setup with yargs
  this js page sets up the commands for user execution
*/
const argv = yargs(hideBin(process.argv))
  .usage("$0: Usage <command> [options]")
  // command to search the api by the keyword.
  .command(
    "search <keyword> [selection]",
    "Search DnD Api by Keyword",
    (yargs) => {
      yargs
        .positional("keyword", {
          describe: "searching by DnD keyword game mechanic",
          type: "string",
          choices: ["monsters", "spells", "classes"],
        })
        .options("selection", {
          describe:
            "detailed search of a specific DnD mechanic by unique identifier",
          type: "string",
        });
    },
    async (args) => {
      console.log(`searching!`);
      if (args?.selection) {
        console.log(
          `with selection! - keyword: ${args.keyword} selection:${args.selection}`
        );
        // await searchKS(args.keyword, args.selection);
      } else {
        console.log(
          `only keyword, without selection! - keyword: ${args.keyword}`
        );
        // await searchK(args.keyword);
      }
    }
  )
  // command to search the history by keywords or selections
  .command(
    "history <option>",
    "View history for previously searched keyword or selections",
    (yargs) => {
      yargs.positional("option", {
        describe: "searching history by keywords or selections",
        type: "string",
        choices: ["keywords", "selections"],
      });
    },
    async (args) => {
      switch (args.option) {
        case "keywords":
          console.log("Showing history - keywords!");
          // await showKeywordHistory();
          break;
        case "selections":
          console.log("Showing history - selections!");
          // await showSelectionHistory();
          break;
      }
    }
  )
  .help().argv;
