// import {useState} from 'react';

class RenderedComponent {
    constructor (component_, anchor_element_id_) {
        this.component = component_;
        this.anchor_element_id = anchor_element_id_;
    }
}

class InvestmentAttribute {
    constructor(label_, value_) {
        this.label = label_;
        this.value = value_;
    }
}

class Investment {
    constructor(investment_id_, time_until_lock_expires_, invested_tokens_, current_value_) {
        this.investment_id = investment_id_;
        this.time_until_lock_expires = time_until_lock_expires_;
        this.invested_tokens = invested_tokens_;
        this.current_value = current_value_;
    }
}

class Metric {
    constructor(label_, individual_value_, universe_average_, individual_modifier_) {
        this.label = label_;
        this.individual_value = individual_value_;
        this.universe_average = universe_average_;
        this.individual_modifier = individual_modifier_;
    }
}

class Channel {
    constructor(
        name_,
        score_, 
        subscriber_count_, 
        currently_staking_, 
        subscriber_count_change_, 
        views_count_change_,
        uploads_count_change_,
        platform_score_change_,
    ) {
        this.name = name_;
        this.score = score_;
        this.subscriber_count = subscriber_count_;
        this.currently_staking = currently_staking_;
        this.subscriber_count_change = subscriber_count_change_;
        this.views_count_change = views_count_change_;
        this.uploads_count_change = uploads_count_change_;
        this.platform_score_change = platform_score_change_;
    }
}

const investments = [ // LT: sh come from DB
    new Investment(
        "0x4b68d3f5e32e051cd9b9d3b3a3c6e7e6f1a1b2c2d3e3f4b5c5d6e7f8",
        new InvestmentAttribute("Time until lock expires", "6d 7h 19m"),
        new InvestmentAttribute("Invested tokens", 335927),
        new InvestmentAttribute("Current value", 482934)
    ),
    new Investment (
        "0x9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9a8b7c6d5e4f3g2h1i9",
        new InvestmentAttribute("Time until lock expires", "2mo 16d 23h 08m"),
        new InvestmentAttribute("Invested tokens", 20734),
        new InvestmentAttribute("Current value", 17836)
    ),
];

const channels = [
    new Channel(
        "Channel A",
        1.4804627,
        new Metric("Subscriber count", 125318, 279214, "+2.85%"),
        new Metric("Currently staking", 9738, 620, "-10.58%"),
        new Metric("Change in subscriber count", "+0.81%", "+0.28%", "+1.5%"),
        new Metric("Change in count of total views", "+0.91%", "+0.38%", "+4.27%"),
        new Metric("Change in count of uploads", 8, 3.71, "+11.38%"),
        new Metric("Change of platform score", "+8.46%", "-0.67%", "-2.38%"),
    ),
    new Channel(
        "Channel B",
        1.8936851,
        new Metric("Subscriber count", 66389, 279214, "+2.85%"),
        new Metric("Currently staking", 148, 620, "+0.59%"),
        new Metric("Change in subscriber count", "+20.53%%", "+0.28%", "+46.4%"),
        new Metric("Change in count of total views", "+0.91%", "+0.38%", "+4.27%"),
        new Metric("Change in count of uploads", 17, 3.71, "+14.95%"),
        new Metric("Change of platform score", "+22.7%", "-0.67%", "-13.64%"),
    ),
];

const last_updated = "2021.09.30"; // LT: query fr DB
let current_timeframe = "1 year"; // TD: ßuseState => have this change b.o. what btn was clicked last

const metric_category_style = { // !: <span>.padding does not transfer to parent::<td>.padding
    minHeight: "50px", // /\: padding does not work -> try sth else | remove sub-titles
    maxHeight: "50px",
    fontSize: "16px", 
    textDecoration: "underline",
    fontWeight: "bold",
};
const hover_message_style = {position: "absolute", bottom: "125%", left: "-20px"};
const space_style = {display: "inline-block", width: "10px"};

function getInvestmentById(id_) {
    return investments.filter(object_ => object_.investment_id == id_)[0]
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
            <td colspan={4} style={metric_category_style}>{cells_data[0]}</td>
        )
    }
    return (
        cells_data.map(content_ => (
            <td>{content_}</td>
        ))
    )
}

const InvestmentDetailsTable = () => {
    const [selected_investment_id, selectInvestment] = React.useState(investments[0].investment_id);
    let investment = getInvestmentById(selected_investment_id);
    
    return (
        <Table rows_content={[
            [
                "Select investment", 
                <InvestmentDropdown onChange_={
                    event_ => selectInvestment(event_.target.value)
                } value_={selected_investment_id}/>
            ],
            [investment.time_until_lock_expires.label, investment.time_until_lock_expires.value],
            [investment.invested_tokens.label, investment.invested_tokens.value],
            [investment.current_value.label, investment.current_value.value],
        ]}/>
    )
}

