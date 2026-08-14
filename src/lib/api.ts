import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import {
  readDb,
  writeDb,
  getInitialData,
  type Product,
  type Promotion,
  type ContentSettings,
  type Order,
  type UniqueStyleItem,
  type InstagramStoryItem,
  type InstagramPostItem,
} from "../server/db-store";

const ADMIN_USERNAME = "Aliysha";
const ADMIN_PASSWORD = "Alish582";
const MOCK_TOKEN = "elira-luxe-admin-session-token-2026";

export const getProducts = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return Array.isArray(db?.products) ? db.products : getInitialData().products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return getInitialData().products;
  }
});

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((product: Product) => product)
  .handler(async ({ data: product }) => {
    const db = await readDb();
    const index = db.products.findIndex((p) => p.id === product.id);

    if (index >= 0) {
      db.products[index] = product;
    } else {
      db.products.unshift(product);
    }

    await writeDb(db);
    return { success: true, product };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await readDb();
    const filtered = db.products.filter((p) => p.id !== id);
    db.products = filtered;
    await writeDb(db);
    return { success: true };
  });

export const getPromotions = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return Array.isArray(db?.promotions) ? db.promotions : getInitialData().promotions;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return getInitialData().promotions;
  }
});

export const updatePromotion = createServerFn({ method: "POST" })
  .inputValidator((promo: Promotion) => promo)
  .handler(async ({ data: promo }) => {
    const db = await readDb();
    if (!db.promotions) db.promotions = [];
    const index = db.promotions.findIndex((p) => p.id === promo.id);

    if (index >= 0) {
      db.promotions[index] = promo;
    } else {
      db.promotions.unshift(promo);
    }

    await writeDb(db);
    return { success: true, promo };
  });

export const deletePromotion = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await readDb();
    if (!db.promotions) db.promotions = [];
    db.promotions = db.promotions.filter((p) => p.id !== id);
    await writeDb(db);
    return { success: true };
  });

export const getContentSettings = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return db?.contentSettings || getInitialData().contentSettings;
  } catch (error) {
    console.error("Error fetching content settings:", error);
    return getInitialData().contentSettings;
  }
});

export const updateContentSettings = createServerFn({ method: "POST" })
  .inputValidator((settings: ContentSettings) => settings)
  .handler(async ({ data: settings }) => {
    const db = await readDb();
    db.contentSettings = settings;
    await writeDb(db);
    return { success: true, settings };
  });

// UNIQUE STYLES CMS API
export const getUniqueStyles = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return Array.isArray(db?.uniqueStyles) ? db.uniqueStyles : getInitialData().uniqueStyles;
  } catch (error) {
    console.error("Error fetching unique styles:", error);
    return getInitialData().uniqueStyles;
  }
});

export const updateUniqueStyle = createServerFn({ method: "POST" })
  .inputValidator((style: UniqueStyleItem) => style)
  .handler(async ({ data: style }) => {
    const db = await readDb();
    if (!db.uniqueStyles) db.uniqueStyles = [];
    const index = db.uniqueStyles.findIndex((s) => s.id === style.id);

    if (index >= 0) {
      db.uniqueStyles[index] = style;
    } else {
      db.uniqueStyles.unshift(style);
    }

    await writeDb(db);
    return { success: true, style };
  });

export const deleteUniqueStyle = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await readDb();
    if (!db.uniqueStyles) db.uniqueStyles = [];
    db.uniqueStyles = db.uniqueStyles.filter((s) => s.id !== id);
    await writeDb(db);
    return { success: true };
  });

// INSTAGRAM STORIES CMS API
export const getInstagramStories = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return Array.isArray(db?.instagramStories)
      ? db.instagramStories
      : getInitialData().instagramStories;
  } catch (error) {
    console.error("Error fetching instagram stories:", error);
    return getInitialData().instagramStories;
  }
});

export const updateInstagramStory = createServerFn({ method: "POST" })
  .inputValidator((story: InstagramStoryItem) => story)
  .handler(async ({ data: story }) => {
    const db = await readDb();
    if (!db.instagramStories) db.instagramStories = [];
    const index = db.instagramStories.findIndex((s) => s.id === story.id);

    if (index >= 0) {
      db.instagramStories[index] = story;
    } else {
      db.instagramStories.unshift(story);
    }

    await writeDb(db);
    return { success: true, story };
  });

export const deleteInstagramStory = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await readDb();
    if (!db.instagramStories) db.instagramStories = [];
    db.instagramStories = db.instagramStories.filter((s) => s.id !== id);
    await writeDb(db);
    return { success: true };
  });

