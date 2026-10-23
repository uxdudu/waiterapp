import darkBatteryEnd from "../../assets/figma/home-battery-end.svg";
import darkBatteryFill from "../../assets/figma/home-battery-fill.svg";
import darkBatteryOutline from "../../assets/figma/home-battery-outline.svg";
import darkSignal from "../../assets/figma/home-signal.svg";
import darkWifi from "../../assets/figma/home-wifi.svg";
import lightBatteryEnd from "../../assets/figma/confirmation-battery-end.svg";
import lightBatteryFill from "../../assets/figma/confirmation-battery-fill.svg";
import lightBatteryOutline from "../../assets/figma/confirmation-battery-outline.svg";
import lightSignal from "../../assets/figma/confirmation-signal.svg";
import lightWifi from "../../assets/figma/confirmation-wifi.svg";
import { cx } from "../cx";

const icons = {
  dark: { batteryEnd: darkBatteryEnd, batteryFill: darkBatteryFill, batteryOutline: darkBatteryOutline, signal: darkSignal, wifi: darkWifi },
  light: { batteryEnd: lightBatteryEnd, batteryFill: lightBatteryFill, batteryOutline: lightBatteryOutline, signal: lightSignal, wifi: lightWifi },
};

/** Simulated iOS status bar for mobile prototypes. Hidden from assistive technology and on wide screens. */
export function DeviceStatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const set = icons[tone];
  return (
    <div aria-hidden="true" className={cx("wa-device-status", `wa-device-status--${tone}`)}>
      <span className="wa-device-status__time">9:41</span>
      <span className="wa-device-status__icons">
        <img alt="" src={set.signal} />
        <img alt="" src={set.wifi} />
        <span className="wa-device-status__battery">
          <img alt="" className="wa-device-status__battery-outline" src={set.batteryOutline} />
          <img alt="" className="wa-device-status__battery-fill" src={set.batteryFill} />
          <img alt="" className="wa-device-status__battery-end" src={set.batteryEnd} />
        </span>
      </span>
    </div>
  );
}

/** iOS home indicator shown at the bottom of mobile screens. */
export function HomeIndicator({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return <span aria-hidden="true" className={cx("wa-home-indicator", `wa-home-indicator--${tone}`)} />;
}
