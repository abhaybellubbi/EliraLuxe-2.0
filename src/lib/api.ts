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
  type DatabaseSchema,
} from "../server/db-store";
import { supabase } from "./supabase";

const ADMIN_USERNAME = "Aliysha";
const ADMIN_PASSWORD = "Alish582";
const MOCK_TOKEN = "elira-luxe-admin-session-token-2026";
const LOCAL_STORAGE_KEY = "elira_store_state_v2";

function getLocalStorageState(): Partial<DatabaseSchema> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveLocalStorageState(state: Partial<DatabaseSchema>) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalStorageState() || {};
    const updated = { ...existing, ...state };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to write to localStorage:", e);
  }
}

async function syncPayloadToSupabase(payload: Partial<DatabaseSchema>) {
  try {
    const existing = getLocalStorageState() || {};
    const fullPayload = { ...existing, ...payload };
    await supabase.from("elira_store_state").upsert({
      id: 1,
      payload: fullPayload,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Client Supabase sync notice:", err);
  }
}

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
    if (!Array.isArray(db.products)) db.products = [];
    const index = db.products.findIndex((p) => String(p.id) === String(product.id));

    if (index >= 0) {
      db.products[index] = { ...db.products[index], ...product };
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
    if (!Array.isArray(db.products)) db.products = [];
    const filtered = db.products.filter((p) => String(p.id) !== String(id));
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
  let serverProducts: Product[] | null = null;
  try {
    const res = await getProducts();
    if (Array.isArray(res) && res.length > 0) {
      serverProducts = res;
    }
  } catch (err) {
    console.warn("getProductsSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();

  if (serverProducts && serverProducts.length > 0) {
    // Merge server products with any local storage edits
    let mergedProducts = [...serverProducts];
    if (localState?.products && Array.isArray(localState.products)) {
      localState.products.forEach((lp) => {
        const idx = mergedProducts.findIndex((sp) => String(sp.id) === String(lp.id));
        if (idx >= 0) {
          mergedProducts[idx] = { ...mergedProducts[idx], ...lp };
        } else {
          mergedProducts.unshift(lp);
        }
      });
    }
    if (typeof window !== "undefined") {
      saveLocalStorageState({ products: mergedProducts });
    }
    return mergedProducts;
  }

  if (localState?.products && Array.isArray(localState.products) && localState.products.length > 0) {
    return localState.products;
  }

  return (initialProducts as Product[]);
};

export const updateProductSafe = async (
  product: Product
): Promise<{ success: boolean; product: Product }> => {
  try {
    await updateProduct({ data: product });
  } catch (err) {
    console.warn("updateProductSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const localState = getLocalStorageState();
    const currentProducts = localState?.products && Array.isArray(localState.products) && localState.products.length > 0
      ? localState.products
      : (await getProductsSafe());

    const index = currentProducts.findIndex((p) => String(p.id) === String(product.id));
    let updated: Product[];
    if (index >= 0) {
      updated = [...currentProducts];
      updated[index] = { ...updated[index], ...product };
    } else {
      updated = [product, ...currentProducts];
    }
    saveLocalStorageState({ products: updated });
    syncPayloadToSupabase({ products: updated });
  }

  return { success: true, product };
};

export const deleteProductSafe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await deleteProduct({ data: id });
  } catch (err) {
    console.warn("deleteProductSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const localState = getLocalStorageState();
    const currentProducts = localState?.products && Array.isArray(localState.products) && localState.products.length > 0
      ? localState.products
      : (await getProductsSafe());

    const updated = currentProducts.filter((p) => String(p.id) !== String(id));
    saveLocalStorageState({ products: updated });
    syncPayloadToSupabase({ products: updated });
  }

  return { success: true };
};

export const getContentSettingsSafe = async (): Promise<ContentSettings> => {
  let serverSettings: ContentSettings | null = null;
  try {
    const res = await getContentSettings();
    if (res) serverSettings = res;
  } catch (err) {
    console.warn("getContentSettingsSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();
  if (localState?.contentSettings) {
    return localState.contentSettings;
  }

  return serverSettings || (initialContentSettings as ContentSettings);
};

export const updateContentSettingsSafe = async (
  settings: ContentSettings
): Promise<{ success: boolean; settings: ContentSettings }> => {
  try {
    await updateContentSettings({ data: settings });
  } catch (err) {
    console.warn("updateContentSettingsSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    saveLocalStorageState({ contentSettings: settings });
    syncPayloadToSupabase({ contentSettings: settings });
  }

  return { success: true, settings };
};

export const getUniqueStylesSafe = async (): Promise<UniqueStyleItem[]> => {
  let serverStyles: UniqueStyleItem[] | null = null;
  try {
    const res = await getUniqueStyles();
    if (Array.isArray(res) && res.length > 0) serverStyles = res;
  } catch (err) {
    console.warn("getUniqueStylesSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();
  if (localState?.uniqueStyles && Array.isArray(localState.uniqueStyles) && localState.uniqueStyles.length > 0) {
    return localState.uniqueStyles;
  }

  return serverStyles || (initialUniqueStyles as UniqueStyleItem[]);
};

export const updateUniqueStyleSafe = async (
  style: UniqueStyleItem
): Promise<{ success: boolean; style: UniqueStyleItem }> => {
  try {
    await updateUniqueStyle({ data: style });
  } catch (err) {
    console.warn("updateUniqueStyleSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getUniqueStylesSafe();
    const index = current.findIndex((s) => s.id === style.id);
    let updated: UniqueStyleItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = style;
    } else {
      updated = [style, ...current];
    }
    saveLocalStorageState({ uniqueStyles: updated });
    syncPayloadToSupabase({ uniqueStyles: updated });
  }

  return { success: true, style };
};

export const deleteUniqueStyleSafe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await deleteUniqueStyle({ data: id });
  } catch (err) {
    console.warn("deleteUniqueStyleSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getUniqueStylesSafe();
    const updated = current.filter((s) => s.id !== id);
    saveLocalStorageState({ uniqueStyles: updated });
    syncPayloadToSupabase({ uniqueStyles: updated });
  }

  return { success: true };
};

export const getInstagramStoriesSafe = async (): Promise<InstagramStoryItem[]> => {
  let serverStories: InstagramStoryItem[] | null = null;
  try {
    const res = await getInstagramStories();
    if (Array.isArray(res) && res.length > 0) serverStories = res;
  } catch (err) {
    console.warn("getInstagramStoriesSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();
  if (localState?.instagramStories && Array.isArray(localState.instagramStories) && localState.instagramStories.length > 0) {
    return localState.instagramStories;
  }

  return serverStories || (initialInstagramStories as InstagramStoryItem[]);
};

export const updateInstagramStorySafe = async (
  story: InstagramStoryItem
): Promise<{ success: boolean; story: InstagramStoryItem }> => {
  try {
    await updateInstagramStory({ data: story });
  } catch (err) {
    console.warn("updateInstagramStorySafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getInstagramStoriesSafe();
    const index = current.findIndex((s) => s.id === story.id);
    let updated: InstagramStoryItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = story;
    } else {
      updated = [story, ...current];
    }
    saveLocalStorageState({ instagramStories: updated });
    syncPayloadToSupabase({ instagramStories: updated });
  }

  return { success: true, story };
};

export const deleteInstagramStorySafe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await deleteInstagramStory({ data: id });
  } catch (err) {
    console.warn("deleteInstagramStorySafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getInstagramStoriesSafe();
    const updated = current.filter((s) => s.id !== id);
    saveLocalStorageState({ instagramStories: updated });
    syncPayloadToSupabase({ instagramStories: updated });
  }

  return { success: true };
};

export const getInstagramPostsSafe = async (): Promise<InstagramPostItem[]> => {
  let serverPosts: InstagramPostItem[] | null = null;
  try {
    const res = await getInstagramPosts();
    if (Array.isArray(res) && res.length > 0) serverPosts = res;
  } catch (err) {
    console.warn("getInstagramPostsSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();
  if (localState?.instagramPosts && Array.isArray(localState.instagramPosts) && localState.instagramPosts.length > 0) {
    return localState.instagramPosts;
  }

  return serverPosts || (initialInstagramPosts as InstagramPostItem[]);
};

export const updateInstagramPostSafe = async (
  post: InstagramPostItem
): Promise<{ success: boolean; post: InstagramPostItem }> => {
  try {
    await updateInstagramPost({ data: post });
  } catch (err) {
    console.warn("updateInstagramPostSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getInstagramPostsSafe();
    const index = current.findIndex((p) => p.id === post.id);
    let updated: InstagramPostItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = post;
    } else {
      updated = [post, ...current];
    }
    saveLocalStorageState({ instagramPosts: updated });
    syncPayloadToSupabase({ instagramPosts: updated });
  }

  return { success: true, post };
};

export const deleteInstagramPostSafe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await deleteInstagramPost({ data: id });
  } catch (err) {
    console.warn("deleteInstagramPostSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getInstagramPostsSafe();
    const updated = current.filter((p) => p.id !== id);
    saveLocalStorageState({ instagramPosts: updated });
    syncPayloadToSupabase({ instagramPosts: updated });
  }

  return { success: true };
};

export const getOrdersSafe = async (): Promise<Order[]> => {
  let serverOrders: Order[] | null = null;
  try {
    const res = await getOrders();
    if (Array.isArray(res)) serverOrders = res;
  } catch (err) {
    console.warn("getOrdersSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();
  if (localState?.orders && Array.isArray(localState.orders)) {
    return localState.orders;
  }

  return serverOrders || [];
};

export const addOrderSafe = async (orderData: {
  customerName?: string;
  customerPhone?: string;
  productId: string;
  productName: string;
}): Promise<{ success: boolean; order?: Order }> => {
  const newOrder: Order = {
    id: "ord_" + Math.random().toString(36).substr(2, 9),
    customerName: orderData.customerName || "WhatsApp Lead",
    customerPhone: orderData.customerPhone || "Not Provided (WhatsApp Lead)",
    productId: orderData.productId,
    productName: orderData.productName,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    await addOrder({
      data: {
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        productId: newOrder.productId,
        productName: newOrder.productName,
      },
    });
  } catch (err) {
    console.warn("addOrderSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getOrdersSafe();
    const updated = [newOrder, ...current];
    saveLocalStorageState({ orders: updated });
    syncPayloadToSupabase({ orders: updated });
  }

  return { success: true, order: newOrder };
};

export const updateOrderStatusSafe = async (data: {
  id: string;
  status: Order["status"];
}): Promise<{ success: boolean; order?: Order }> => {
  try {
    await updateOrderStatus({ data });
  } catch (err) {
    console.warn("updateOrderStatusSafe server call warning:", err);
  }

  let updatedOrder: Order | undefined;
  if (typeof window !== "undefined") {
    const current = await getOrdersSafe();
    const updated = current.map((o) => {
      if (o.id === data.id) {
        updatedOrder = { ...o, status: data.status };
        return updatedOrder;
      }
      return o;
    });
    saveLocalStorageState({ orders: updated });
    syncPayloadToSupabase({ orders: updated });
  }

  return { success: true, order: updatedOrder };
};

export const deleteOrderSafe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await deleteOrder({ data: id });
  } catch (err) {
    console.warn("deleteOrderSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getOrdersSafe();
    const updated = current.filter((o) => o.id !== id);
    saveLocalStorageState({ orders: updated });
    syncPayloadToSupabase({ orders: updated });
  }

  return { success: true };
};

export const getPromotionsSafe = async (): Promise<Promotion[]> => {
  let serverPromos: Promotion[] | null = null;
  try {
    const res = await getPromotions();
    if (Array.isArray(res)) serverPromos = res;
  } catch (err) {
    console.warn("getPromotionsSafe server fetch fallback:", err);
  }

  const localState = getLocalStorageState();
  if (localState?.promotions && Array.isArray(localState.promotions)) {
    return localState.promotions;
  }

  return serverPromos || [];
};

export const updatePromotionSafe = async (
  promo: Promotion
): Promise<{ success: boolean; promo: Promotion }> => {
  try {
    await updatePromotion({ data: promo });
  } catch (err) {
    console.warn("updatePromotionSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getPromotionsSafe();
    const index = current.findIndex((p) => p.id === promo.id);
    let updated: Promotion[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = promo;
    } else {
      updated = [promo, ...current];
    }
    saveLocalStorageState({ promotions: updated });
    syncPayloadToSupabase({ promotions: updated });
  }

  return { success: true, promo };
};

export const deletePromotionSafe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await deletePromotion({ data: id });
  } catch (err) {
    console.warn("deletePromotionSafe server call warning:", err);
  }

  if (typeof window !== "undefined") {
    const current = await getPromotionsSafe();
    const updated = current.filter((p) => p.id !== id);
    saveLocalStorageState({ promotions: updated });
    syncPayloadToSupabase({ promotions: updated });
  }

  return { success: true };
};


