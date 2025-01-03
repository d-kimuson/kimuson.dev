import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="flex space-x-4 mb-4">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-2xl hover:text-gray-400" />
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-blue-400" />
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-2xl hover:text-blue-600" />
          </a>
        </div>
        <p className="text-sm text-gray-400">© 2023 My Tech Blog. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

