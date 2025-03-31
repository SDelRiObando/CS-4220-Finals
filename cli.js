import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import {
  searchApiByKeyword,
  searchApiByKeywordAndSelection,
  showKeywordHistory,
  showSelectionHistory,
} from "./app.js";

//Weston and Angel
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
          choices: ["monsters", "spells", "classes", "spelllist", "documents", "backgrounds",
                    "planes", "sections", "feats", "conditions", "races", "magicitems", "weapons", "armor"],
        })
        .positional("selection", {
          describe:
            "Detailed search of a specific DnD mechanic by unique identifier",
          type: "string",
        });
    },
    async (args) => {
      if (args?.selection) {
        await searchApiByKeywordAndSelection(args.keyword, args.selection);
      } else {
        await searchApiByKeyword(args.keyword);
      }    
    }
  )
  // Command to search the history by keywords or selection
  .command(
    "history <option>",
    "View history for previously searched keyword or selections",
    (yargs) => {
      yargs.positional("option", {
        describe: "Searching history by keywords or selections",
        type: "string",
        choices: ["keywords", "selections"],
      });
    },
    async (args) => {
      switch (args.option) {
        case "keywords":
          await showKeywordHistory();
          break;
        case "selections":
          await showSelectionHistory();
          break;
      }
    }
  )
  .help().argv;
