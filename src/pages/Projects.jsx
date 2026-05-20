import Footer from "../components/Footer";
import Masonry from "react-masonry-css";

// Color mapping for technology tags (using hex values)
const techColorMap = {


};

// Function to get color for a technology
const getTechColor = (tech) => {
  if (techColorMap[tech]) {
    return techColorMap[tech];
  }
  // Return error color if technology not found
  return "#b91c1c"; // red-700
};

function Projects() {
  // Breakpoint columns for masonry layout
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    768: 1
  };

  const projects = [
    {
      title: "Project Title 1",
      description: "A brief description of your project. Explain what it does, what technologies you used, and any key features or achievements. This can span multiple lines to demonstrate the masonry layout.",
      technologies: ["Technology 1", "Technology 2", "Technology 3"],
      link: "#",
      image: null // Optional: add image path here
    },
    {
      title: "Project Title 2",
      description: "Another project description. Showcase your skills and accomplishments. The masonry layout will automatically adjust the height of each card based on the content.",
      technologies: ["Technology 1", "Technology 2"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 3",
      description: "Short description.",
      technologies: ["Technology 1", "Technology 2", "Technology 3", "Technology 4"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 4",
      description: "A longer project description that demonstrates how the masonry layout handles varying content lengths. This card will be taller than shorter descriptions, and the layout will automatically arrange items to fill the space efficiently across three columns.",
      technologies: ["Technology 1"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 5",
      description: "Medium length description for another project.",
      technologies: ["Technology 1", "Technology 2"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 6",
      description: "Yet another project with a description that will help demonstrate the masonry grid layout working across three columns.",
      technologies: ["Technology 1", "Technology 2", "Technology 3"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 7",
      description: "Yet another project with a description that will help demonstrate the masonry grid layout working across three columns.",
      technologies: ["Technology 1", "Technology 2", "Technology 3"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 8",
      description: "Baby",
      technologies: ["Technology 1", "Technology 2", "Technology 3"],
      link: "#",
      image: null
    },
    {
      title: "Project Title 7",
      description: "Yet another project with a description that will help demonstrate the masonry grid layout working across three columns.",
      technologies: ["Technology 1", "Technology 2", "Technology 3"],
      link: "#",
      image: null
    }
    
  ];

  return (
    <>
      <section className="py-20 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Projects
          </h2>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-400 transition-colors overflow-hidden"
              >
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => {
                    const hasError = !techColorMap[tech];
                    const color = getTechColor(tech);
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm text-white ${hasError ? 'animate-pulse border-2 border-red-500' : ''}`}
                        style={{ backgroundColor: color }}
                        title={hasError ? `ERROR: Technology "${tech}" not found in color mapping!` : ''}
                      >
                        {hasError ? `⚠ ${tech}` : tech}
                      </span>
                    );
                  })}
                </div>
                
                {project.link && project.link !== null && project.link !== "" && project.link !== "#" && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    View Project
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Projects;

