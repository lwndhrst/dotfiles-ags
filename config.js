import { Bar } from "./bar.js"
import { NotificationPopups } from "./notifications.js"

App.config({
    style: "./style.css",
    windows: [
        Bar(),
        NotificationPopups(),
    ],
})

export { }