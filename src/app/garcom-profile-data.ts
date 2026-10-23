import avatar from "../assets/figma/garcom-profile-avatar.png";
import type { ProfileData } from "../components/blocks";

export const sampleWaiterProfile: ProfileData = { avatar, name: "Lucas Oliveira", phone: "(11) 99984-3210" };

// Demonstration totals only; revenue is restaurant sales, not the waiter's earnings.
export const sampleWaiterPerformance = {
  today: { revenue: 1245, services: 14, orders: 19 },
  month: { revenue: 18450, services: 186, orders: 248 },
};
