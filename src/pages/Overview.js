import React, { Component } from 'react'
import CircleLoading from 'react-loadingg/lib/CircleLoading'
import { withRouter } from 'react-router-dom'
import AreaChartWithEdges from '../components/AreaChartWithEdge'
import { TypeChooser } from "react-stockcharts/lib/helper";


class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minuteInterval: [],
      symbolInfo: {},
      symbolLoading: true
    }
  }

  infoFetcher(symbol) {
    this.setState({
      symbolLoading: true
    })
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=QVD9TPFYQJNACIDR`)
      .then(response => {return response.json()})
      .then(data => {
        this.setState({
          symbolInfo: data["Global Quote"] || data
        })
        return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=QVD9TPFYQJNACIDR`)
      })
      .then(response => {return response.json()})
      .then(data => {
        this.setState({
          minuteInterval: data["Time Series (1min)"] || data
        })
      })
      .catch(err => {console.log(err)})
      .finally(_ => {
        this.setState({
          symbolLoading: false
        })
      })
  }

  componentDidMount() {
    this.infoFetcher(this.props.match.params.symbol)
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.symbol !== prevProps.match.params.symbol) {
      this.setState({
        minuteInterval: [],
        symbolInfo: {},
      })
      this.infoFetcher(this.props.match.params.symbol)
    }
  }

  render() {
    const {
      state: {
        symbol,
        minuteInterval,
        symbolInfo,
        symbolLoading
      },

    } = this

    if (symbolLoading && symbolInfo) {
      return (
      <>
      <CircleLoading />
      <em>Fetching {symbol} Chart .....</em>
      <h1>{JSON.stringify(symbolInfo)}</h1>
      </>
      )
    }

    if (symbolLoading) {
      return (
        <>
        <CircleLoading />
        <em>Fetching {symbol} Info .....</em>
        </>
        )
    }

    if (symbolInfo.Note || minuteInterval.Note) {
      this.props.history.push("/error")
    }

    return (
      <>
      {minuteInterval.length && 
      
      <TypeChooser>
        {(type) => <AreaChartWithEdges type={type} data={minuteInterval} />}
      </TypeChooser>
      
      }
      <h1>{JSON.stringify(minuteInterval)}</h1>
      <h1>{JSON.stringify(symbolInfo)}</h1>
      </>
    )
  }
}

export default withRouter(Overview)