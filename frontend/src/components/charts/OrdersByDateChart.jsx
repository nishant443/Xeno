import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/formatters.js';

const OrdersByDateChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
      <Tooltip formatter={(value, name) => (name === 'Total Sales' ? formatCurrency(value) : value)} />
      <Line type="monotone" dataKey="Orders" stroke="#2563eb" strokeWidth={3} dot={false} yAxisId="left" />
      <Line type="monotone" dataKey="Total Sales" stroke="#14b8a6" strokeWidth={3} dot={false} yAxisId="right" />
    </LineChart>
  </ResponsiveContainer>
);

OrdersByDateChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    Orders: PropTypes.number.isRequired,
    'Total Sales': PropTypes.number.isRequired
  })).isRequired
};

export default OrdersByDateChart;