// INSTAGRAM POSTS CMS API
export const getInstagramPosts = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return Array.isArray(db?.instagramPosts)
      ? db.instagramPosts
      : getInitialData().instagramPosts;
  } catch (error) {
    console.error("Error fetching instagram posts:", error);
    return getInitialData().instagramPosts;
  }
});

export const updateInstagramPost = createServerFn({ method: "POST" })
  .inputValidator((post: InstagramPostItem) => post)
  .handler(async ({ data: post }) => {
    const db = await readDb();
    if (!db.instagramPosts) db.instagramPosts = [];
    const index = db.instagramPosts.findIndex((p) => p.id === post.id);

    if (index >= 0) {
      db.instagramPosts[index] = post;
    } else {
      db.instagramPosts.unshift(post);
    }

    await writeDb(db);
    return { success: true, post };
  });

export const deleteInstagramPost = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await readDb();
    if (!db.instagramPosts) db.instagramPosts = [];
    db.instagramPosts = db.instagramPosts.filter((p) => p.id !== id);
    await writeDb(db);
    return { success: true };
  });

export const getOrders = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const db = await readDb();
    return Array.isArray(db?.orders) ? db.orders : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
});

export const addOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (orderData: {
      customerName: string;
      customerPhone?: string;
      productId: string;
      productName: string;
    }) => orderData,
  )
  .handler(async ({ data: orderData }) => {
    const db = await readDb();
    if (!db.orders) db.orders = [];
    const newOrder: Order = {
      id: "ord_" + Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db.orders.unshift(newOrder);
    await writeDb(db);
    return { success: true, order: newOrder };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: Order["status"] }) => data)
  .handler(async ({ data }) => {
    const db = await readDb();
    if (!db.orders) db.orders = [];
    const order = db.orders.find((o) => o.id === data.id);
    if (order) {
      order.status = data.status;
      await writeDb(db);
      return { success: true, order };
    }
    return { success: false, error: "Order not found" };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await readDb();
    if (!db.orders) db.orders = [];
    db.orders = db.orders.filter((o) => o.id !== id);
    await writeDb(db);
    return { success: true };
  });

export const authenticateAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password?: string; token?: string }) => data)
  .handler(async ({ data }) => {
    if (data.token === MOCK_TOKEN) {
      return { success: true, token: MOCK_TOKEN };
    }
    if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
      return { success: true, token: MOCK_TOKEN };
    }
    return { success: false, error: "Invalid username or password" };
  });

export const checkAdminAuth = createServerFn({ method: "POST" }).handler(async () => {
  const token = getCookie("elira_admin_token") || "";
  return { isAuthenticated: token === MOCK_TOKEN };
});

import {
  initialProducts,
  initialContentSettings,
  initialUniqueStyles,
  initialInstagramStories,
  initialInstagramPosts,
} from "./defaults";

// Safe Client Wrappers (Never throw on Vercel or Serverless network error)
export const getProductsSafe = async (): Promise<Product[]> => {
  try {
    const res = await getProducts();
    return Array.isArray(res) ? res : (initialProducts as Product[]);
  } catch (err) {
    console.warn("getProductsSafe fallback:", err);
    return initialProducts as Product[];
  }
};

export const getContentSettingsSafe = async (): Promise<ContentSettings> => {
  try {
    const res = await getContentSettings();
    return res || (initialContentSettings as ContentSettings);
  } catch (err) {
    console.warn("getContentSettingsSafe fallback:", err);
    return initialContentSettings as ContentSettings;
  }
};

export const getUniqueStylesSafe = async (): Promise<UniqueStyleItem[]> => {
  try {
    const res = await getUniqueStyles();
    return Array.isArray(res) ? res : (initialUniqueStyles as UniqueStyleItem[]);
  } catch (err) {
    console.warn("getUniqueStylesSafe fallback:", err);
    return initialUniqueStyles as UniqueStyleItem[];
  }
};

export const getInstagramStoriesSafe = async (): Promise<InstagramStoryItem[]> => {
  try {
    const res = await getInstagramStories();
    return Array.isArray(res) ? res : (initialInstagramStories as InstagramStoryItem[]);
  } catch (err) {
    console.warn("getInstagramStoriesSafe fallback:", err);
    return initialInstagramStories as InstagramStoryItem[];
  }
};

export const getInstagramPostsSafe = async (): Promise<InstagramPostItem[]> => {
  try {
    const res = await getInstagramPosts();
    return Array.isArray(res) ? res : (initialInstagramPosts as InstagramPostItem[]);
  } catch (err) {
    console.warn("getInstagramPostsSafe fallback:", err);
    return initialInstagramPosts as InstagramPostItem[];
  }
};

export const getOrdersSafe = async (): Promise<Order[]> => {
  try {
    const res = await getOrders();
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.warn("getOrdersSafe fallback:", err);
    return [];
  }
};
