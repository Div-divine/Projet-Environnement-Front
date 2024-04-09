const InputField = ({ typeHandler, nameHandler, idHandler, placeholderHandler, valueHandler, setValueHandler }) => {
    return <input
        type={typeHandler}
        name={nameHandler}
        id={idHandler}
        placeholder={placeholderHandler}
        value={valueHandler}
        onChange={setValueHandler}
    />
}

export default InputField;