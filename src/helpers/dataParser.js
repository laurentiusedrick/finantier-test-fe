import { timeParse } from "d3-time-format";

// function parseData(parse) {
//   return function (d) {
//     d.date = parse(d.date);
//     d.open = +d.open;
//     d.high = +d.high;
//     d.low = +d.low;
//     d.close = +d.close;
//     d.volume = +d.volume;
//     return d;
//   };
// }

// const parseDate = timeParse("%Y-%m-%d %H:%M:%S");

export function parseData(intervalObj) {
  const result = []
  for (const key in intervalObj) {
    if (key.includes(new Date()))
    let info = {}
  }
  return 
}
