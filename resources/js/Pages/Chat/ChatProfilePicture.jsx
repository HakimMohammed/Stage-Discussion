import Avatar from "react-avatar";
import React from "react";

function ChatProfilePicture({name})
{
    return(
        <Avatar name={name} size="36" round />
    )
}

export default React.memo(ChatProfilePicture);