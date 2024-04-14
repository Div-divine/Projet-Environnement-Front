const LoginErrorMsg = ({loginErrorMsgHandler}) => {
    const loginErrorMsgStyle = {
        color: 'white',
        backgroundColor: 'red',
        width: '600px',
        padding: '10px',
        marginRight: 'auto',
        marginLeft: 'auto',
    }
    const LoginErrorField = ({loginErrorMsgHandler}) => {
        return <div className='text-center ' style={loginErrorMsgStyle}>
            <p>{loginErrorMsgHandler}</p>
        </div>
    }

    return <LoginErrorField loginErrorMsgHandler={{loginErrorMsgHandler}}/>;
}

export default LoginErrorMsg;