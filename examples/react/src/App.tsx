import { useState } from 'react'
import './App.css'
import { ResumePreview } from './ResumePreview'
import { ExperienceManager } from './components/ExperienceManager'
import { sampleExperiences } from './sampleData'
import type { Position } from '@lib'

function App() {
  const [experiences, setExperiences] = useState<Position[]>(sampleExperiences)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Resume Layout Engine Demo</h1>
        <p className="app-description">
          Interactive form builder with real-time preview and automatic page splitting
        </p>
      </header>
      
      <main className="app-main">
        <div className="two-column-layout">
          <div className="preview-column">
            <div className="column-header">
              <h2>Live Preview</h2>
              <p className="column-description">
                See your resume layout in real-time with automatic page splitting
              </p>
            </div>
            <div className="preview-wrapper">
              <ResumePreview experiences={experiences} />
            </div>
          </div>
          
          <div className="form-column">
            <div className="column-header">
              <h2>Edit Experience</h2>
              <p className="column-description">
                Add and manage your work experiences
              </p>
            </div>
            <ExperienceManager 
              experiences={experiences}
              onChange={setExperiences}
            />
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>
          Built with React + Vite • Using the{' '}
          <a 
            href="https://github.com/yourusername/resume-layout-engine" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Resume Layout Engine
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
