import { App } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Network from "gi://AstalNetwork"
import Tray from "gi://AstalTray"

import Workspaces from "./components/workspaces"
import AppLauncher from "./components/app_launcher"
import Notifications from "./components/notifications"
import SystemTray from "./components/system_tray"
import Wifi from "./components/wifi"
import Time from "./components/time"
import PowerMenu from "./components/power_menu"

export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        className="bar"
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}>
        <centerbox>
            <box hexpand halign={Gtk.Align.START}>
                <Workspaces />
            </box>
            <box>
                <AppLauncher />
                <Notifications />
            </box>
            <box hexpand halign={Gtk.Align.END} >
                <SystemTray />
                <Wifi />
                <Time />
                <PowerMenu />
            </box>
        </centerbox>
    </window>
}
