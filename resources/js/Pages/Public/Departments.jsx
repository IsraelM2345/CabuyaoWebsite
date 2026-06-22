import React from "react";
import UnderConstruction from "../../Components/UnderConstruction";
import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
export default function Departments() {
    return (
        <>
            <PublicHeader activePage="government" />
            <UnderConstruction
                serviceName="Departments"
                description="We're organizing the city departments directory to help you connect with the right office."
            />
            <PublicFooter />
        </>
    );
}
