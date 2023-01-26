// import React from "react"; // #> uncomment this to kill app & show loading screen
import * as Data from "./data.js"
// import {InvestmentDropdown, DisabledTextbox, InfoHoverIcon, CategoryWithInfo} from "./basic_components.jsx"

class RenderedComponent {
    constructor (component_, anchor_element_id_) {
        this.component = component_;
        this.anchor_element_id = anchor_element_id_;
    }
}

function $(x) {
    return document.getElementById(x);
}

function getInvestmentByIdAndChannel(id_, channel_id_) {
    console.log(Data.channels[channel_id_].user_investments.filter(object_ => object_.investment_id == id_)[0])
    return Data.channels[channel_id_].user_investments.filter(object_ => object_.investment_id == id_)[0]
}

function clickVisibilityEventListener(anchor_id_, target_id_, visibility_, useStateCallable_=null) {
    let callable = () => {
        $(target_id_).style.visibility = visibility_ ? "visible" : "hidden"
        if (useStateCallable_ !== null) {
            useStateCallable_();
        }
    };
    $(anchor_id_).addEventListener("click", callable);
}

function hoverUseStateEL(element_id_, useStateCallable_) {
    $(element_id_).addEventListener("mouseenter", () => useStateCallable_(true));
    $(element_id_).addEventListener("mouseleave", () => useStateCallable_(false));
}

function getIconIndex(element) {
    return element.tagName == this; // I: findIndex() takes second opt arg as to be substituted for used func's ßthis ref
} // /\: fix amounts watermark placement in vertical view #> does not occur most of the time

function clickSetColorEventListener(button_id_, edges_, font_, event_) {
    let element = document.getElementById(button_id_);
    let callable = () => {
        element.style.borderColor = edges_;
        element.style.color = font_;
    }
    element.addEventListener(event_ ? "mousedown" : "mouseup", callable);
}

function wrapChartElement(context_, data_, labels_) {
    return new Chart(context_, {
        type: "line",
        data: {
            labels: labels_, //omit labels for part of values, so th they can fit on screen -> about 7-10; how to make a label blank?; will this get updated along w values?
            datasets: [
                { // NOW: insert channel name when reassigning .label
                    label: "Changes in index of [] channel", //mellette info ikon -> "The chart will show index fluctuations over a recent interval, the span of which can be selected on the top right"
                    data: data_, //TD: chg to arr.slice (1d) or other to be default
                    backgroundColor: ["rgba(0,0,0,0.95)"],
                    borderColor: ["rgba(77, 185, 45)"], // I: sets color of points
                    color: ["red"],
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            pointRadius: 0.1,
            borderWidth: 1.5,
            backgroundColor: "rgba(0,0,0,0.95)",
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 8, // I: sets max number of labels
                        autoSkip: true,
                        maxRotation: 90,
                        minRotation: 90,
                    }
                }
            },
            legend: {
                labels: {
                    fontColor: "chartreuse" // /\: this does not work currently
                }
            },
        },
    });
}

function calculateChartData(timeframe_value_, channel_index_) {
    let labels;
    let timeseries = Data.channels[channel_index_].score_timeseries;

    if (timeframe_value_ !== "0") { // I: changes color to reflect chosen status & changes color of all other buttons in the group to default
        switch (timeframe_value_) {
            case "24":
                labels = Data.labels_4_5;
                break;
            case "168":
                labels = Data.labels_3_5;
                break;
            case "720":
                labels = Data.labels_2_3;
                break;
            default:
                labels = Data.labels_1_3; // I: meaning an array of dates where the first 3 largest increments of time are specified, e.g. 2022.01.21.
        } // ??: w real time -> for last 24 hours, get last 24/freq points
    
        return [
            timeseries.slice(
                timeseries.length - Number(timeframe_value_) / Data.index_update_frequency, 
                timeseries.length
            ),
            labels.slice(
                labels.length - Number(timeframe_value_) / Data.index_update_frequency, 
                timeseries.length
            )
        ]
    }

    if (Number(timeframe_value_) > 720) {
        timeseries = timeseries.filter((_, index) => index % 11 === 10)
    }

    labels = Data.labels_1_3;
    return [timeseries, labels]
}

var chart_global;

