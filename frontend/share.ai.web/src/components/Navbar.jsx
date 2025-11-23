import { NavLink } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-8 py-3 flex justify-between items-center shadow-md">
      {/* 左边：网站名 + 音频标签 */}
      <div className="flex items-center space-x-6">
        <span className="text-2xl font-bold tracking-wide">share.ai</span>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white font-medium transition-colors duration-300 ${
              isActive ? 'border-b-2 border-cyan-400 pb-1 text-white' : ''
            }`
          }
        >
          音频
        </NavLink>
      </div>

      {/* 右边：联系我们 + GitHub */}
      <div className="flex items-center space-x-6">
        <NavLink
          to="/contact"
          className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
        >
          联系我们
        </NavLink>
        <a
          href="https://github.com/farshore-byte/share.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-white transition-colors duration-300"
        >
          <FaGithub size={20} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
