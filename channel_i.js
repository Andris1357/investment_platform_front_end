//TD: main area borders, chart colors, chart btn color & sides, CORRECT MAIN COLUMN SIZES
//TD: buttons when clicked => render a linear gradient that originates fr the point of contact <= the animation starts even if afterwards the mouse is not kept there, but if there is a new contact, the new linear gradient overrides the older one
//the linear gradient changes every unit of time (<sec) by using a new pattern origination point, travelling further fr the init point of contact
//TD: navbar icons {user, mkt} & menu name when hovered over it --> lin grad animation when clicked
//TD: CHART CORRECT WIDTH -> °be half the width of avail. space (sh update /\ resized | opened devtools)
//TD: chg chart colors
///\: color chart button borders w 4 diff lin grads (example on try page)
//TD: @media features
//TD: EDGE-speciic: hover messages shifted (fr where the center starts, how wide is the ::after)
//TD: create a hideen lin grad of {fr bot: darker green --> lighter ~} => depending on where a crt label is, map text color to lin grad where () => {fr top: color at element.top_border.pos.y AS ON hidden ref lin grad layer --> ~ elem.bot_bord ~}
// TD: install Redux --> re-implement {ßuseState}

function $$(x) {
    return document.getElementById(x);
}

const index_update_frequency = 2; //every x hours (<1 if more over 1 hour), in future get this value dynamically, based on the current freq
var timeseries = [Math.random() * 5]; //only load deft timeseries, make req to db if user wants to view longer timefr
var i = 1;

while (i < 4380) {
    timeseries.push(timeseries[i - 1] + Math.random() * 10 - 5);
    i += 1;
}

const first_date = Date.now() - 3.1536 * 10 ** 10; //later subst w first recorded date
const labels_full = Array.from({ length: 4380 }, (_, index) => {
    var date_i = new Date(first_date + index * index_update_frequency * 3.6 * 10 ** 6);
    return "" + date_i.getFullYear() + "-" + (date_i.getMonth() + 1) + "-" + date_i.getDate() + ". " + date_i.getHours() + ":00"; //later switch to datetime of db row
}); //only show 7-10 labels in total -> label is null if index %% arr.slice.length/10 != 0
const labels_1_3 = Array.from(labels_full, (x) => x.substring(0, x.indexOf(" ")));
//TD rest
const labels_2_3 = Array.from(labels_full, (x) => x.substring(5, x.indexOf(" ")));
const labels_3_5 = Array.from(labels_full, (x) => x.substring(x.substring(0, x.indexOf(" ")).lastIndexOf("-") + 1, x.length));
const labels_4_5 = Array.from(labels_full, (x) => x.substring(x.indexOf(" ") + 1, x.length));
var labels_current = labels_1_3;

const timeseries_y = timeseries.slice(timeseries.length - 4380, timeseries.length);
// const context = $$("index_chart_canvas").getContext("2d");

// var index_chart = new Chart(context, {
//     type: "line",
//     data: {
//         labels: labels_current, //omit labels for part of values, so th they can fit on screen -> about 7-10; how to make a label blank?; will this get updated along w values?
//         datasets: [
//             {
//                 label: "Changes in index of [] channel", //mellette info ikon -> "The chart will show index fluctuations over a recent interval, the span of which can be selected on the top right"
//                 data: timeseries_y, //TD: chg to arr.slice (1d) or other to be default
//                 backgroundColor: ["rgba(0,0,0,0.95)"],
//                 borderColor: ["rgba(255, 99, 132, 1)"],
//                 color: ["rgba(127,255,0,1)"],
//             },
//         ],
//     },
//     options: {
//         maintainAspectRatio: false,
//         responsive: true,
//         pointRadius: 0.1,
//         borderWidth: 1.5,
//         backgroundColor: "rgba(0,0,0,0.95)",
//         scales: {
//             x: {
//                 ticks: {
//                     maxTicksLimit: 8,
//                     autoSkip: true,
//                     maxRotation: 90,
//                     minRotation: 90,
//                 },
//             },
//         },
//     },
// });