const ChartComponent = ({timeframe_, channel_index_}) => {
    const chart_ref = React.useRef();
    let [calculated_timeseries, calculated_labels] = calculateChartData(timeframe_, channel_index_);
    
    React.useEffect(() => {
        if (chart_ref.current && !chart_global) {
            const context = chart_ref.current.getContext("2d");
            chart_global = wrapChartElement(
                context,
                calculated_timeseries,
                calculated_labels
            );
        } 
        else if (chart_ref.current && chart_global) {
            chart_global.data.datasets[0].data = calculated_timeseries;
            chart_global.data.labels = calculated_labels;
            chart_global.update();
        }
    }, [chart_ref, timeframe_, calculated_timeseries, calculated_labels])

    return (
        <canvas class="chart" id="index_chart_canvas" ref={chart_ref}></canvas>
    )
}

const ChartArea = () => {
    const [selected_timeframe, selectTimeframe] = React.useState("8760");
    const [selected_channel_index, selectChannel] = React.useState(0);

    $("button-next").addEventListener("click", () => {
		selectChannel(current_index_ => current_index_ < Data.channels.length - 1 ? current_index_ + 1 : current_index_);
	})
    $("button-prev").addEventListener("click", () => {
        selectChannel(current_index_ => current_index_ >= 1 ? current_index_ - 1 : current_index_)
    })
    
    const updateChart = React.useCallback((event_) => { // /\: rewrite value & color checks to hooks
        selectTimeframe(event_.target.value);
        
        if (getComputedStyle(event_.target).color == "rgb(127, 255, 0)") { // I: checks if color is chartreuse
            event_.target.style.color = "rgb(255, 60, 0)";
            event_.target.style.borderColor = "rgb(255, 180, 180) rgb(245, 130, 70) rgb(180, 20, 20) rgb(210, 40, 35)"; //??: do the labels chg respective to the x values shrinking? -> labels do not chg & x-values do not blow up to fill chart
            
            for (let timeframe_button_ of [...document.getElementsByClassName("set_timefr")]) {
                if (timeframe_button_.value == event_.target.value) {
                    continue;
                } else {
                    timeframe_button_.style.color = "rgb(127, 255, 0)"; //chg to deft color (substitute w finally selected deft)
                    timeframe_button_.style.borderColor = "rgb(200, 255, 180) rgb(127, 255, 0) rgb(80, 160, 40) rgb(10, 110, 10)";
                }
            }
        }
    }, []);
    
    return (
        <div class="chart_wrap">
            <ChartComponent timeframe_={selected_timeframe} channel_index_={selected_channel_index}/>
            <div class="chart_navbar">
                <button class="set_timefr" id="tf_d" value="24" onClick={updateChart}>1d</button>
                <button class="set_timefr" id="tf_w" value="168" onClick={updateChart}>1w</button>
                <button class="set_timefr" id="tf_m" value="720" onClick={updateChart}>1m</button>
                <button
                    class="set_timefr"
                    id="tf_y"
                    value="8760"
                    style={Data.chart_button_selected_style}
                    onClick={updateChart}
                >
                    1y
                </button>
                <button class="set_timefr" id="tf_a" value="0" onClick={updateChart}>All</button>
            </div>
        </div>
    )
}

const Table = ({rows_content}) => { // P: @rows_content :: str|num[][]
    if (!Array.isArray(rows_content)) {
        return (
            <table>
                <tr><TableRow cells_data={rows_content}></TableRow></tr>
            </table>
        )
    }
    return (
        <table style={{minHeight: "30px"}}>
            {rows_content.map(row_ => (
                <tr><TableRow cells_data={row_}></TableRow></tr>
            ))}
        </table>
    )
}

const TableRow = ({cells_data}) => {
    if (!Array.isArray(cells_data)) {
        return (
            <td>{cells_data}</td>
        )
    }
    if (cells_data.slice(1,).every(cell_content_ => cell_content_ === "")) {
        return (
            <td colspan={4} style={Data.metric_category_style}>{cells_data[0]}</td>
        )
    }
    return (
        cells_data.map(content_ => (
            <td>{content_}</td>
        ))
    )
}

