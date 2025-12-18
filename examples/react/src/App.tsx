import './App.css'
import { ResumePreview } from './ResumePreview'
import { sampleExperiences } from './sampleData'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Resume Layout Engine Demo</h1>
        <p className="app-description">
          Headless layout engine for automatic resume page splitting with TypeScript
        </p>
      </header>
      
      <main className="app-main">
        <ResumePreview experiences={sampleExperiences} />
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
