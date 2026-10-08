import { useEffect, useRef, useState } from 'react'
import './App.css'

const VIEWS = {
  home: "Home",
  courses: "Courses",
  book: "Book a room",
}

function Page({ title, headingRef, children }) {
  return (
    <>
    <h1 ref={headingRef} tabIndex={-1}>{title}</h1>
    {children}
    </>
  )
}

function App() {
  const [view, setView] = useState("home")
  const headingRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    document.title = `${VIEWS[view]} | Riverside Public Library`
    if (firstRender.current) {
      firstRender.current = false
      return // dont steal focus on first load
    }
    headingRef.current?.focus()
  }, [view])

  return (
    <>
      <a className='skip-link' href='#main'>Skip to main content</a>
      <header className='site-header'>
        <div>
          <p><strong>Riverside Public Library</strong></p>
          <nav aria-label='Main'>
            <ul>
              {Object.entries(VIEWS).map(([key, label]) => (
                <li key={key}>
                  <button
                  type='button'
                  aria-current={view === key ? 'page' : undefined}
                  onClick={() => setView(key)}>{label}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id='main' tabIndex={-1}>
        {view === 'home' && <Page title="Home" headingRef={headingRef}><p>Welcome.</p></Page>}
        {view === 'courses' && <Page title="Course Catalogue" headingRef={headingRef}><p>Directory goes here.</p></Page>}
        {view === 'book' && <Page title="Reserve a study room" headingRef={headingRef}><p>Form goes here.</p></Page>}
      </main>

      <footer className='site-footer'>
        <div><p>Prototype for ticket MD-2026-0143.</p></div>
      </footer>
    </>
  )
}

export default App