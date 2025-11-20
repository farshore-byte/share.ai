import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-8 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold tracking-wide">share.ai</span>
        <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
          <FaGithub size={20} />
        </a>
      </div>
      <div className="flex space-x-6">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">音频</Link>
        <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">联系我们</Link>
      </div>
    </nav>
  );
}

export default Navbar;
