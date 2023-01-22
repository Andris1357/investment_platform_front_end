import * as Data from "./data.js"

export const InvestmentDropdown = ({onChange_, value_}) => {
    return ( // /\: truncate dropdown width
        <select onChange={onChange_} value={value_}>
            {Data.investments.map(investment_ => (
                <option>{investment_.investment_id}</option>
            ))}
        </select>
    )
}

export const DisabledTextbox = ({element_id_, value_}) => {
    return (
        <input id={element_id_} type="text" disabled value={value_}></input>
    )
}

export const InfoHoverIcon = ({info_id_, info_text_}) => {
    return (
        <span className="info_hover_anchor" id={`info_hover_anchor_${info_id_}`}>
            <i class="fas fa-info-circle"></i>
            <div className="info_hover" id={`info_hover_${info_id_}`}>{info_text_}</div>
        </span>
    )
}

export const CategoryWithInfo = ({label_text_, info_id_, info_text_}) => {
    return (
        <nobr><span>
            <span style={Data.metric_category_style}>{label_text_}</span>
            <span style={Data.space_style}></span>
            <InfoHoverIcon info_id_={info_id_} info_text_={info_text_}/>
        </span></nobr>
    )
} // LT: search bar (in popup?) ß channels -> render list of coinciding ones & switch to selected on submit