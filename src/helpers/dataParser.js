
export function parseIntervalDataFromAPI(intervObj, latest) {
  //here sometimes the "latest date" from symbolInfo changed but actually the timeframe data hasn't, making it error. One alternative is that it uses the latest date available in the data (intervObj)
  let result = []
  let latestDate = ""
  for (let key in intervObj) {
    let d = {}
    const date = key.split(" ")
    if (latestDate === "") {
      latestDate = date[0]
    }
    if (date[0] === latestDate) {
      d.date = new Date(key)
      d.open = +intervObj[key]["1. open"]
      d.high = +intervObj[key]["2. high"]
      d.low = +intervObj[key]["3. low"]
      d.close = +intervObj[key]["4. close"]
      d.volume = +intervObj[key]["5. volume"]
      result.push(d)
    }
  }
  result.sort((a, b) => {
    return a.date.valueOf() - b.date.valueOf();
  })
  return result
}

export function parseIntervalDataFromCache(array) {
  const parsedMinuteInterval = array.map(info => {
    return {
      ...info,
      date: new Date(info.date),
      open: +info.open,
      high: +info.high,
      low: +info.low,
      close: +info.close,
      volume: +info.volume
    }
  })
  return parsedMinuteInterval
}
