# finantier-test-fe
Stock app where you can preview specified symbol with 1D Timeframe with 1M Interval Line Graph

https://finantier-test-fe.web.app/

# Steps building the App:
  Day 1 (2020 - 10 - 21): 
  1. Searched for the API which will provide the required information (open, last close, volume, etc.) - Ended up using Alphavantage.co
  2. Explored on how to use the price graph on React effectively - Ended up using 'react-stockcharts'

  Day 2 (2020 - 10 - 22): 
  3. Started building the application, along with specifying needed pages
  4. Firing requests; parsing them until they become the intended format
  5. Defined localStorage as temporary storage to prevent over-requests, and how to utilize it effectively with the most updated data.
  6. Integrated obtained data with chart; revised chart until it behaves as intended
  7. Basic styling on how the information excluding graph, will present themselves (open, volume, etc.)
  8. Observed how the user WILL interact within the app; fixing loopholes (doing search while main data is loading, multiple search requests with searchbar as it will waste resources)
  9. Basic routing on the Single-page App

  Day 3 (2020 - 10 - 23): 
  10. Multiple manual testing on how will the App behaves
  11. Deployment on Firebase Hosting

# The most challenging part:
  It is my first time doing chart on Front-End - I did learn it ASAP, utilized it as what I intended, but alas there are still some minor error on them (preventDefault errors on DOM)
  And the API for stocks are limited, with reduced speed (Most of the bid/ask requests are for premium memberships)