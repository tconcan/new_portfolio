import { CONTACT_EMAIL, COPYRIGHT_NAME } from "../../data/site";

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 text-white py-8 border-t border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="font-semibold mb-3">Contact</h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-400 hover:text-white transition-colors">
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()}
            {` ${COPYRIGHT_NAME}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
