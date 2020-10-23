import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
import { Label } from 'react-stockcharts/lib/annotation'
import { BarSeries, AreaSeries } from 'react-stockcharts/lib/series'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY
} from 'react-stockcharts/lib/coordinates'

import { SingleValueTooltip } from 'react-stockcharts/lib/tooltip'
import { fitWidth } from 'react-stockcharts/lib/helper'
import {
  last,
  createVerticalLinearGradient,
  hexToRGBA
} from 'react-stockcharts/lib/utils'

//required data:
// date: Mon Jan 04 2010 00:00:00 GMT+0700 (Indochina Time)
// open: 25.436282332605284
// high: 25.835021381744056
// low: 25.411360259406774
// close: 25.710416
// volume: 38409100

class AreaChartWithEdge extends Component {
  render() {
    const { type, data: initialData, width, ratio, chartTitle } = this.props
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date
    )
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    )

    const canvasGradient = createVerticalLinearGradient([
      { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
      { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
      { stop: 1, color: hexToRGBA("#4286f4", 0.8) }
    ])

    const margin = { left: 70, right: 70, top: 50, bottom: 30 }
    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 1000)])
    const xExtents = [start, end]
    return (
      <ChartCanvas
        height={350}
        ratio={ratio}
        width={width}
        margin={margin}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        clamp={"both"}
      >

        <Label x={(width - margin.left - margin.right) / 2} y={30}
          fontSize={20} text={chartTitle} />

        <Chart id={1} yExtents={(d) => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <AreaSeries
            yAccessor={(d) => d.close}
            canvasGradient={canvasGradient}
          />

          <SingleValueTooltip
            yLabel="Price"
            yAccessor={(d) => d.close}
            yDisplayFormat={format(".2f")}
            origin={[-40, 0]}
          />
          <SingleValueTooltip
            yLabel="Volume"
            yAccessor={(d) => d.volume}
            origin={[-40, 20]}
          />
        </Chart>
        <Chart
          id={2}
          yExtents={(d) => d.volume}
          height={150}
          origin={(w, h) => [0, h - 150]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
          />

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />

          <BarSeries
            yAccessor={(d) => d.volume}
            stroke={0.1}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
            opacity={0.2}
            widthRatio={1}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    )
  }
}

AreaChartWithEdge.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
}

AreaChartWithEdge.defaultProps = {
  type: "svg"
}
AreaChartWithEdge = fitWidth(AreaChartWithEdge)

export default AreaChartWithEdge
