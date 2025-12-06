import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  Tooltip,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { panelClass } from '../../utils/styles.js';

const EventFunnelChart = ({ data }) => (
  <div className={panelClass}>
    <h4 style={{ marginBottom: '12px' }}>Checkout Journey</h4>
    <ResponsiveContainer width="100%" height={260}>
      <FunnelChart>
        <Tooltip />
        <Funnel
          dataKey="value"
          data={data}
          isAnimationActive={false}
        >
          <LabelList position="right" fill="#0f172a" stroke="none" dataKey="name" />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  </div>
);

EventFunnelChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired
};

export default EventFunnelChart;

