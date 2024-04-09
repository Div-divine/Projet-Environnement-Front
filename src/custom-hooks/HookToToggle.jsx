import { useState } from "react";

/**
 * @param {boolean} initialState
 */
function useToggle(initialState = false) {
    const [state, setState] = useState(initialState)
    const toggle = () => setState(v => !v)
    return [state, toggle]
}


export default useToggle;