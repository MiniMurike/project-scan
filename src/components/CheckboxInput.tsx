import React from "react";

function Checkbox({index, stateValue, stateChangeFunc, text, ...props}) {
    return (
        <label>
            <input
                {...props}
                type={"checkbox"}
                checked={stateValue[index - 1]}
                value={index}
                onChange={stateChangeFunc}
            />
            <span>{text}</span>
        </label>
    )
}

export default Checkbox