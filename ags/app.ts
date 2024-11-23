import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widgets/bar/bar"
import Launcher from "./widgets/launcher/launcher"
import NotificationPopups from "./widgets/notification/notification_popups"

App.start({
    css: style,
    main() {
        App.get_monitors().map(Bar)
        App.get_monitors().map(NotificationPopups)
        Launcher().hide()
    },
})
