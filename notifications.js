const notifications = await Service.import("notifications")

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
function NotificationIcon({ app_entry, app_icon, image }) {
    if (image) {
        return Widget.Box({
            css: `background-image: url("${image}");`
                + "background-size: contain;"
                + "background-repeat: no-repeat;"
                + "background-position: center;",
        })
    }

    let icon = "dialog-information-symbolic"
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (app_entry && Utils.lookUpIcon(app_entry))
        icon = app_entry

    return Widget.Box({
        child: Widget.Icon(icon),
    })
}

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
function Notification(n) {
    const icon = Widget.Box({
        vpack: "start",
        class_name: "notification-icon",
        child: NotificationIcon(n),
    })

    const title = Widget.Label({
        class_name: "notification-title",
        hexpand: true,
        xalign: 0,
        justification: "left",
        max_width_chars: 24,
        truncate: "end",
        label: n.summary,
        wrap: true,
        use_markup: true,
    })

    const body = Widget.Label({
        class_name: "notification-body",
        hexpand: true,
        xalign: 0,
        justification: "left",
        label: n.body,
        wrap: true,
        use_markup: true,
    })

    const actions = Widget.Box({
        class_name: "notification-actions",
        children: n.actions.map(({ id, label }) => Widget.Button({
            class_name: "notification-action-button",
            on_clicked: () => {
                n.invoke(id)
                n.dismiss()
            },
            hexpand: true,
            child: Widget.Label(label),
        })),
    })

    return Widget.Box({
        attribute: { id: n.id },
        class_name: `notification ${n.urgency}`,
        vertical: true,
        children: [
            Widget.Box([
                icon,
                Widget.Box(
                    { vertical: true },
                    title,
                    body,
                ),
            ]),
            actions,
        ],
    })
}

export function NotificationPopups(monitor = 0) {
    const list = Widget.Box({
        vertical: true,
        children: notifications.popups.map(Notification),
    })

    function onNotified(_, /** @type {number} */ id) {
        const n = notifications.getNotification(id)
        if (n) {
            list.children = [Notification(n), ...list.children]
        }
    }

    function onDismissed(_, /** @type {number} */ id) {
        list.children.find(n => n.attribute.id === id)?.destroy()
    }

    list.hook(notifications, onNotified, "notified")
        .hook(notifications, onDismissed, "dismissed")

    return Widget.Window({
        monitor,
        name: `notifications${monitor}`,
        class_name: "notification-popups",
        anchor: ["top", "right"],
        child: Widget.Box({
            class_name: "notification-list",
            vertical: true,
            child: list,
        }),
    })
}
