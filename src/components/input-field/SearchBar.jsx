const SearchBar = ({ placeholderHandler, valueHandler, setValueHandler, classNameHandler }) => {
    return <div>
        <form >
            <input type="search"
                placeholder={placeholderHandler}
                value={valueHandler}
                onChange={setValueHandler} 
                className={classNameHandler}
                />
        </form>
    </div>
}

export default SearchBar;