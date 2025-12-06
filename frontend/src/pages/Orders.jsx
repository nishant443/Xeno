import Loader from '../components/common/Loader.jsx';
import useFetch from '../hooks/useFetch.js';
import * as dashboardService from '../services/dashboardService.js';
import { formatCurrency } from '../utils/formatters.js';
import { btnOutlineClass, panelClass } from '../utils/styles.js';

const Orders = () => {
  const { data: orders, loading, error, refetch } = useFetch(dashboardService.getOrders, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={panelClass}>
        <p className="text-sm font-semibold text-rose-500">Unable to load orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Orders Overview</h2>
          <p className="text-sm text-slate-500">Derived from latest ingestion metrics.</p>
        </div>
        <button
          onClick={refetch}
          className={btnOutlineClass}
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400">
              <th className="py-3">Order</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((order) => (
              <tr key={order.id} className="border-b border-slate-50 text-sm text-slate-700">
                <td className="py-3">{order.name}</td>
                <td className="py-3 font-semibold">{formatCurrency(order.total)}</td>
                <td className="py-3 text-slate-400">{new Date(order.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {!orders?.length && (
              <tr>
                <td colSpan="3" className="py-4 text-center text-slate-400">
                  No orders yet. Run an ingestion to see data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
