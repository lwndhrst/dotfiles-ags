import { bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Network from "gi://AstalNetwork"

export default function Wifi() {
    const network = Network.get_default()
    const wifi = bind(network, "wifi")

    return <box visible={wifi.as(Boolean)}>
        {wifi.as(wifi => wifi && (
            <icon
                tooltipText={bind(wifi, "ssid").as(String)}
                className="bar-wifi"
                icon={bind(wifi, "iconName")}
            />
        ))}
    </box>
}
