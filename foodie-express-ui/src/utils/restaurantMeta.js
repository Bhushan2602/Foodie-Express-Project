const REVIEW_POOL = [
  { name: "Amit S.", avatar: "👨", text: "Absolutely delicious! Packed well and arrived hot." },
  { name: "Priya M.", avatar: "👩", text: "Great quality and generous portions. Delivery took a little long once." },
  { name: "Rohit K.", avatar: "🧑", text: "Consistent taste every time. One of the best in this area." },
  { name: "Sneha P.", avatar: "👩‍🦱", text: "Amazing flavour and fresh ingredients. Will order again!" },
  { name: "Karan J.", avatar: "🧔", text: "Value for money. Packaging was neat and hygienic." },
  { name: "Neha R.", avatar: "👩‍🦰", text: "Loved the variety on the menu. Kids enjoyed it too." },
];

const hashStr = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const getRestaurantMeta = (restaurant = {}) => {
  const seed = `${restaurant.id || restaurant.name || "x"}${restaurant.city || ""}`;
  const h = hashStr(seed);
  const rating = restaurant.rating ?? (3.8 + ((h % 11) / 10));
  const reviewsCount = restaurant.reviewsCount ?? (120 + (h % 1800));
  const deliveryTime = restaurant.deliveryTime ?? `${25 + (h % 20)}-${35 + (h % 20)}`;
  const costForTwo = restaurant.costForTwo ?? (() => {
    const menu = restaurant.menu || [];
    if (!menu.length) return 350;
    const avg = menu.reduce((s, m) => s + (m.price || 0), 0) / menu.length;
    return Math.ceil((avg * 2) / 50) * 50;
  })();
  return { rating: Number(rating).toFixed(1), reviewsCount, deliveryTime, costForTwo };
};

export const getSampleReviews = (restaurant = {}, count = 3) => {
  const h = hashStr(`${restaurant.id || restaurant.name || "x"}`);
  return Array.from({ length: count }, (_, i) => {
    const r = REVIEW_POOL[(h + i * 2) % REVIEW_POOL.length];
    return { ...r, rating: 5 - ((h + i) % 2), date: `${(h % 6) + 1} days ago` };
  });
};

export const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem("foodie_favs") || "[]");
  } catch {
    return [];
  }
};

export const toggleFavorite = (id) => {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  localStorage.setItem("foodie_favs", JSON.stringify(next));
  return next.includes(id);
};
