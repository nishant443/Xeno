import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters.js';
import { panelClass } from '../../utils/styles.js';

const TopCustomersList = ({ customers }) => (
  <div className={panelClass}>
    <h4 className="mb-3 text-lg font-semibold text-slate-900">Top Customers</h4>
    <ul className="flex flex-col gap-3">
      {customers.map((customer) => (
        <li
          key={customer.id}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm"
        >
          <div>
            <p className="font-semibold text-slate-900">
              {customer.name
                || (customer.firstName || customer.lastName
                  ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                  : customer.email || `Customer ${customer.id}`)}
            </p>
            <small className="text-sm text-slate-400">{customer.email || customer.name || 'No email'}</small>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-900">{formatCurrency(customer.total ?? customer.totalSpent)}</p>
            <small className="text-sm text-slate-400">Lifetime spend</small>
          </div>
        </li>
      ))}
      {!customers.length && (
        <li className="py-6 text-center text-sm text-slate-400">
          No customers yet.
        </li>
      )}
    </ul>
  </div>
);

TopCustomersList.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    totalSpent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }))
};

TopCustomersList.defaultProps = {
  customers: []
};

export default TopCustomersList;