const InvestmentDetailsTable = () => { // MT: feature to break lock & increase user tokens (displayed on menu ribbon) & invest fr a custom # of tokens where new investments will show up in the dropdown
    const [selected_investment_id, selectInvestment] = React.useState(Data.channels[0].user_investments[0].investment_id);
    const [selected_channel_index, selectChannel] = React.useState(0);
    const [viewed_investment, selectInvestmentObject] = React.useState(getInvestmentByIdAndChannel(
        selected_investment_id, 
        selected_channel_index
    ))

    $("button-next").addEventListener("click", () => {
		selectChannel(current_index_ => current_index_ < Data.channels.length - 1 ? current_index_ + 1 : current_index_);
	})
    $("button-prev").addEventListener("click", () => {
        selectChannel(current_index_ => current_index_ >= 1 ? current_index_ - 1 : current_index_)
    })
    
    React.useEffect(() => {
        selectInvestmentObject(getInvestmentByIdAndChannel(selected_investment_id, selected_channel_index));
    }, [selected_investment_id])

    return (
        <Table rows_content={[
            [
                "Select investment", 
                <InvestmentDropdown 
                    onChange_={event_ => selectInvestment(event_.target.value)} 
                    value_={selected_investment_id}
                    channel_index_={selected_channel_index}
                />
            ],
            [viewed_investment.time_until_lock_expires.label, viewed_investment.time_until_lock_expires.value],
            [viewed_investment.invested_tokens.label, viewed_investment.invested_tokens.value],
            [viewed_investment.current_value.label, viewed_investment.current_value.value],
        ]}/>
    )
}

// TD: page for {user settings & withdraw, buy & sell tokens, channel > withdraw & redeem}; popup for {user login, search among channels}
// TD: menu ribbon > {{user hash, amount of tokens}, icons{other pages}}
const ChannelDetailsTable = () => {
    const [selected_channel_index, selectChannel] = React.useState(0);

    $("button-next").addEventListener("click", () => {
        selectChannel(current_index_ => {
            return current_index_ < Data.channels.length - 1 ? current_index_ + 1 : current_index_
        });
	})
    $("button-prev").addEventListener("click", () => {
        selectChannel(current_index_ => current_index_ >= 1 ? current_index_ - 1 : current_index_)
    }) // !: MAYBE USE ßUSEEFFECT | ~ W ßuseCallback?

    let channel = Data.channels[selected_channel_index];

    React.useEffect(() => {
        const button_prev = $("button-prev");
        const button_next = $("button-next");
        
        if (selected_channel_index == 0) {
            button_prev.disabled = true;
            button_prev.style.color = "black";
        } else {
            button_prev.disabled = false;
            button_prev.style.color = "chartreuse";
        }

        if (selected_channel_index == Data.channels.length - 1) {
            button_next.disabled = true;
            button_next.style.color = "black";
        } else {
            button_next.disabled = false;
            button_next.style.color = "chartreuse";
        }
    }, [selected_channel_index])

    return (
        <div class="channel-container" id={`channel-${selected_channel_index}-container`}>
            <ChannelHeaderArea channel_index_={selected_channel_index}/>
            <p style={{fontSize: "18px"}}><strong>Channel statistics</strong></p>
            <hr />
            <Table rows_content={[
                [
                    React.createElement("label", {for: "stats-score"}, "Platform score"), 
                    <DisabledTextbox element_id_={"stats-score"} value_={channel.score}/>
                ],
                [
                    React.createElement("label", {for: "stats-date"}, "Last updated"), 
                    <DisabledTextbox element_id_={"stats-date"} value_={Data.last_updated}/>
                ]
            ]} style={{fontSize: "13px"}}/>
            <hr />
            <Table rows_content={[
                [" ", "Individual value", "Universe average", "Individual index modifier"], 
                [
                    React.createElement("span", {style: Data.metric_category_style}, "Static metrics"), "", "", ""
                ],
                ...([
                    channel.subscriber_count, 
                    channel.currently_staking
                ].map(metric_ => [
                    metric_.label, metric_.individual_value, metric_.universe_average, metric_.individual_modifier
                ])),
                [
                    <CategoryWithInfo 
                        label_text_={"Dynamic metrics"} 
                        info_id_={1} 
                        info_text_={`The period over which changes are measured is ${Data.current_timeframe}`}
                    />,
                    "", "", ""
                ],
                ...([
                    channel.subscriber_count_change, 
                    channel.views_count_change,
                    channel.uploads_count_change,
                    channel.platform_score_change
                ].map(metric_ => [
                    metric_.label, metric_.individual_value, metric_.universe_average, metric_.individual_modifier
                ])),
            ]}/>
        </div>
    )
}

