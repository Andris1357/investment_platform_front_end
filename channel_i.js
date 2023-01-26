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
};

//>>: on other loc website disp => get other 2 icon # code => ˇ {@keyframes} chg <content> to @#code

//TD: buttons when clicked => render a linear gradient that originates fr the point of contact <= the animation starts even if afterwards the mouse is not kept there, but if there is a new contact, the new linear gradient overrides the older one
//the linear gradient changes every unit of time (<sec) by using a new pattern origination point, travelling further fr the init point of contact
//TD: navbar icons {user, mkt} & menu name when hovered over it --> lin grad animation when clicked
//TD: CHART CORRECT WIDTH -> °be half the width of avail. space (sh update /\ resized | opened devtools)
///\: color chart button borders w 4 diff lin grads (example on try page)
//??: @media features
//TD: EDGE-speciic: hover messages shifted (fr where the center starts, how wide is the ::after)
//TD: create a hideen lin grad of {fr bot: darker green --> lighter ~} => depending on where a crt label is, map text color to lin grad where () => {fr top: color at element.top_border.pos.y AS ON hidden ref lin grad layer --> ~ elem.bot_bord ~}
// TD: install Redux --> re-implement {ßuseState}
// ??: dynamize left header height

    // var right_header_cstyle = getComputedStyle(document.getElementsByClassName('header-right')[0])
    // console.log(getComputedStyle(document.getElementsByClassName('header-right')[0]))
    // console.log(right_header_cstyle.height)
    // document.getElementsByClassName('header-left')[0].style.height = (Number(right_header_cstyle.height.slice(0, right_header_cstyle.height.length - 2)) + Number(right_header_cstyle.padding.slice(0, right_header_cstyle.padding.length - 2)) * 2).toString() + "px"
    // console.log(right_header_cstyle.height)
    // var header_height = Number(right_header_cstyle.height.slice(0, right_header_cstyle.height.length - 2)) + Number(right_header_cstyle.padding.slice(0, right_header_cstyle.padding.length - 2)) * 2
    // document.getElementsByClassName('header-left')[0].style.height = header_height.toString() + "px"