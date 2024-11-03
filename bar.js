const hyprland = await Service.import("hyprland")
const systemtray = await Service.import("systemtray")

const date = Variable("", {
    poll: [1000, 'date "+%H:%M %b%e, %Y"'],
})

function Workspaces() {
    const activeId = hyprland.active.workspace.bind("id")
    const workspaces = hyprland.bind("workspaces")
        .as(ws => ws.map(({ id }) => Widget.Button({
            on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
            child: Widget.Label(`${id}`),
            class_name: activeId.as(i => `${i === id ? "workspace-active" : "workspace-inactive"}`),
        })))

    return Widget.Box({
        class_name: "bar-workspaces",
        children: workspaces,
    })
}

function Clock() {
    return Widget.Label({
        class_name: "bar-clock",
        label: date.bind(),
    })
}

function SysTray() {
    const items = systemtray.bind("items")
        .as(items => items.map(item => Widget.Button({
            child: Widget.Icon({ icon: item.bind("icon") }),
            on_primary_click: (_, event) => item.activate(event),
            on_secondary_click: (_, event) => item.openMenu(event),
            tooltip_markup: item.bind("tooltip_markup"),
        })))

    return Widget.Box({
        class_name: "bar-systray",
        children: items,
    })
}

function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            Workspaces(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 8,
        children: [
            SysTray(),
            Clock(),
        ],
    })
}

export function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            // center_widget: Center(),
            end_widget: Right(),
        }),
    })
}
