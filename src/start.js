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
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Start from "./Start.vue";

const app = createApp(Start);
app.use(ElementPlus);
app.mount("#start");