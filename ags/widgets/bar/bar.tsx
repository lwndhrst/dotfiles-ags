import { App } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Tray from "gi://AstalTray"

function Time() {
    const time = Variable("").poll(1000, 'date "+%H:%M %b %e, %Y"')

    return <label
        className="bar-time"
        onDestroy={() => time.drop()}
        label={time()}
    />
}

function Workspaces() {
    const hypr = Hyprland.get_default()

    return <box className="bar-workspaces">
        {bind(hypr, "workspaces").as(wss => wss
            .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
            .sort((a, b) => a.id - b.id)
            .map(ws => (
                <button
                    className={bind(hypr, "focusedWorkspace").as(fw =>
                        ws === fw ? "workspace-active" : "workspace-inactive")}
                    onClicked={() => ws.focus()}>
                    {ws.id}
                </button>
            ))
        )}
    </box>
}

function SysTray() {
    const tray = Tray.get_default()

    return <box className="bar-systray">
        {bind(tray, "items").as(items => items.map(item => (
            <menubutton
                tooltipMarkup={bind(item, "tooltipMarkup")}
                usePopover={false}
                actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
                menuModel={bind(item, "menuModel")}>
                <icon gicon={bind(item, "gicon")} />
            </menubutton>
        )))}
    </box>
}

export default function Bar(monitor: Gdk.Monitor) {
    const anchor = Astal.WindowAnchor.TOP
                 | Astal.WindowAnchor.LEFT
                 | Astal.WindowAnchor.RIGHT

    return <window
        className="bar"
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}>
        <centerbox>
            <box hexpand halign={Gtk.Align.START}>
                <Workspaces />
            </box>
            <box>
            </box>
            <box hexpand halign={Gtk.Align.END} >
                <SysTray />
                <Time />
            </box>
        </centerbox>
    </window>
}
