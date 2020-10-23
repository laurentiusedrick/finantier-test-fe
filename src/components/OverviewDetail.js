import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class OverviewDetail extends Component {

  render() {
    const { title, currentValue, variation, variationPercentage, lastUpdated, previousClose, lowestRange, highestRange, open, marketCap, volume, avgVolume } = this.props
    const greenOrRed = Math.sign(+variation) === -1

    return (
      <div className="row container mx-auto mt-5">
        <div className="col-xl-6 col-xs-12">
          <div>
            <h5>{title}</h5>
            <h1 style={{ display: "inline" }}>{+currentValue}</h1>
            <span style={{ color: greenOrRed ? "red" : "green", fontSize: "20px", paddingBottom: "5px" }}>   {greenOrRed ? "" : "+"}{+variation}</span>
            <span style={{ color: greenOrRed ? "red" : "green", fontSize: "20px", paddingBottom: "5px" }}>   ({greenOrRed ? "" : "+"}{variationPercentage})</span>
          </div>
          <p style={{ color: "gray", fontSize: "15px", paddingBottom: "5px", marginTop: "10px" }}>Last updated: {lastUpdated}</p>
        </div>
        <div className="col-xl-6 col-xs-12 d-flex">
          <div className="col-xl-6 col-xs-12">
            <label>Open:</label>
            <h5>    {+open}</h5>
            <label>Previous Close:</label>
            <h5>    {+previousClose}</h5>
            <label>Market Capitalization:</label>
            <h5>    {+marketCap}</h5>
          </div>
          <div className="col-xl-6 col-xs-12">
            <label>Daily Range:</label>
            <h5>    {`${lowestRange === Infinity ? "Calculating" : lowestRange} - ${highestRange === -Infinity ? "Calculating" : highestRange}`}</h5>
            <label>Daily Volume:</label>
            <h5>    {+volume}</h5>
            <label>Average Volume/min:</label>
            <h5>    {avgVolume === "Calculating.." ? avgVolume : Number(avgVolume).toFixed(2)}</h5>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(OverviewDetail)