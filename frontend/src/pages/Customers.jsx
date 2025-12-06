import Loader from '../components/common/Loader.jsx';
import useFetch from '../hooks/useFetch.js';
import * as dashboardService from '../services/dashboardService.js';
import { btnOutlineClass, panelClass } from '../utils/styles.js';
import { formatCurrency } from '../utils/formatters.js';

const Customers = () => {
  const { data: customers, loading, error, refetch } = useFetch(dashboardService.getCustomers, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={panelClass}>
        <p className="text-sm font-semibold text-rose-500">Unable to load customers: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Top Customers</h2>
          <p className="text-sm text-slate-500">Placeholder list derived from metrics until detailed endpoints exist.</p>
        </div>
        <button
          onClick={refetch}
          className={btnOutlineClass}
        >
          Refresh
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {(customers || []).map((customer) => (
          <li
            key={customer.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {customer.name || (customer.firstName || customer.lastName
                  ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                  : customer.email || `Customer ${customer.id}`)}
              </p>
              <small className="text-xs text-slate-400">{customer.email || customer.name || customer.id}</small>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{formatCurrency(customer.total || customer.totalSpent)}</p>
              <small className="text-xs text-slate-400">{new Date(customer.updatedAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
        {!customers?.length && (
          <li className="py-6 text-center text-slate-400">
            No customers available yet.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Customers;
