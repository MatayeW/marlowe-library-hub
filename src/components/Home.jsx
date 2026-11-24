import { useState } from "react";
import { courses } from '../data/courses'

const FEATURED = courses.slice(0, 3)

function Home({ onSearch, onNavigate, onRegister }) {
    const [query, setQuery] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        onSearch(query.trim())
    }

    return (
        <>
        <section aria-labelledby="find-heading">
            <h2 id="find-heading">Find a course</h2>
            <form role="search" onSubmit={handleSubmit}>
                <label htmlFor="home-search">Search courses</label>
                <p className="hint" id="home-search-hint">
                    Type a keyword, for example "computers". Leave it empty to see everything.
                </p>
                <input id="home-search" type="search" value={query}
                aria-describedby="home-search-hint" onChange={(e) => setQuery(e.target.value)} />
                <p>
                    <button type="submit">Search the catalogue</button>
                </p>
            </form>
        </section>

        <section aria-labelledby="featured-heading">
            <h2 id="featured-heading">Courses to start with</h2>
            <ul className="results">
                {FEATURED.map((course) => (
                    <li key={course.id}>
                        <article>
                            <h3>{course.title}</h3>
                            <p>{course.format} | {course.topic}</p>
                            <p>{course.description}</p>
                            <p>
                                <button type="button" aria-label={`Register for ${course.title}`}
                                onClick={() => onRegister(course)}>Register</button>
                            </p>
                        </article>
                    </li>
                ))}
            </ul>
            <p>
                <button type="button" onClick={() => onNavigate('courses')}>Browse all courses</button>
            </p>
        </section>

        <section aria-labelledby="rooms-heading">
            <h2 id="rooms-heading">Study rooms</h2>
            <p>Reserve a quiet room for one person or a group, including a step-free accessible room.</p>
            <p>
                <button type="button" onClick={() => onNavigate('book')}>Book a study room</button>
            </p>
        </section>

        <aside aria-labelledby="visit-heading">
            <h2 id="visit-heading">Visit information</h2>
            <p>Opening hours: Mon to Sat, 9:00 to 18:00. Step-free access at the main entrance.</p>
        </aside>
        </>
    )
}

export default Home
