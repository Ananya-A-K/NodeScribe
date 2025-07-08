import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg mb-6">
      <div className="flex-1">
        <span className="text-xl font-bold">📝 NodeScribe</span>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><span className="text-sm opacity-70">{user?.email}</span></li>
            <li><button onClick={handleLogout} className="text-error">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
