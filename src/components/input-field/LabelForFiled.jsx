import { generateNonce } from "../../generate-nonce/nonce";

const nonce = generateNonce()

const LabelDisplay = ({labelHandler, labelText, labelStyle = {color: 'white'}}) => {

    return <label htmlFor={labelHandler} style={labelStyle} nonce={nonce}>{labelText}</label>
}

export default LabelDisplay;