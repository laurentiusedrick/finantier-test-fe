import React from 'react'
import { useHistory } from 'react-router-dom'

export default function PageNotFound() {
  const history = useHistory()

  return (
    <div className="container text-center mt-5">
      <hr className="my-5" />
      <h1>Error 404</h1>
      <h3>The page you are currently requested are not available</h3>
      <button className="btn btn-light mt-5" onClick={e => history.go(-1)}>Go Back</button>
      <hr className="my-5" />
    </div>
  )
}