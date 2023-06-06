import Avatar from "react-avatar";
import React from "react";

function UserProfilePicture({ name })
{
    return (
        <Avatar name={name} size="45" round />
    );
};

export default React.memo(UserProfilePicture);
