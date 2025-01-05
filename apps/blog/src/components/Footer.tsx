import { siteConfig } from "@/config/site";
import { snsUrls } from "@/config/sns";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 h-footer">
      <div className="container mx-auto h-full px-4 flex flex-col items-center justify-center">
        <div className="flex space-x-4 mb-4">
          <a href={snsUrls.github} target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-2xl hover:text-gray-400" />
          </a>
          <a href={snsUrls.twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-blue-400" />
          </a>
        </div>
        <p className="text-sm text-gray-400">
          © 2023-{new Date().getFullYear()} {siteConfig.title}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
