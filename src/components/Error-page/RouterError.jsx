import {useRouteError} from 'react-router-dom'

function ErrorPage() {
    const error = useRouteError()
    console.log(error)
    return <div>
      <h2 className='error-page'>Something went wrong !</h2>
      <p>
        {error?.error?.toString() ?? error?.toString()}
      </p>
    </div>
  }

export default ErrorPage; 