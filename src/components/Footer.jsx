function Footer() {
  return (
    <footer className="bg-gray-900/80 text-white py-8 border-t border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <a 
              href="mailto:thomascon04@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              thomascon04@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Thomas Concannon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;