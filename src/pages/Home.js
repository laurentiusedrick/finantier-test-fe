import React from 'react'

export default function Home() {

  return (
    <div className="container d-flex" style={{ marginTop: "50px", height: "75vh" }}>
      <div className="col-xl-4 col-lg-4 border text-right py-4 pr-5 pl-4 rounded-right" style={{ borderRadius: "100px", backgroundColor: "#f3f3f3" }}>
        <h2 className="my-4">Get the latest information for your favorite stock quote</h2>
        <hr />
        <p className="my-4">More than 500+ access to the most famous stock company for you to gather the information</p>
      </div>
      <div className="col-xl-8 col-lg-8 border rounded bg-light">
        <div className="container d-flex justify-content-center">
          <img src="https://alpari.com/public/img/pages/beginner/advantage-1.svg" alt="Stock Chart" style={{ marginTop: "25%", objectFit: "cover" }} />
        </div>
      </div>
    </div>
  )
}