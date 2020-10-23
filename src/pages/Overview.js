import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import AreaChartWithEdges from '../components/AreaChartWithEdge'
import OverviewDetail from '../components/OverviewDetail'

import { parseIntervalDataFromAPI, parseIntervalDataFromCache } from "../helpers/dataParser"


class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minuteInterval: [],
      symbolInfo: {},
      symbolOverview: {}
    }
  }

  infoFetcher(symbol) {
    //I know I should somehow hide the key from client, but there will be very long steps to do it, and well, it is free API anyway
    const cache = JSON.parse(localStorage.getItem("quoteCache"))
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=40LTZ1OYSJMQFJMN`)
      .then(response => { return response.json() })
      .then(quoteData => {
        //redirect - ran out of API request (5 per 1 minute)
        if (quoteData.Notes || quoteData.Information) {
          this.props.history.push("/error")
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
          fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=40LTZ1OYSJMQFJMN`)
            .then(response => { return response.json() })
            .then(overviewData => {
              if (overviewData.Note || overviewData.Information) {
                //redirect - ran out of API request (5 per 1 minute)
                this.props.history.push("/error")
              } else {
                this.setState({
                  symbolOverview: overviewData
                })
                return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=40LTZ1OYSJMQFJMN`)
              }
            })
            .then(response => { return response.json() })
            .then(intervalData => {
              if (intervalData["Time Series (1min)"]) {
                this.setState({
                  minuteInterval: parseIntervalDataFromAPI(intervalData["Time Series (1min)"], quoteData["Global Quote"]["07. latest trading day"])
                })
              } else {
                //redirect - ran out of API request (5 per 1 minute)
                this.props.history.push("/error")
              }
              //setting cache
              const { symbolInfo, minuteInterval, symbolOverview } = this.state
              if (!symbolInfo.Note && !symbolInfo.Information && !symbolInfo["Error Message"] &&
                !minuteInterval.Note && !minuteInterval.Information && !minuteInterval["Error Message"] &&
                !symbolOverview.Note && !symbolOverview.Information && !symbolOverview["Error Message"]) {
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
              this.props.history.push("/error")
            })
        }
      })
      .catch(console.log)
  }

  componentDidMount() {
    this.infoFetcher(this.props.match.params.symbol)
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.symbol !== prevProps.match.params.symbol) {
      this.setState({
        minuteInterval: [],
        symbolInfo: {},
        symbolOverview: {}
      })
      this.infoFetcher(this.props.match.params.symbol)
    }
  }

  render() {
    const {
      state: {
        minuteInterval,
        symbolInfo,
        symbolOverview,
      },
    } = this

    return (
      <>
        {minuteInterval.length ?
          <AreaChartWithEdges
            type={"hybrid"}
            data={minuteInterval}
            chartTitle={`${symbolOverview.Symbol} - ${symbolOverview.Name} - ${symbolInfo["07. latest trading day"]}`}
          />
          :
          <div className="container" style={{ width: "90%", marginLeft: "auto", marginRight: "auto", height: 305 }}>
            <div className="d-flex flex-column justify-content-center my-5">
              <div className="mx-auto">
                <ReactLoading type="balls" color="#c0c0c0" className="py-auto" />
              </div>
              <div className="text-center">

                <em>Fetching Chart Info .....(this might take around 1-2 minutes)</em> <br />
                <em>Note: API might not have the data if basic information does not pop up first below</em>
              </div>
            </div>
          </div>
        }
        {symbolInfo["01. symbol"] && symbolOverview.Name && <OverviewDetail
          title={`${symbolOverview.Name} - (${symbolOverview.Symbol})`}
          currentValue={symbolInfo["05. price"]}
          variation={symbolInfo["09. change"]}
          variationPercentage={symbolInfo["10. change percent"]}
          lastUpdated={symbolInfo["07. latest trading day"]}
          previousClose={symbolInfo["08. previous close"]}
          lowestRange={Math.min(...minuteInterval.map(el => { return el.low }))}
          highestRange={Math.max(...minuteInterval.map(el => { return el.high }))}
          open={symbolInfo["02. open"]}
          marketCap={symbolOverview.MarketCapitalization}
          volume={symbolInfo["06. volume"]}
          avgVolume={minuteInterval.length ? symbolInfo["06. volume"] / minuteInterval.length : "Calculating.."}
        />}
      </>

    )
  }
}

export default withRouter(Overview)