import { generateNonce } from "../../generate-nonce/nonce"
import '../../style/signIn.css'

const LoginErrorMsg = ({loginErrorMsgHandler}) => {
    const nonce = generateNonce()
    
    const LoginErrorField = ({loginErrorMsgHandler}) => {
        return <div className='text-center login-error-msg'>
            <p>{loginErrorMsgHandler}</p>
        </div>
    }

    return <LoginErrorField loginErrorMsgHandler={{loginErrorMsgHandler}}/>;
}

export default LoginErrorMsg;