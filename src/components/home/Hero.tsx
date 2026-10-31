import { Link } from "react-router";
import { CONTACT_EMAIL, OWNER_NAME } from "../../data/site";
import { OUTLINE_BUTTON } from "../ui/styles";

export default function Hero() {
  return (
    <section id="home" className="min-h-[85vh] flex items-center justify-center text-white pt-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <img
          src="/hero/tom.webp"
          alt={OWNER_NAME}
          className="w-56 h-56 md:w-72 md:h-72 rounded-full mx-auto mb-8 object-cover border-4 border-blue-400 shadow-lg"
        />
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">Hi, I'm Tom</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8">
          Engineering <span className="mx-2">|</span> Leadership <span className="mx-2">|</span> Entrepreneurship
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/projects" className={`${OUTLINE_BUTTON} px-8 py-3`}>
            Projects
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className={`${OUTLINE_BUTTON} px-8 py-3`}>
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}
