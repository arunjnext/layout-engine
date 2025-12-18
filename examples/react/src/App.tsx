import type { Position } from "resume-layout-engine";
import { useState } from "react";
import { ResumePreview } from "./ResumePreview";
import { ExperienceManager } from "./components/ExperienceManager";

function App() {
  const [experiences, setExperiences] = useState<Position[]>([]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-linear-to-br from-purple-600 to-purple-800 text-white py-8 px-4 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Resume Layout Engine Demo
        </h1>
        <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto">
          Interactive form builder with real-time preview and automatic page
          splitting
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-6 lg:gap-8 items-start">
          {/* Preview Column */}
          <div className="order-2 lg:order-1 lg:sticky lg:top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Live Preview
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  See your resume layout in real-time with automatic page
                  splitting
                </p>
              </div>
              <ResumePreview experiences={experiences} />
            </div>
          </div>

          {/* Form Column */}
          <div className="order-1 lg:order-2 min-h-screen lg:min-h-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Edit Experience
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  Add and manage your work experiences
                </p>
              </div>
              <ExperienceManager
                experiences={experiences}
                onChange={setExperiences}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 px-4 text-center border-t border-gray-200 mt-auto">
        <p className="text-gray-600">
          Built with React + Vite • Using the{" "}
          <a
            href="https://github.com/yourusername/resume-layout-engine"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
          >
            Resume Layout Engine
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
