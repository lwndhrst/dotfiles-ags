import { applauncher } from "./applauncher.js"
import { Bar } from "./bar.js"
import { NotificationPopups } from "./notifications.js"

// Utils.timeout(100, () => Utils.notify({
//     summary: "Notification Popup Example",
//     iconName: "info-symbolic",
//     body: "Lorem ipsum dolor sit amet, qui minim labore adipisicing "
//         + "minim sint cillum sint consectetur cupidatat.",
//     actions: {
//         "Cool": () => print("pressed Cool"),
//     },
//     // urgency: 2,
// }))

App.config({
    style: "./style.css",
    windows: [
        Bar(),
        NotificationPopups(),

        applauncher,
    ],
})

export { }
