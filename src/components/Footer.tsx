import { VideoText } from "@/components/magicui/video-text";
import { Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black text-white h-[500px] w-full overflow-hidden">
      {/* Social Icons - Top Left */}
      <div className="absolute top-4 left-4 flex space-x-4 z-10">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
          <Twitter size={20} />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
          <Github size={20} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
          <Linkedin size={20} />
        </a>
      </div>

      {/* Center VideoText */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <VideoText src="https://cdn.magicui.design/ocean-small.webm">
          LEETHUB
        </VideoText>
      </div>

      {/* Copyright - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-300 z-10">
        © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
