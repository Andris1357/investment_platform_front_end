// import * as Data from "./data.js";

// class ChartComponent extends React.Component {
//     constructor(html_attributes_) {
//         super(html_attributes_);
//     }

//     getSelectedChannelIndex() {
//         let current_channel_id = [...document.getElementsByClassName("channel-container")][0].id;
//         return current_channel_id[current_channel_id.indexOf("-container") - 1]
//     }
    
//     componentDidMount() {
//         const context = document.getElementById("index_chart_canvas").getContext("2d");

//         let index_chart = new Chart(context, {
//             type: "line",
//             data: {
//                 labels: Data.labels_current, //omit labels for part of values, so th they can fit on screen -> about 7-10; how to make a label blank?; will this get updated along w values?
//                 datasets: [
//                     {
//                         label: "Changes in index of [] channel", //mellette info ikon -> "The chart will show index fluctuations over a recent interval, the span of which can be selected on the top right"
//                         data: Data.channels[this.getSelectedChannelIndex()].score_timeseries, //TD: chg to arr.slice (1d) or other to be default
//                         backgroundColor: ["rgba(0,0,0,0.95)"],
//                         borderColor: ["rgba(255, 99, 132, 1)"],
//                         color: ["rgba(127,255,0,1)"],
//                     },
//                 ],
//             },
//             options: {
//                 maintainAspectRatio: false,
//                 responsive: true,
//                 pointRadius: 0.1,
//                 borderWidth: 1.5,
//                 backgroundColor: "rgba(0,0,0,0.95)",
//                 scales: {
//                     x: {
//                         ticks: {
//                             maxTicksLimit: 8,
//                             autoSkip: true,
//                             maxRotation: 90,
//                             minRotation: 90,
//                         },
//                     },
//                 },
//             },
//         });
//     }
    
//     render () {
//         return <div class="chart_wrap">
//             <canvas class="chart" id="index_chart_canvas"></canvas>
//             <div class="chart_navbar">
//                 <button class="set_timefr" id="tf_d" value="24">1d</button>
//                 <button class="set_timefr" id="tf_w" value="168">1w</button>
//                 <button class="set_timefr" id="tf_m" value="720">1m</button>
//                 <button
//                     class="set_timefr"
//                     id="tf_y"
//                     value="8760"
//                     style="color: rgb(255, 60, 0); border-color: rgb(255, 180, 180) rgb(245, 130, 70) rgb(180, 20, 20) rgb(210, 40, 35)"
//                 >
//                     1y
//                 </button>
//                 <button class="set_timefr" id="tf_a" value="0">All</button>
//             </div>
//         </div>
//     }
// }

// export default ChartComponent;