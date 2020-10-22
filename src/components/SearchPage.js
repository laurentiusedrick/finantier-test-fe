import React, { Component } from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchInput: '',
      recommendationInput: [],
      showRecommendation: false,
      recommendationLoading: false
    }
  }

  inputChange = e => {
    this.setState({
      recommendationLoading: true,
      searchInput: e.target.value
    })
    this.recommendationFromAPI(e.target.value)
  }

  recommendationFromAPI = _.debounce((input) => {
    if(input) {
      //I know I should somehow hide the key from client, but there will be very long steps to do it, and well, it is free API anyway
      fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=QVD9TPFYQJNACIDR`)
      .then(response => {return response.json()})
      .then(data => {
        this.setState({
          recommendationInput: data.bestMatches || data
        })
      })
      .catch(err => {console.log(err)})
      .finally(_ => {
        this.setState({
          recommendationLoading: false
        })
      })
    } else {
      this.setState({
        recommendationInput: [],
        recommendationLoading: false
      })
    }
  }, 1000)


  keyDown = e => {
    let {recommendationInput} = this.state
    if (e.keyCode === 13 && recommendationInput.length) {
      this.props.history.push(`/${recommendationInput[0]["1. symbol"]}`)
      this.setState({
        recommendationInput: [],
        searchInput: ''
      })
    }
  }

  onRecommendationClick = val => {
      this.props.history.push(`/${val}`)
      this.setState({
        recommendationInput: [],
        searchInput: ''
      });
  }

  render() {
    const { 
      state: {
        recommendationInput,
        searchInput,
        recommendationLoading
      },
      inputChange,
      keyDown,
      onRecommendationClick
    } = this

    let recommendationListComponent;
    if (recommendationInput.Note || recommendationInput.Information) {
      this.props.history.push("/error")
    }
      if (recommendationInput.length) {
        recommendationListComponent = (
          <ul className="recommendation">
             {recommendationInput.map((recomm, index) => {

              return (
                <li key={recomm["1. symbol"]} onClick={e => onRecommendationClick(recomm["1. symbol"])}>
                  <em>{recomm["1. symbol"]} </em>
                  <span className="float-right"> {recomm["2. name"]}</span>
                </li>
              )
            })}
          </ul>
        )
      }
    // }

    return (
      <div className="container mt-3">
        <div className="mx-auto my-2 text-center">
          <h1>Stock Charts</h1>
        </div>
        <input 
          type="text"
          className="mx-auto px-auto my-3 search-main"
          onChange={inputChange}
          onKeyDown={keyDown}
          value={searchInput}
        /> 
        {/* {recommendationLoading && <CircleLoading />} */}
        {recommendationListComponent}
      </div>
    )
  }
}

export default withRouter(SearchPage)