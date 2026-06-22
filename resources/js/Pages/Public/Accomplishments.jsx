import React from "react";
import UnderConstruction from "../../Components/UnderConstruction";
import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

export default function Accomplishments() {
    return (
        <>
            <PublicHeader activePage="city" />
            <UnderConstruction
                serviceName="Accomplishments"
                description="We're documenting the achievements and milestones of Cabuyao City to serve you better."
            />
            <PublicFooter />
        </>
    );
}
