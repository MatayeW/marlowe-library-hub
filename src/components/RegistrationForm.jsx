import { useEffect, useRef, useState } from "react";
import Field from "./Field";

const FIELD_ORDER = ['name', 'email']

const LABELS = {
    name: 'Full name',
    email: 'Email address',
}

const EMPTY = { name: '', email: '', support: '' }

function validate(values) {
    const errors = {}

    if (!values.name.trim()) errors.name = 'Enter your full name.'

    if (!values.email.trim()) {
        errors.email = 'Enter your email address.'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Enter an email address like name@example.com.'
    }

    return errors
}

function RegistrationForm({ course, onBackToCourses }) {
    const [values, setValues] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('')
    const [statusCount, setStatusCount] = useState(0)
    const [confirmed, setConfirmed] = useState(null)
    const confirmRef = useRef(null)

    // Move focus to the confirmation heading once the screen changes
    useEffect(() => {
        if (confirmed) confirmRef.current?.focus()
    }, [confirmed])

    function announce(message) {
        setStatus(message)
        setStatusCount((n) => n + 1)
    }

    function handleChange(e) {
        const { name, value } = e.target
        const next = { ...values, [name]: value }
        setValues(next)

        // Only update errors the user has already seen
        const fresh = validate(next)
        setErrors((prev) => {
            const updated = { ...prev }
            if (prev[name]) {
                if (fresh[name]) updated[name] = fresh[name]
                else delete updated[name]
            }
            return updated
        })
    }

    function handleBlur(e) {
        const { name } = e.target
        if (!LABELS[name]) return // the optional box has nothing to validate
        const fresh = validate(values)
        setErrors((prev) => {
            const updated = { ...prev }
            if (fresh[name]) updated[name] = fresh[name]
            else delete updated[name]
            return updated
        })
        // Say the error out loud now, while the person is leaving the field
        announce(fresh[name] ? `Error: ${LABELS[name]}. ${fresh[name]}` : '')
    }

    function handleSubmit(e) {
        e.preventDefault()
        const found = validate(values)
        setErrors(found)

        const invalid = FIELD_ORDER.filter((k) => found[k])
        if (invalid.length > 0) {
            const count = invalid.length
            announce(
                `Error: ${count} ${count === 1 ? 'problem' : 'problems'} found. ${found[invalid[0]]}`
            )
            document.getElementById(invalid[0])?.focus()
            return
        }

        announce('')
        setConfirmed({ ...values })
    }

    if (confirmed) {
        return (
            <section aria-labelledby="registered-heading">
                <h2 id="registered-heading" ref={confirmRef} tabIndex={-1}>Registration confirmed</h2>
                <p>
                    {confirmed.name}, you are registered for {course.title} ({course.format}).
                    A confirmation will be sent to {confirmed.email}.
                </p>
                <p>
                    <button type="button" onClick={onBackToCourses}>Back to courses</button>
                </p>
            </section>
        )
    }

    return (
        <section aria-labelledby="register-form-heading">
            <h2 id="register-form-heading">Your details</h2>
            <article>
                <h3>{course.title}</h3>
                <p>{course.format} | {course.topic}</p>
                <p>{course.description}</p>
            </article>
            <p>Full name and email address are required.</p>

            {/* Always on the page so screen readers are already watching it */}
            <div aria-live="assertive" aria-atomic="true">
                {status && <p key={statusCount} className="error">{status}</p>}
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <Field
                id="name" label="Full name" autoComplete="name"
                value={values.name} error={errors.name}
                onChange={handleChange} onBlur={handleBlur}
                />
                <Field
                id="email" label="Email address" type="email" autoComplete="email"
                hint="We will send your confirmation here."
                value={values.email} error={errors.email}
                onChange={handleChange} onBlur={handleBlur}
                />
                <Field
                id="support" label="Access needs (optional)" as="textarea" rows={3}
                hint="For example, a sign language interpreter or large-print materials."
                value={values.support}
                onChange={handleChange} onBlur={handleBlur}
                />
                <p>
                    <button type="submit">Register for this course</button>
                    {' '}
                    <button type="button" onClick={onBackToCourses}>Cancel</button>
                </p>
            </form>
        </section>
    )
}

export default RegistrationForm
