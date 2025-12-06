import PropTypes from 'prop-types';
import {
  Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip
} from 'recharts';
import { DEFAULT_CHART_COLORS } from '../../utils/constants.js';
import { panelClass } from '../../utils/styles.js';

const TopCustomersChart = ({ data }) => (
  <div className={panelClass}>
    <h4 style={{ marginBottom: '12px' }}>Top Customers</h4>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

TopCustomersChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired
};

export default TopCustomersChart;
