import { Link } from 'react-router-dom';
import { btnPrimaryClass } from '../utils/styles.js';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
    <h1 className="text-6xl font-bold">404</h1>
    <p className="text-lg text-white/80">Oops! Page not found.</p>
    <Link to="/" className={btnPrimaryClass}>
      Go back home
    </Link>
  </div>
);

export default NotFound;
