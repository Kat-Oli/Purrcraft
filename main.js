import { App } from "./core/app.js";

try {
    new App().run();
}
catch (err) {
    alert(`Something went wrong!\n${err}`);
    location.reload();
}