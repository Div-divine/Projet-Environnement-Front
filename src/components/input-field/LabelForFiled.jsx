import { generateNonce } from "../../generate-nonce/nonce";

const nonce = generateNonce()

const LabelDisplay = ({labelHandler, labelText, labelStyle}) => {

    return <label htmlFor={labelHandler} style={labelStyle}>{labelText}</label>
}

export default LabelDisplay;