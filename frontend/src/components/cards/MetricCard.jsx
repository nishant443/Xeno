import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/formatters.js';
import { panelClass } from '../../utils/styles.js';

const MetricCard = ({ title, subtitle, value }) => (
  <div className={panelClass}>
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{subtitle}</p>
    <h4 className="mt-1 text-xl font-semibold text-slate-800">{title}</h4>
    <p className="mt-3 text-3xl font-bold text-slate-900">{formatNumber(value)}</p>
  </div>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

MetricCard.defaultProps = {
  subtitle: 'metric'
};

export default MetricCard;
