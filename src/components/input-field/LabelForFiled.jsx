const LabelDisplay = ({labelHandler, labelText, labelStyle = {color: 'white'}}) => {
    return <label htmlFor={labelHandler} style={labelStyle}>{labelText}</label>
}

export default LabelDisplay;