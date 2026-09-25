import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { fetchUserOrders, fetchAllOrders } from '../services/firebaseService';
import { useAuth } from '../services/authContext';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'np';
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ isOpen, onClose, language }) => {
  const { currentUser, userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const queryId = currentUser?.email || currentUser?.uid || '';
      if (queryId) {
        fetchUserOrders(queryId)
          .then((res) => {
            // If user has orders show them, else show all recent demo orders if any
            if (res.length > 0) {
              setOrders(res);
            } else {
              fetchAllOrders().then(all => setOrders(all.slice(0, 5)));
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        fetchAllOrders()
          .then((all) => setOrders(all.slice(0, 5)))
          .catch(console.error)
          .finally(() => setLoading(false));
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#F85606] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {language === 'en' ? 'My Daraz Orders' : 'मेरा अर्डरहरू'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-[#F85606] border-t-transparent rounded-full mx-auto mb-2" />
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-gray-700">No orders placed yet</p>
              <p className="text-xs text-gray-500 mt-1">Check out any appliance or electronics item to see your live order status here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 hover:bg-orange-50/30 transition-colors p-4 rounded-xl border border-gray-200 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs text-gray-900 block">
                      Tracking #{order.trackingNumber}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#F85606] tabular-nums font-mono">
                      Rs. {order.total.toLocaleString()}
                    </span>
                    <span className={`block text-xs font-semibold mt-0.5 ${
                      order.status === 'delivered' ? 'text-emerald-700' :
                      order.status === 'shipped' ? 'text-blue-700' :
                      'text-orange-700'
                    }`}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-gray-200/60 pt-2 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                      <span className="truncate max-w-[320px]">
                        &bull; {item.product.title} (x{item.quantity})
                      </span>
                      <span>Rs. {(item.quantity * item.product.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span className={['placed', 'confirmed', 'packed', 'shipped', 'delivered'].includes(order.status) ? 'text-[#F85606] font-bold' : ''}>
                      1. Placed
                    </span>
                    <span className={['packed', 'shipped', 'delivered'].includes(order.status) ? 'text-[#F85606] font-bold' : ''}>
                      2. Hub Packed
                    </span>
                    <span className={['shipped', 'delivered'].includes(order.status) ? 'text-[#F85606] font-bold' : ''}>
                      3. On Way
                    </span>
                    <span className={order.status === 'delivered' ? 'text-emerald-600 font-bold' : ''}>
                      4. Delivered
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-[#F85606] h-full transition-all"
                      style={{
                        width: order.status === 'delivered' ? '100%' :
                               order.status === 'shipped' ? '75%' :
                               order.status === 'packed' ? '50%' : '25%'
                      }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                  <span>Payment: <strong className="uppercase">{order.paymentMethod.replace('_', ' ')}</strong></span>
                  {order.transactionId && <span>Txn ID: <strong className="font-mono">{order.transactionId}</strong></span>}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
