import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Product, Order, PaymentGatewaysConfig } from '../types';
import { initialProducts } from '../data/products';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Default payment gateways configuration with realistic Nepali QR codes and merchant details
export const DEFAULT_PAYMENT_GATEWAYS: PaymentGatewaysConfig = {
  esewa: {
    active: true,
    accountName: 'DARAZ NEPAL OFFICIAL STORE',
    accountNumber: '9841234567',
    qrCodeUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    instructions: 'Open your eSewa App -> Tap Scan & Pay -> Scan this QR Code or send to 9841234567. Enter order tracking number in remarks and upload/paste your Transaction ID below.'
  },
  khalti: {
    active: true,
    accountName: 'DARAZ NEPAL E-COMMERCE',
    accountNumber: '9801234567',
    qrCodeUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    instructions: 'Open your Khalti App -> Scan QR Code or send to 9801234567. Put your full name in remarks and enter your Khalti Transaction Code below.'
  },
  ime_pay: {
    active: true,
    accountName: 'DARAZ NEPAL TRADING',
    accountNumber: '9811234567',
    qrCodeUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    instructions: 'Open IME Pay App -> Tap Scan QR -> Complete payment and provide the Reference Number.'
  },
  bank_qr: {
    active: true,
    bankName: 'Nabil Bank / Fonepay Merchant QR',
    accountName: 'DARAZ NEPAL ONLINE PVT LTD',
    accountNumber: '01201017500123',
    qrCodeUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    instructions: 'Scan with any Mobile Banking App (Fonepay / Nabil, NIC Asia, Global IME, Himalayan, Sanima, Prabhu). Enter your Bank Reference Number below.'
  },
  cod: {
    active: true,
    instructions: 'Pay in cash upon doorstep delivery by Daraz Express (DEX) or partner courier. Exact cash is appreciated.'
  }
};

// ==================== PRODUCTS ====================

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    
    if (snapshot.empty) {
      console.log('No products found in Firestore. Seeding default Daraz Nepal catalog...');
      await seedInitialProducts();
      return initialProducts;
    }

    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        id: docSnap.id,
        ...data
      } as Product);
    });
    return products;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products');
    // Graceful fallback to initial products if network connection/stream is recovering
    return initialProducts;
  }
}

/**
 * Realtime subscription to products catalog.
 * Whenever an admin adds, modifies or deletes an item, the callback fires instantly.
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
): () => void {
  const productsCol = collection(db, 'products');
  return onSnapshot(
    productsCol,
    (snapshot) => {
      if (snapshot.empty) {
        seedInitialProducts().catch(console.error);
        onUpdate(initialProducts);
        return;
      }
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
      if (onError) onError(error);
    }
  );
}

export async function seedInitialProducts(): Promise<void> {
  try {
    const productsCol = collection(db, 'products');
    for (const prod of initialProducts) {
      const { id, ...data } = prod;
      const docRef = doc(productsCol, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    }
    console.log('Seeded initial products successfully');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'products');
  }
}

export async function addProductToFirestore(product: Omit<Product, 'id'>): Promise<string> {
  try {
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'products');
    throw error;
  }
}

export async function updateProductInFirestore(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    throw error;
  }
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    throw error;
  }
}

// ==================== PAYMENT GATEWAYS & QR CODES ====================

export async function fetchPaymentGatewaysConfig(): Promise<PaymentGatewaysConfig> {
  try {
    const settingsDoc = doc(db, 'settings', 'payment_gateways');
    const snap = await getDoc(settingsDoc);
    if (snap.exists()) {
      return snap.data() as PaymentGatewaysConfig;
    } else {
      // Initialize with defaults in Firestore
      await setDoc(settingsDoc, DEFAULT_PAYMENT_GATEWAYS);
      return DEFAULT_PAYMENT_GATEWAYS;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/payment_gateways');
    return DEFAULT_PAYMENT_GATEWAYS;
  }
}

export async function savePaymentGatewaysConfig(config: PaymentGatewaysConfig): Promise<void> {
  try {
    const settingsDoc = doc(db, 'settings', 'payment_gateways');
    await setDoc(settingsDoc, {
      ...config,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/payment_gateways');
    throw error;
  }
}

// ==================== ORDERS ====================

export async function createOrderInFirestore(orderData: Omit<Order, 'id'>): Promise<string> {
  try {
    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, {
      ...orderData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'orders');
    throw error;
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        id: docSnap.id,
        ...data
      } as Order);
    });
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'orders');
    return [];
  }
}

/**
 * Realtime subscription to all orders for Admin Panel.
 * Admin sees orders pop in live with zero delay.
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: any) => void
): () => void {
  const ordersCol = collection(db, 'orders');
  return onSnapshot(
    ordersCol,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          id: docSnap.id,
          ...data
        } as Order);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(orders);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
      if (onError) onError(error);
    }
  );
}

export async function fetchUserOrders(userEmailOrUid: string): Promise<Order[]> {
  try {
    const all = await fetchAllOrders();
    return all.filter(o => o.customerEmail === userEmailOrUid || o.customerId === userEmailOrUid);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'orders');
    return [];
  }
}

export async function updateOrderInFirestore(
  orderId: string, 
  updates: { 
    status?: Order['status']; 
    paymentStatus?: Order['paymentStatus']; 
    adminNotes?: string;
  }
): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    throw error;
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    throw error;
  }
}
