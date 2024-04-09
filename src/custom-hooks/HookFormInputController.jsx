import { useState } from "react";

const useStoreValueInputedInField = () => {
    const [value, setValue] = useState('');
    const getValue = (e) => (setValue(e.target.value));
    return [value, getValue];
}

export default useStoreValueInputedInField;