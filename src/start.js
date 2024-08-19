console.log(`
    \x1B[34m
    ##  ##  ##  ######  ##    ##
    ##  ##  ## ##    ## ###   ##
    ##  ##  ## ##       ####  ##
    ##  ##  ##  ######  ## ## ##
    ##  ##  ##       ## ##  ####
    ##  ##  ## ##    ## ##   ###
     ###  ###   ######  ##    ##
    \x1B[33m
     The Next WSB!
    \x1B[0m
     `);

import { createApp } from "vue";
import Start from "./Start.vue";

createApp(Start).mount("#start");