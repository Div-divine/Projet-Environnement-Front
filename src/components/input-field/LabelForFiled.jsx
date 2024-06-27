import { generateNonce } from "../../generate-nonce/nonce";

const nonce = generateNonce()

const LabelDisplay = ({labelHandler, labelText}) => {

    return <label htmlFor={labelHandler} >{labelText}</label>
}

export default LabelDisplay;