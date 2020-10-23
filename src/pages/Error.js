import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Error() {
  const history = useHistory()

  return (
    <div className="container text-center mt-5">
      <hr className="my-5" />
      <h2>Sorry! the Symbol you chose is not available in the API!</h2>
      <h4>Or usually you have reached API limit call. Wait around one minute to be able to do requests again.</h4>
      <hr className="my-5" />
      <button className="btn btn-light mt-5" onClick={e => history.go(-1)}>Go Back</button>
    </div>
  )
}