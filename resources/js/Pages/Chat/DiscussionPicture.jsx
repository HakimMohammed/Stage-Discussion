import Avatar from "react-avatar";
import React from "react";

function DiscussionPicture ({ name })
{
    return (
        <Avatar name={name} size="40" round />
    );
};

export default React.memo(DiscussionPicture);