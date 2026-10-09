import { useRef, useState } from "react";
import { courses } from '../data/courses'

const FORMATS = [...new Set(courses.map((c) => c.format))]
const TOPICS = [...new Set(courses.map((c) => c.topic))]

function toggleItem(list, item) {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
}

// A group of toggle buttons. Aria-pressed tells screen readers on/off
function FilterGroup({ legend, options, selected, onToggle }) {
    return (
        <fieldset>
            <legend>{legend}</legend>
            {options.map((option) => (
                <button 
                key={option}
                type="button"
                aria-pressed={selected.includes(option)}
                onClick={() => onToggle(option)}>{option}</button>
            ))}
        </fieldset>
    )
}

function CourseDirectory() {
    const [query, setQuery] = useState("")
    const [formats, setFormats] = useState([])
    const [topics, setTopics] = useState([])
    const [filtersOpen, setFiltersOpen] = useState(false)
    const searchRef = useRef(null)

    const text = query.trim().toLowerCase()
    const results = courses.filter((course) => {
        const matchesText = text === "" ||
        `${course.title} ${course.description} ${course.topic}`.toLowerCase().includes(text)
        const matchesFormat = formats.length === 0 || formats.includes(course.format)
        const matchesTopic = topics.length === 0 || topics.includes(course.topic)
        return matchesText && matchesFormat && matchesTopic
    })

    const activeCount = formats.length + topics.length

    function clearAll() {
        setQuery("")
        setFormats([])
        setTopics([])
        searchRef.current?.focus()
    }

    return (
        <>
        <section aria-labelledby="search-heading">
            <h2 id="search-heading">Search and filter</h2>

            <label htmlFor="course-search">Search courses</label>
            <p className="hint" id="course-search-hint">
                Type a keyword, for example "computers".
            </p>
            <input ref={searchRef} id="course-search" type="search" value={query}
            aria-describedby="course-search-hint" onChange={(e) => setQuery(e.target.value)} />

            {/* the button controls the panel and reports open or closed */}
            <h3>
                <button type="button" aria-expanded={filtersOpen} aria-controls="filter-panel"
                onClick={() => setFiltersOpen(!filtersOpen)} >
                    Filters{activeCount > 0 ? ` (${activeCount} active` : ""}
                </button>
            </h3>
            <div id="filter-panel" hidden={!filtersOpen}>
                <FilterGroup legend="Format" options={FORMATS} selected={formats} onToggle={(o) => setFormats(toggleItem(formats, o))} />
                <FilterGroup legend="Topic" options={TOPICS} selected={topics} onToggle={(o) => setTopics(toggleItem(topics, o))} />
            </div>

            <p>
                <button type="button" onClick={clearAll}>Clear search and filters</button>
            </p>
        </section>

        <section aria-labelledby="results-heading">
            <h2 id="results-heading">Results</h2>
            {/* always on the page so screen readers are watching it */}
            <p role="status" aria-live="polite" aria-atomic="true">
                {results.length} {results.length === 1 ? "course" : "courses"}
            </p>

            {results.length === 0 ? (
                <p>No courses match. Try a different keyword or clear the filters.</p>
            ) : (
                <ul className="results">
                    {results.map((course) => (
                        <li key={course.id}>
                            <article>
                                <h3>{course.title}</h3>
                                <p>{course.format} | {course.topic}</p>
                                <p>{course.description}</p>
                            </article>
                        </li>
                    ))}
                </ul>
            )
            }
        </section>
        </>
    )
}

export default CourseDirectory