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
        {bind(tray, "items").as(items => items.map(item => {

        const menu = item.create_menu()

        return <button
            tooltipMarkup={bind(item, "tooltipMarkup")}
            onDestroy={() => menu?.destroy()}
            onClickRelease={self => {
                menu?.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null)
            }}
        >
            <icon gIcon={bind(item, "gicon")} />
        </button>
        }))}
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