const InvestmentDropdown = ({onChange_, value_, channel_index_}) => {
    return ( // /\: truncate dropdown width
        <select onChange={onChange_} value={value_}>
            {Data.channels[channel_index_].user_investments.map(investment_ => (
                <option>{investment_.investment_id}</option>
            ))}
        </select>
    )
}

const DisabledTextbox = ({element_id_, value_}) => {
    return (
        <input id={element_id_} type="text" disabled value={value_}></input>
    )
}

const InfoHoverIcon = ({info_id_, info_text_}) => {
    return (
        <span className="info_hover_anchor" id={`info_hover_anchor_${info_id_}`}>
            <i class="fas fa-info-circle"></i>
            <div className="info_hover" id={`info_hover_${info_id_}`}>{info_text_}</div>
        </span>
    )
}

const CategoryWithInfo = ({label_text_, info_id_, info_text_}) => {
    return (
        <nobr><span>
            <span style={Data.metric_category_style}>{label_text_}</span>
            <span style={Data.space_style}></span>
            <InfoHoverIcon info_id_={info_id_} info_text_={info_text_}/>
        </span></nobr>
    )
} // LT: search bar (in popup?) ß channels -> render list of coinciding ones & switch to selected on submit

const ChannelHeaderArea = ({channel_index_}) => { // /\: make img corners slightly opaque to fade into backgr
    return (
        <p style={{margin: "0px"}}>
            <img src={Data.channels[channel_index_].image_source} class="channel_img" />
            <span class="channel_name">    {Data.channels[channel_index_].name}    </span>
            <a href={Data.channels[channel_index_].link}><i class="fas fa-external-link-alt"></i></a>
        </p>
    )
}

const MenuRibbon = ({}) => {
    const [selected_menu, selectMenu] = React.useState() // TD: integrate with Next

    const updateMenuIcons = React.useCallback((event_) => { // /\: rewrite value & color checks to hooks
        selectMenu(event_.target.id);
        
        if (getComputedStyle(event_.target).color == "rgb(127, 255, 0)") { // I: checks if color is chartreuse
            event_.target.style.color = "rgb(255, 60, 0)";
            
            for (let icon_ of [...document.getElementsByName("menu-icon")]) {
                if (icon_.id !== event_.target.id) {
                    icon_.style.color = "rgb(127, 255, 0)"; //chg to deft color (substitute w finally selected deft)
                }
            }
        }
    }, []);

    return (
        <>
            <div class="space"></div>
            <i id="user-settings-menu-icon" class="far fa-user" name="menu-icon" style={Data.menu_icon_style} onClick={updateMenuIcons}></i>
            <i id="investing-menu-icon" class="fas fa-chart-line" name="menu-icon" style={Data.menu_icon_style} onClick={updateMenuIcons}></i>
            <i id="trade-menu-icon" class="fas fa-coins" name="menu-icon" style={Data.menu_icon_style} onClick={updateMenuIcons}></i>
        </>
    )
}

const rendered_components = [
    new RenderedComponent(<InvestmentDetailsTable/>, $('test-table')),
    new RenderedComponent(<ChannelDetailsTable/>, $("static-attributes")),
    new RenderedComponent(<ChartArea/>, $("chart-flexbox")),
    new RenderedComponent(<MenuRibbon/>, $("header-left")),
]