const ChannelDetailsTable = ({}) => {
    const [selected_channel_index, selectChannel] = React.useState(0);
    document.getElementById("button-next").addEventListener("click", () => {
		selectChannel(current_index_ => current_index_ < channels.length - 1 ? current_index_ + 1 : current_index_);
	})
    document.getElementById("button-prev").addEventListener("click", () => {
        selectChannel(current_index_ => current_index_ >= 1 ? current_index_ - 1 : current_index_)
    })
    let channel = channels[selected_channel_index];

    return (
        <div>
            <p style={{fontSize: "18px"}}><strong>Channel statistics</strong></p>
            <hr />
            <Table rows_content={[
                [
                    React.createElement("label", {for: "stats-score"}, "Platform score"), 
                    <DisabledTextbox element_id_={"stats-score"} value_={channel.score}/>
                ],
                [
                    React.createElement("label", {for: "stats-date"}, "Last updated"), 
                    <DisabledTextbox element_id_={"stats-date"} value_={last_updated}/>
                ]
            ]} style={{fontSize: "13px"}}/>
            <hr />
            <Table rows_content={[
                [" ", "Individual value", "Universe average", "Individual index modifier"], 
                [
                    React.createElement("span", {style: metric_category_style}, "Static metrics"), "", "", ""
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
                        info_text_={`The period over which changes are measured is ${current_timeframe}`}
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

const InvestmentDropdown = ({onChange_, value_}) => {
    return ( // /\: truncate dropdown width
        <select onChange={onChange_} value={value_}>
            {investments.map(investment_ => (
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
            <span style={metric_category_style}>{label_text_}</span>
            <span style={space_style}></span>
            <InfoHoverIcon info_id_={info_id_} info_text_={info_text_}/>
        </span></nobr>
    )
}

function clickVisibilityEventListener(anchor_id_, target_id_, visibility_, useStateCallable_=null) {
    let callable = () => {
        document.getElementById(target_id_).style.visibility = visibility_ ? "visible" : "hidden"
        if (useStateCallable_ !== null) {
            useStateCallable_();
        }
    };
    document.getElementById(anchor_id_).addEventListener("click", callable);
}

function hoverUseStateEL(element_id_, useStateCallable_) {
    document.getElementById(element_id_).addEventListener("mouseenter", () => useStateCallable_(true));
    document.getElementById(element_id_).addEventListener("mouseleave", () => useStateCallable_(false));
}

function getIconIndex(element) {
    return element.tagName == this; //findIndex takes second opt arg as to be substituted for used func's ßthis ref
}
// LT: search bar (in popup?) ß channels -> render list of coinciding ones & switch to selected on submit

const App = () => {
    const [investments_popup_visibility, investmentsPopupVisible] = React.useState(false);
    const [mouse_over_investments_popup, isMouseOverInvestmentsPopup] = React.useState(undefined);
    const [mouse_over_investments_button, isMouseOverInvestmentsButton] = React.useState(undefined);
    const [stake_popup_visibility, stakePopupVisible] = React.useState(false);
    const [mouse_over_stake_popup, isMouseOverstakePopup] = React.useState(undefined);
    const [mouse_over_stake_button, isMouseOverStakeButton] = React.useState(undefined);
    const [body_clicked, isBodyClicked] = React.useState(false); // /\: refactor some of these w ßuseRef

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
    const hover_popup_timeseries = document.getElementsByClassName("info_hover");

    for (let child of hover_popup_timeseries) {
        let converted_outerHTML_array = [
            ...document.getElementById(child.id).parentNode.children
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
            document.getElementById("investment-list-popup").style.visibility = "hidden";
            investmentsPopupVisible(false);
        }
        if (stake_popup_visibility === true
            && mouse_over_stake_popup !== true
            && mouse_over_stake_button !== true)
        {
            document.getElementById("stake_popup_id").style.visibility = "hidden"; // TD: refactor this to a React component of a btn & popup
            stakePopupVisible(false);
        }
    }, [body_clicked])
    
    document.getElementById("overlay_id").style.setProperty("visibility", "hidden"); // LT: only become hidden /\ both ~ & js script loaded -> component th has custom attr ß storing whether some script loaded (prob ~ bc ~::first)
}
// TD: <PRIORITY> randomize a time series ß universe average -> change table::$channel <= ?timefr sel-d
    // - create chart component in React
    // - pass current channel timeseries on re-render <= const in scope°°App()
const rendered_components = [
    new RenderedComponent(
        <InvestmentDetailsTable/>,
        document.getElementById('test-table')
    ),
    new RenderedComponent(
        <App/>,
        document.getElementById("root")
    ),
    new RenderedComponent(
        <ChannelDetailsTable/>,
        document.getElementById("static-attributes")
    ),
]

for (let component_ of rendered_components) {
    ReactDOM.render(component_.component, component_.anchor_element_id);
}

const info_timeseries = [...document.getElementsByClassName("info_hover_anchor")];

for (let anchor_i_ = 1; anchor_i_ <= info_timeseries.length; anchor_i_++) {
    document.getElementById(`info_hover_anchor_${anchor_i_}`).addEventListener("mouseenter", () => {
        document.getElementById(`info_hover_${anchor_i_}`).style.visibility = "visible";
    });
    document.getElementById(`info_hover_anchor_${anchor_i_}`).addEventListener("mouseleave", () => {
        document.getElementById(`info_hover_${anchor_i_}`).style.visibility = "hidden";
    }); console.log(`attached to ${anchor_i_}`)
}