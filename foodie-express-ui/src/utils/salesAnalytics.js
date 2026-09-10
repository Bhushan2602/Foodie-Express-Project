export const last7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

const dayKey = (d) => d.toISOString().slice(0, 10);
const dayLabel = (d) => d.toLocaleDateString("en-IN", { weekday: "short" });

export const salesByDay = (orders) => {
  const days = last7Days();
  const map = Object.fromEntries(days.map((d) => [dayKey(d), 0]));
  orders
    .filter((o) => o.status?.toUpperCase() === "DELIVERED")
    .forEach((o) => {
      if (!o.orderTime) return;
      const k = dayKey(new Date(o.orderTime));
      if (k in map) map[k] += o.totalAmount || 0;
    });
  return days.map((d) => ({ day: dayLabel(d), sales: Math.round(map[dayKey(d)]) }));
};

export const ordersByDay = (orders) => {
  const days = last7Days();
  const map = Object.fromEntries(days.map((d) => [dayKey(d), 0]));
  orders.forEach((o) => {
    if (!o.orderTime) return;
    const k = dayKey(new Date(o.orderTime));
    if (k in map) map[k] += 1;
  });
  return days.map((d) => ({ day: dayLabel(d), orders: map[dayKey(d)] }));
};

export const statusSplit = (orders) => {
  const counts = {};
  orders.forEach((o) => {
    const s = (o.status || "PENDING").toUpperCase();
    counts[s] = (counts[s] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

export const earningsByDay = (orders, rate = 0.15) => {
  const days = last7Days();
  const map = Object.fromEntries(days.map((d) => [dayKey(d), 0]));
  orders
    .filter((o) => o.status?.toUpperCase() === "DELIVERED")
    .forEach((o) => {
      if (!o.orderTime) return;
      const k = dayKey(new Date(o.orderTime));
      if (k in map) map[k] += Math.round((o.totalAmount || 0) * rate);
    });
  return days.map((d) => ({ day: dayLabel(d), earnings: Math.round(map[dayKey(d)]) }));
};
