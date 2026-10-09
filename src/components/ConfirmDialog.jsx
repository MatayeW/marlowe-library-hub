import { useEffect, useRef } from "react";

function ConfirmDialog({ open, title, onConfirm, onCancel, children }) {
    const dialogRef = useRef(null)

    // Open or close the native dialog when 'open' changes
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal()
        if (!open && dialog.open) dialog.close()
    }, [open])

    function handleCancelEvent(e) {
        // Esc fires "cancel". Let React state decide when to close.
        e.preventDefault()
        onCancel()
    }

    return (
        <dialog ref={dialogRef} aria-labelledby="dialog-title" onCancel={handleCancelEvent}>
            <h2 id="dialog-title">{title}</h2>
            {children}
            <p>
                <button type="button" onClick={onConfirm}>Confirm booking</button>{' '}
                <button type="button" onClick={onCancel}>Go back and edit</button>
            </p>
        </dialog>
    )
}

export default ConfirmDialog