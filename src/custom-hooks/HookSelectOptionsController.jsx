import { useState } from "react";

const useSelectOptionValue = ({defaultValue}) => {
    const [language, setLanguage] = useState({defaultValue});
    const selectedLanguage = (e) => setLanguage(e.target.value);
    return [language, selectedLanguage] 
}

export default useSelectOptionValue;