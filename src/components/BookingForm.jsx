import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const ROOMS = [
    { id: 'quiet-a', name: 'Quiet Room A', capacity: 2 },
    { id: 'quiet-b', name: 'Quiet Room B', capacity: 8 },
    { id: 'quiet-c', name: 'Accessible Room C (step-free)', capacity: 6 },
]

const FIELD_ORDER = ['name', 'email', 'room', 'date', 'time', 'guests']

const EMPTY = { name: '', email: '', room: '', date: '', time: '', guests: ''}

function todayString() {
    const d = new Date()
    const month = String(d.getMonth() +1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
}

function validate(values) {
    const errors = {}

    if(!values.name.trim()) errors.name = 'Enter your full name.'

    if(!values.email.trim()) {
        errors.email = 'Enter your email address.'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Enter an email address like name@example.com.'
    }

    if(!values.room) errors.room = 'Choose a room.'

    if(!values.date) {
        errors.date = 'Choose a date.'
    } else if (values.date < todayString()) {
        errors.date = 'Choose today or a future date.'
    }

    if(!values.time) {
        errors.time = 'Choose a start time.'
    } else if (values.time < '09:00' || values.time > '17:00') {
        errors.time = 'Choose a start time between 09:00 and 17:00.'
    }

    const room = ROOMS.find((r) => r.id === values.room)
    const guests = Number(values.guests)
    if(!values.guests) {
        errors.guests = 'Enter the number of people.'
    } else if (!Number.isInteger(guests) || guests < 1) {
        errors.guests = 'Enter a whole number of 1 or more.'
    } else if (room && guests > room.capacity) {
        errors.guests = `${room.name} holds up to ${room.capacity} people.`
    }
    return errors
}

function Field({ id, label, hint, error, as = 'input', children, ...props }) {
    const hintId = `${id}-hint`
    const errorId = `${id}-error`
    const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined
    const Control = as

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            {hint && <p className="hint" id={hintId}>{hint}</p>}
            {error && <p className="error" id={errorId}>Error: {error}</p>}
            <Control id={id} name={id} aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy} {...props}>{children}</Control> 
        </div>
    )
}

function BookingForm() {
    const [values, setValues] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('')
    const [confirmed, setConfirmed] = useState(null)
    const [pending, setPending] = useState(null)

    const confirmRef = useRef(null)
    const focusFormNext = useRef(false)

    // Move focus after the screen changes
    useEffect(() => {
        if (confirmed) {
            confirmRef.current?.focus()
        } else if (focusFormNext.current) {
            document.getElementById('name')?.focus()
            focusFormNext.current = false
        }
    }, [confirmed])

    function handleChange(e) {
        const { name, value } = e.target
        const next = { ...values, [name]: value }
        setValues(next)

        // Only update errors the user has already seen, so typing doesnt add new ones
        const fresh = validate(next)
        const keys = name === 'room' ? [ 'room', 'guests'] : [name]
        setErrors((prev) => {
            const updated = { ...prev }
            keys.forEach((k) => {
                if (prev[k]) {
                    if (fresh[k]) updated[k] = fresh[k]
                    else delete updated[k]
                }
            })
            return updated
        })
    }

    function handleBlur(e) {
        const { name } = e.target
        const fresh = validate(values)
        setErrors((prev) => {
            const updated = { ...prev }
            if (fresh[name]) updated[name] = fresh[name]
            else delete updated[name]
            return updated
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        const found = validate(values)
        setErrors(found)

        const invalid = FIELD_ORDER.filter((k) => found[k])
        if (invalid.length > 0) {
            const count = invalid.length
            setStatus(
                `Error: ${count} ${count === 1 ? 'problem' : 'problems'} found. ${found[invalid[0]]}`
            )
            document.getElementById(invalid[0])?.focus()
            return
        }

        setStatus('')
        const room = ROOMS.find((r) => r.id === values.room)
        setPending({ ...values, roomName: room.name })
    }

    function handleConfirm() {
        setConfirmed(pending)
        setPending(null)
    }

    function handleCancel() {
        setPending(null)
    }

    function startAgain() {
        focusFormNext.current = true
        setValues(EMPTY)
        setErrors({})
        setConfirmed(null)
    }

    if (confirmed) {
        return (
            <section aria-labelledby="confirm-heading">
                <h2 id="confirm-heading" ref={confirmRef} tabIndex={-1}>Booking confirmed</h2>
                <p>
                    {confirmed.roomName} is reserved for {confirmed.guests}{' '}
                    {Number(confirmed.guests) === 1 ? 'person' : 'people'} on {confirmed.date} at{' '}
                    {confirmed.time}. A confirmation will be sent to {confirmed.email}.
                </p>
                <p>
                    <button type="button" onClick={startAgain}>Make another booking</button>
                </p>
            </section>
        )
    }

    return (
        <section aria-labelledby="form-heading">
            <h2 id="form-heading">Your details</h2>
            <p>All fields are required.</p>

            {/* Always on the page so screen readers are already watching it */}
            <div aria-live="assertive" aria-atomic="true">
                {status && <p className="error">{status}</p>}
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
                id="room" label="Room" as="select"
                value={values.room} error={errors.room}
                onChange={handleChange} onBlur={handleBlur}
                >
                    <option value="">Choose a room</option>
                    {ROOMS.map((r) => (
                        <option key={r.id} value={r.id}>{r.name} (up to {r.capacity})</option>
                    ))}
                </Field>
                <Field
                id="date" label="Date" type="date"
                value={values.date} error={errors.date}
                onChange={handleChange} onBlur={handleBlur}
                />
                <Field
                id="time" label="Start time" type="time"
                hint="Rooms can be booked for one hour, starting 09:00 to 17:00."
                value={values.time} error={errors.time}
                onChange={handleChange} onBlur={handleBlur}
                />
                <Field
                id="guests" label="Number of people" type="number" inputMode="numeric"
                hint="The room you choose sets the maximum."
                value={values.guests} error={errors.guests}
                onChange={handleChange} onBlur={handleBlur}
                />
                <p>
                    <button type="submit">Reserve room</button>
                </p>
            </form>
            <ConfirmDialog
            open={pending !== null}
            title="Review your booking"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            >
                {pending && (
                    <p>
                        {pending.roomName} for {pending.guests}{' '}
                        {Number(pending.guests) === 1 ? 'person' : 'people'} on {pending.date} at{' '}
                        {pending.time}. Confirmation goes to {pending.email}.
                    </p>
                )}
            </ConfirmDialog>
        </section>
    )
}

export default BookingForm