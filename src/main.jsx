import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { createProviderGroup } from "zebar"
import "./reset.css"
import "./main.css"
import UpChecker from "./components/UpChecker/UpChecker"
import Workspaces from "./components/Workspaces/Workspaces"
import Media from "./components/Media/Media"
import * as flags from "country-flag-icons/string/3x2"

const providers = createProviderGroup({
    // network: { type: 'network' },
    glazewm: { type: "glazewm" },
    media: { type: "media" },
    cpu: { type: "cpu" },
    keyboard: { type: "keyboard" },
    date: { type: "date", formatting: "EEE d MMM HH:MM" },
    battery: { type: "battery" },
    memory: { type: "memory" },
    host: { type: "host" },
})

createRoot(document.getElementById("root")).render(<App />)

function App() {
    const [output, setOutput] = useState(providers.outputMap)
    const checkUpTime = [
        {
            url: "https://ktkv.dev",
            name: "wntrmt",
        },
    ]

    useEffect(() => {
        providers.onOutput(() => setOutput(providers.outputMap))
    }, [])

    // Get icon to show for current network status.
    function getNetworkIcon(networkOutput) {
        switch (networkOutput.defaultInterface?.type) {
            case "ethernet":
                return <i className="nf nf-md-ethernet_cable"></i>
            case "wifi":
                if (networkOutput.defaultGateway?.signalStrength >= 80) {
                    return <i className="nf nf-md-wifi_strength_4"></i>
                } else if (networkOutput.defaultGateway?.signalStrength >= 65) {
                    return <i className="nf nf-md-wifi_strength_3"></i>
                } else if (networkOutput.defaultGateway?.signalStrength >= 40) {
                    return <i className="nf nf-md-wifi_strength_2"></i>
                } else if (networkOutput.defaultGateway?.signalStrength >= 25) {
                    return <i className="nf nf-md-wifi_strength_1"></i>
                } else {
                    return <i className="nf nf-md-wifi_strength_outline"></i>
                }
            default:
                return <i className="nf nf-md-wifi_strength_off_outline"></i>
        }
    }

    // Get icon to show for how much of the battery is charged.
    function getBatteryIcon(batteryOutput) {
        if (batteryOutput.chargePercent > 90)
            return <i className="nf nf-fa-battery_4"></i>
        if (batteryOutput.chargePercent > 70)
            return <i className="nf nf-fa-battery_3"></i>
        if (batteryOutput.chargePercent > 40)
            return <i className="nf nf-fa-battery_2"></i>
        if (batteryOutput.chargePercent > 20)
            return <i className="nf nf-fa-battery_1"></i>
        return <i className="nf nf-fa-battery_0"></i>
    }

    return (
        <div className="app">
            <div className="left">
                {output.glazewm && <Workspaces {...output.glazewm} />}
            </div>

            {output.media && output.glazewm && output.host && <Media {...output} />}

            <div className="right">
                {output.glazewm && (
                    <>
                        {output.glazewm.bindingModes.map((bindingMode) => (
                            <button
                                className="binding-mode"
                                key={bindingMode.name}
                                onClick={() =>
                                    output.glazewm.runCommand(
                                        `wm-disable-binding-mode --name ${bindingMode.name}`
                                    )
                                }
                            >
                                {bindingMode.displayName ?? bindingMode.name}
                            </button>
                        ))}

                        <button
                            className={`tiling-direction nf ${
                                output.glazewm.tilingDirection === "horizontal"
                                    ? "nf-md-swap_horizontal"
                                    : "nf-md-swap_vertical"
                            }`}
                            onClick={() =>
                                output.glazewm.runCommand(
                                    "toggle-tiling-direction"
                                )
                            }
                        ></button>
                    </>
                )}

                {output.network && (
                    <div className="network">
                        {getNetworkIcon(output.network)}
                        {output.network.defaultGateway?.ssid}
                    </div>
                )}

                {checkUpTime.length > 0 &&
                    checkUpTime.map((machine) => <UpChecker {...machine} />)}

                {output.memory && (
                    <div className="memory">
                        <i className="nf nf-fae-chip"></i>
                        {Math.round(output.memory.usage)}%
                    </div>
                )}

                {output.cpu && (
                    <div className="cpu">
                        <i className="nf nf-oct-cpu"></i>

                        {/* Change the text color if the CPU usage is high. */}
                        <span
                            className={
                                output.cpu.usage > 85 ? "high-usage" : ""
                            }
                        >
                            {Math.round(output.cpu.usage)}%
                        </span>
                    </div>
                )}

                {output.battery && (
                    <div className="battery">
                        {/* Show icon for whether battery is charging. */}
                        {output.battery.isCharging && (
                            <i className="nf nf-md-power_plug charging-icon"></i>
                        )}
                        {getBatteryIcon(output.battery)}
                        {Math.round(output.battery.chargePercent)}%
                    </div>
                )}

                {output.keyboard && (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: flags[output.keyboard.layout.slice(3, 5)],
                        }}
                        className="keyboard"
                    ></div>
                )}

                {output.date && <div>{output.date.formatted}</div>}
            </div>
        </div>
    )
}
