// One labelled form control. Links its hint and error to the input with aria-describedby
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

export default Field
