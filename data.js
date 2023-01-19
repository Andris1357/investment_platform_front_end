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
        score_timeseries_,
    ) {
        this.name = name_;
        this.score = score_;
        this.subscriber_count = subscriber_count_;
        this.currently_staking = currently_staking_;
        this.subscriber_count_change = subscriber_count_change_;
        this.views_count_change = views_count_change_;
        this.uploads_count_change = uploads_count_change_;
        this.platform_score_change = platform_score_change_;
        this.score_timeseries = score_timeseries_;
    }
}

function generateRandomTimeseries() {
    let timeseries = [Math.random() * 5]; // LT: only load deft timeseries, make req to db if user wants to view longer timefr
    for (let i = 1; i < 4380; i++) {
        timeseries.push(timeseries[i - 1] + Math.random() * 10 - 5);
    }
    return timeseries.slice(timeseries.length - 4380, timeseries.length);
}

export const investments = [ // LT: sh come from DB
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

export const channels = [
    new Channel(
        "Channel A",
        1.4804627,
        new Metric("Subscriber count", 125318, 279214, "+2.85%"),
        new Metric("Currently staking", 9738, 620, "-10.58%"),
        new Metric("Change in subscriber count", "+0.81%", "+0.28%", "+1.5%"),
        new Metric("Change in count of total views", "+0.91%", "+0.38%", "+4.27%"),
        new Metric("Change in count of uploads", 8, 3.71, "+11.38%"),
        new Metric("Change of platform score", "+8.46%", "-0.67%", "-2.38%"),
        generateRandomTimeseries(),
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
        generateRandomTimeseries(),
    ),
];

export const last_updated = "2021.09.30"; // LT: query fr DB
export const current_timeframe = "1 year"; // TD: ßuseState => have this change b.o. what btn was clicked last

export const metric_category_style = { // !: <span>.padding does not transfer to parent::<td>.padding
    minHeight: "50px", // /\: padding does not work -> try sth else | remove sub-titles
    maxHeight: "50px",
    fontSize: "16px", 
    textDecoration: "underline",
    fontWeight: "bold",
};
export const hover_message_style = {
    position: "absolute", 
    bottom: "125%", 
    left: "-20px"
};
export const space_style = {
    display: "inline-block", 
    width: "10px"
};
export const chart_button_selected_style = {
    color: "rgb(255, 60, 0)", 
    borderColor: "rgb(255, 180, 180) rgb(245, 130, 70) rgb(180, 20, 20) rgb(210, 40, 35)"
}

export const index_update_frequency = 2; // I: every x hours (<1 if more over 1 hour), in future get this value dynamically, based on the current freq

const first_date = Date.now() - 3.1536 * 10 ** 10; //later subst w first recorded date
const labels_full = Array.from(
    {length: 4380}, 
    (_, index) => {
        let date_i = new Date(first_date + index * index_update_frequency * 3.6 * 10 ** 6);
        return "" + date_i.getFullYear() + "-" + (date_i.getMonth() + 1) + "-" + date_i.getDate() + ". " + date_i.getHours() + ":00"; // LT: later switch to datetime of db row
    }
); // I: only shows 7-10 labels in total -> label is null if index %% arr.slice.length/10 != 0
export const labels_1_3 = Array.from(
    labels_full, 
    x => x.substring(0, x.indexOf(" "))
);
export const labels_2_3 = Array.from(
    labels_full, 
    x => x.substring(5, x.indexOf(" "))
);
export const labels_3_5 = Array.from(
    labels_full, 
    x => x.substring(x.substring(0, x.indexOf(" ")).lastIndexOf("-") + 1, x.length)
);
export const labels_4_5 = Array.from(
    labels_full, 
    x => x.substring(x.indexOf(" ") + 1, x.length)
);
export const labels_current = labels_1_3;

