const LabelDisplay = ({labelHandler, labelText}) => {
    return <label htmlFor={labelHandler}>{labelText}</label>
}

export default LabelDisplay;