const App = () => {
    const [investments_popup_visibility, investmentsPopupVisible] = React.useState(false);
    const [mouse_over_investments_popup, isMouseOverInvestmentsPopup] = React.useState(undefined);
    const [mouse_over_investments_button, isMouseOverInvestmentsButton] = React.useState(undefined);
    const [stake_popup_visibility, stakePopupVisible] = React.useState(false);
    const [mouse_over_stake_popup, isMouseOverstakePopup] = React.useState(undefined);
    const [mouse_over_stake_button, isMouseOverStakeButton] = React.useState(undefined);
    const [body_clicked, isBodyClicked] = React.useState(false); // ??: refactor some of these w ßuseRef

    const visibility_click_EL_args = [ // TD: most of pg components rendered by React --> refactor elements to always have visibility of related hook var passed in
        ["stake_btn_id", "stake_popup_id", true, () => stakePopupVisible(true)],
        ["stake_btn_id", "investment-list-popup", false, () => investmentsPopupVisible(false)],
        ["stake_exit_btn_id", "stake_popup_id", false, () => stakePopupVisible(false)],
        ["submit_stake", "stake_popup_id", false, () => stakePopupVisible(false)],
        ["investment-list-button", "investment-list-popup", true, () => investmentsPopupVisible(true)],
        ["investment-list-button", "stake_popup_id", false, () => stakePopupVisible(false)],
        ["investments-exit-button", "investment-list-popup", false, () => investmentsPopupVisible(false)],
        ["break-investment", "investment-list-popup", false, () => investmentsPopupVisible(false)],
        ["unlock-investment", "investment-list-popup", false, () => investmentsPopupVisible(false)],
    ]
    const hover_EL_args = [
        ["investment-list-popup", isMouseOverInvestmentsPopup],
        ["investment-list-button", isMouseOverInvestmentsButton],
        ["stake_popup_id", isMouseOverstakePopup],
        ["stake_btn_id", isMouseOverStakeButton],
    ]
    const hover_popup_timeseries = document.getElementsByClassName("info_hover"); // ?: it seems as if centering top hover message would be a cause of an eventlistener added on hover & maybe this is why it only triggers after some time after first contact...

    for (let child of hover_popup_timeseries) {
        let converted_outerHTML_array = [
            ...$(child.id).parentNode.children
        ];
        let icon_index_outerHTML = converted_outerHTML_array.findIndex(getIconIndex, "I"); 
        let temp_width_icon = document
            .getElementById(child.id)
            .parentNode.
            children[icon_index_outerHTML]
            .getBoundingClientRect()["width"];
        let temp_width_popup = child.getBoundingClientRect()["width"];
        let temp_margin = -1 * (temp_width_popup / 2 - temp_width_icon / 2) + "px";
        child.style.setProperty("left", temp_margin);
    } // /\: takes a while before it sets the correct pos.left ß el gen-d by React

    React.useEffect(() => { // I: put listeners invoking ßuseState into empty dependency ßuseEffect so it is only called once (when it updates the state)
        document.body.addEventListener("click", () => {
            isBodyClicked(current_value_ => !current_value_);
        })

        for (let arguments_ of visibility_click_EL_args) {
            clickVisibilityEventListener(...arguments_);
        }
        for (let arguments_ of hover_EL_args) {
            hoverUseStateEL(...arguments_);
        }
    }, [])

    React.useEffect(() => {
        if (investments_popup_visibility === true
            && mouse_over_investments_popup !== true 
            && mouse_over_investments_button !== true) 
        {
            $("investment-list-popup").style.visibility = "hidden";
            investmentsPopupVisible(false);
        }
        if (stake_popup_visibility === true
            && mouse_over_stake_popup !== true
            && mouse_over_stake_button !== true)
        {
            $("stake_popup_id").style.visibility = "hidden"; // TD: refactor this to a React component of a btn & popup
            stakePopupVisible(false);
        }
    }, [body_clicked])
    
    for (let component_ of rendered_components) {
        ReactDOM.render(component_.component, component_.anchor_element_id);
    }
    $("overlay_id").style.setProperty("visibility", "hidden"); // LT: only become hidden /\ both ~ & js script loaded -> component th has custom attr ß storing whether some script loaded (prob ~ bc ~::first)
}

ReactDOM.render(<App/>, $("root"))

const info_timeseries = [...document.getElementsByClassName("info_hover_anchor")];

for (let anchor_i_ = 1; anchor_i_ <= info_timeseries.length; anchor_i_++) {
    $(`info_hover_anchor_${anchor_i_}`).addEventListener("mouseenter", () => {
        $(`info_hover_${anchor_i_}`).style.visibility = "visible";
    });
    $(`info_hover_anchor_${anchor_i_}`).addEventListener("mouseleave", () => {
        $(`info_hover_${anchor_i_}`).style.visibility = "hidden";
    });
}

const buttons_click_change_color = [
    "investment-list-button", 
    "stake_btn_id", 
    "submit_stake",
    "unlock-investment",
    "break-investment",
    "button-next",
    "user-settings-menu-icon",
    "investing-menu-icon",
    "trade-menu-icon",
    ...[...document.getElementsByClassName("set_timefr")].map(element_ => element_.id)
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
    ]
]

for (let args_ of buttons_click_change_color_args) {
    for (let button_id_ of buttons_click_change_color) {
        clickSetColorEventListener(
            button_id_, ...args_
        );
    }    
}