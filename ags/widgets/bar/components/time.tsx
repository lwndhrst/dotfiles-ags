import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"

export default function Time() {
    const time = Variable<string>("").poll(1000, 'date "+%H:%M %b %e, %Y"')

    return <label
        className="bar-time"
        onDestroy={() => time.drop()}
        label={time()}
    />
}

