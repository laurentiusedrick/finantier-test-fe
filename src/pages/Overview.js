import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import AreaChartWithEdges from '../components/AreaChartWithEdge'

import { parseIntervalDataFromAPI, parseIntervalDataFromCache } from "../helpers/dataParser"


class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minuteInterval: [],
      minuteeInterval: [],
      symbolInfo: {},
      symbolOverview: {},
      symbolLoading: true
    }
  }

  //EMERGENCY FUNCTION - DELETE SOON
  infoFetcherLocalStorage() {
    const cache = JSON.parse(localStorage.getItem("quoteCache"))
    console.log(cache.symbolInfo)
    this.setState({
      symbolInfo: cache.symbolInfo,
      minuteInterval: parseIntervalDataFromCache(cache.minuteInterval),
      symbolOverview: cache.symbolOverview,
      symbolLoading: false
    })
  }
  //EMERGENCY FUNCTION - DELETE SOON

  infoFetcher(symbol) {
    //I know I should somehow hide the key from client, but there will be very long steps to do it, and well, it is free API anyway
    this.setState({
      symbolLoading: true
    })
    const cache = JSON.parse(localStorage.getItem("quoteCache"))
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=QVD9TPFYQJNACIDR`)
      .then(response => {return response.json()})
      .then(quoteData => {
        // console.log(quoteData)
        //redirect - ran out of API request (5 per 1 minute)
        if (quoteData.Notes || quoteData.Information) {
          this.setState({
            symbolInfo: quoteData
          })
        }
        //success obtaining cache and store necessary data to it
        else if (cache && cache.symbolInfo["01. symbol"] === symbol && cache.symbolInfo["07. latest trading day"] === quoteData["Global Quote"]["07. latest trading day"]) {
            this.setState({
              symbolInfo: quoteData["Global Quote"],
              minuteInterval: parseIntervalDataFromCache(cache.minuteInterval),
              symbolOverview: cache.symbolOverview,
              symbolLoading: false
            })
        } else {        
          //no cache found or latest data stored in cache
          this.setState({
            symbolInfo: quoteData["Global Quote"],
          })  
          fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=QVD9TPFYQJNACIDR`)
            .then(response => {return response.json()})
            .then(overviewData => {
              if (overviewData.Note || overviewData.Information) {
                //redirect - ran out of API request (5 per 1 minute)
                this.setState({
                  symbolOverview: overviewData
                })
              } else {
                this.setState({
                symbolOverview: overviewData
                })
                return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=QVD9TPFYQJNACIDR`)
              }})
            .then(response => {return response.json()})
            .then(intervalData => {
              if (intervalData["Time Series (1min)"]) {
                this.setState({
                  minuteInterval: parseIntervalDataFromAPI(intervalData["Time Series (1min)"], quoteData["Global Quote"]["07. latest trading day"])
                })
              } else {
                //redirect - ran out of API request (5 per 1 minute)
                this.setState({
                  minuteInterval: intervalData
                })
              }
                //setting cache
                const {symbolInfo, minuteInterval, symbolOverview} = this.state
                // console.log(symbolInfo)
                // console.log(minuteInterval)
                // console.log(symbolOverview)
                if (!symbolInfo.Note && !symbolInfo["Error Message"] &&
                    !minuteInterval.Note && !minuteInterval["Error Message"] &&
                    !symbolOverview.Note && !symbolOverview["Error Message"]) {
                    localStorage.setItem("quoteCache", JSON.stringify({
                      symbolInfo,
                      minuteInterval,
                      symbolOverview
                    }))
                } else {
                  this.props.history.push("/error")
                }
            })
            .catch(err => {
              console.log(err)
              // this.props.history.push("/error")
            })
        }
      })
      .catch(err => {
        console.log(err)
        this.props.history.push("/error")
      })
      .finally(_ => {
        this.setState({
          symbolLoading: false
        })
      })
  }

  //EMERGENCY FUNCTION - DELETE SOON - infoFetcherLocalStorage
  componentDidMount() {
    // this.infoFetcher(this.props.match.params.symbol)
    this.infoFetcherLocalStorage()
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.match.params.symbol !== prevProps.match.params.symbol) {
  //     this.setState({
  //       minuteInterval: [],
  //       symbolInfo: {},
  //       symbolOverview: {}
  //     })
  //     this.infoFetcher(this.props.match.params.symbol)
  //   }
  // }

  render() {
    const {
      state: {
        minuteInterval,
        minuteeInterval,
        symbolInfo,
        symbolOverview,
        symbolLoading
      },
    } = this

    // if (symbolLoading) {
    //   return (
    //     <>
    //     <CircleLoading />
    //     <em>Fetching Info .....</em>
    //     </>
    //     )
    // }

    return (
      <>
      {minuteInterval.length ? 
        <AreaChartWithEdges 
          type={"hybrid"} 
          data={minuteInterval} 
          chartTitle={`${symbolOverview.Symbol} - ${symbolOverview.Name} - ${symbolInfo["07. latest trading day"]}`}
        />
      :
        <div className="container" style={{width:"90%", marginLeft:"auto", marginRight:"auto", height:350}}>
          <div className="d-flex flex-column justify-content-center my-5">
            <div className="mx-auto">

              <ReactLoading type="balls" color="#c0c0c0" className="py-auto"/>
            </div>
            <div className="text-center">

              <em>Fetching Chart Info .....</em>
            </div>
          </div>
        </div>
      }
      <p>{JSON.stringify(symbolOverview)}</p>
      <p>{JSON.stringify(symbolInfo)}</p>
      </>
    )
  }
}

export default withRouter(Overview)