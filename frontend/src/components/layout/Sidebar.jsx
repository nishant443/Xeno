import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants.js';

const Sidebar = () => {
  return (
    <aside className="flex flex-col gap-8 bg-slate-900/95 px-6 py-8 text-slate-100 shadow-2xl shadow-slate-900/40">
      <div className="text-2xl font-bold tracking-widest">Xeno</div>
      <nav className="flex flex-col gap-3">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              [
                'rounded-xl px-4 py-2 font-medium transition',
                isActive
                  ? 'bg-sky-400 text-slate-900 shadow-lg shadow-sky-400/50'
                  : 'text-slate-200/80 hover:bg-white/10'
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
