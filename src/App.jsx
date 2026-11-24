import { useEffect, useRef, useState } from 'react'
import './App.css'
import CourseDirectory from './components/CourseDirectory'
import BookingForm from './components/BookingForm'
import Home from './components/Home'
import RegistrationForm from './components/RegistrationForm'

// These three appear in the navigation
const VIEWS = {
  home: "Home",
  courses: "Courses",
  book: "Book a room",
}

// The registration page is reached from a course, so it is not in the navigation
const TITLES = { ...VIEWS, register: "Register" }

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
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseQuery, setCourseQuery] = useState("")
  const headingRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    document.title = `${TITLES[view]} | Riverside Public Library`
    if (firstRender.current) {
      firstRender.current = false
      return // dont steal focus on first load
    }
    headingRef.current?.focus()
  }, [view])

  function goTo(key) {
    setCourseQuery("")
    setView(key)
  }

  function searchCourses(text) {
    setCourseQuery(text)
    setView("courses")
  }

  function startRegistration(course) {
    setSelectedCourse(course)
    setView("register")
  }

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
                  aria-current={view === key || (key === 'courses' && view === 'register') ? 'page' : undefined}
                  onClick={() => goTo(key)}>{label}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id='main' tabIndex={-1}>
        {view === 'home' && (
          <Page title="Find courses, book rooms and join events" headingRef={headingRef}>
            <Home onSearch={searchCourses} onNavigate={goTo} onRegister={startRegistration} />
          </Page>
        )}
        {view === 'courses' && (
          <Page title="Course Catalogue" headingRef={headingRef}>
            <CourseDirectory initialQuery={courseQuery} onRegister={startRegistration} />
          </Page>
        )}
        {view === 'register' && selectedCourse && (
          <Page title={`Register for ${selectedCourse.title}`} headingRef={headingRef}>
            <RegistrationForm key={selectedCourse.id} course={selectedCourse} onBackToCourses={() => goTo('courses')} />
          </Page>
        )}
        {view === 'book' && <Page title="Reserve a study room" headingRef={headingRef}><BookingForm /></Page>}
      </main>

      <footer className='site-footer'>
        <div><p>Prototype for ticket MD-2026-0143.</p></div>
      </footer>
    </>
  )
}

export default App