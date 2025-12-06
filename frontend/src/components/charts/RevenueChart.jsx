import PropTypes from 'prop-types';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { formatCurrency } from '../../utils/formatters.js';
import { panelClass } from '../../utils/styles.js';

const RevenueChart = ({ data }) => (
  <div className={panelClass}>
    <h4 style={{ marginBottom: '12px' }}>Revenue Trend</h4>
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4c6ef5" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4c6ef5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Area type="monotone" dataKey="value" stroke="#4c6ef5" fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired
};

export default RevenueChart;