window.onload = function () {
    console.log("onload");

    for (let wm of [...document.getElementsByClassName("wm")]) {
        wm.style.left = (
            Number(
                getComputedStyle(wm.parentNode).width.slice(
                    0, 
                    getComputedStyle(wm.parentNode).width.length - 2
                )
            ) - 33
        ).toString() + "px";
    }
    // TD: dynamize left header height
    // var right_header_cstyle = getComputedStyle(document.getElementsByClassName('header-right')[0])
    // console.log(getComputedStyle(document.getElementsByClassName('header-right')[0]))
    // console.log(right_header_cstyle.height)
    // document.getElementsByClassName('header-left')[0].style.height = (Number(right_header_cstyle.height.slice(0, right_header_cstyle.height.length - 2)) + Number(right_header_cstyle.padding.slice(0, right_header_cstyle.padding.length - 2)) * 2).toString() + "px"
    // console.log(right_header_cstyle.height)
    // var header_height = Number(right_header_cstyle.height.slice(0, right_header_cstyle.height.length - 2)) + Number(right_header_cstyle.padding.slice(0, right_header_cstyle.padding.length - 2)) * 2
    // document.getElementsByClassName('header-left')[0].style.height = header_height.toString() + "px"
};

function clickSetColorEventListener(button_id_, edges_, font_, event_) {
    let element = document.getElementById(button_id_);
    let callable = () => {
        element.style.borderColor = edges_;
        element.style.color = font_;
    }
    element.addEventListener(event_ ? "mousedown" : "mouseup", callable);
}

const buttons_click_change_color = [
    "investment-list-button", 
    "stake_btn_id", 
    "submit_stake",
    "unlock-investment",
    "break-investment",
    "button-next",
]
const buttons_click_change_color_args = [
    [
        "rgb(255, 180, 180) rgb(245, 130, 70) rgb(180, 20, 20) rgb(210, 40, 35)",
        "rgb(255, 60, 0)",
        1
    ],
    [
        "rgb(200, 255, 180) rgb(127, 255, 0) rgb(80, 160, 40) rgb(10, 110, 10)",
        "rgb(127, 255, 0)",
        0
    ],
]

for (let args_ of buttons_click_change_color_args) {
    for (let button_id_ of buttons_click_change_color) {
        clickSetColorEventListener(
            button_id_, ...args_
        );
    }    
}

// var timefr_btn_states = [0, 0, 0, 0];

// function f_update_chart_closure(button) {
//     return () => {
//         if (getComputedStyle(button).color == "rgb(127, 255, 0)") {
//             //check if color is rgb[chartr]
//             if (button.value == "0") {
//                 index_chart.data.datasets[0].data = timeseries;
//                 labels_current = labels_1_3;
//                 index_chart.data.labels = labels_current;
//                 //change color to reflect chosen status + change color of all other buttons in the group to deft
//             } else {
//                 labels_current = button.value == "24" || button.value == "168" 
//                     ? labels_4_5 
//                     : button.value == "720" 
//                         ? labels_3_5 
//                         : labels_1_3;
                
//                 switch (button.value) {
//                     case "24":
//                         labels_current = labels_4_5;
//                         break;
//                     case "168":
//                         labels_current = labels_3_5;
//                         break;
//                     case "720":
//                         labels_current = labels_2_3;
//                         break;
//                     default:
//                         labels_current = labels_1_3;
//                 }

//                 index_chart.data.datasets[0].data = timeseries.slice(
//                     timeseries.length - Number(button.value) / index_update_frequency, 
//                     timeseries.length
//                 ); //TD: w real time -> for last 24 hours, get last 24/freq points
//                 index_chart.data.labels = labels_current.slice(
//                     labels_current.length - Number(button.value) / index_update_frequency, 
//                     timeseries.length
//                 );
//             }

//             button.style.color = "rgb(255, 60, 0)";
//             button.style.borderColor = "rgb(255, 180, 180) rgb(245, 130, 70) rgb(180, 20, 20) rgb(210, 40, 35)";
//             //TD: do the labels chg respective to the x values shrinking? -> labels do not chg & x-values do not blow up to fill chart
            
//             for (let tf_btn of [...document.getElementsByClassName("set_timefr")]) {
//                 if (tf_btn.value == button.value) {
//                     continue;
//                 } else {
//                     tf_btn.style.color = "rgb(127, 255, 0)"; //chg to deft color (substitute w finally selected deft)
//                     tf_btn.style.borderColor = "rgb(200, 255, 180) rgb(127, 255, 0) rgb(80, 160, 40) rgb(10, 110, 10)";
//                 }
//             }
//             index_chart.update();
//         }
//     };
// }

// for (let tf_btn2 of [...document.getElementsByClassName("set_timefr")]) {
//     const f_update_chart = f_update_chart_closure(tf_btn2);
//     tf_btn2.addEventListener("click", f_update_chart);
// }
//>>: on other loc website disp => get other 2 icon # code => ˇ {@keyframes} chg <content> to @#code
