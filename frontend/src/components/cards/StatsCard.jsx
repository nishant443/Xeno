import PropTypes from 'prop-types';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';
import { panelClass } from '../../utils/styles.js';

const ACCENTS = {
  indigo: ['#6366f1', '#8b5cf6'],
  emerald: ['#10b981', '#22d3ee'],
  amber: ['#f59e0b', '#f97316'],
  pink: ['#ec4899', '#f472b6']
};

const StatsCard = ({ label, value, type = 'number', accent = 'indigo' }) => {
  const formatted = type === 'currency' ? formatCurrency(value) : formatNumber(value);
  const [from, to] = ACCENTS[accent] || ACCENTS.indigo;

  return (
    <div
      className={panelClass}
      style={{
        minHeight: '140px',
        background: `linear-gradient(135deg, ${from}15, ${to}10)`,
        border: `1px solid ${from}22`
      }}
    >
      <p style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <h3 style={{ marginTop: '12px', fontSize: '32px', color: '#0f172a' }}>{formatted}</h3>
    </div>
  );
};

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf(['number', 'currency']),
  accent: PropTypes.oneOf(['indigo', 'emerald', 'amber', 'pink'])
};

StatsCard.defaultProps = {
  accent: 'indigo'
};

export default StatsCard;
