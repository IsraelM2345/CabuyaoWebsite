import React from "react";
import UnderConstruction from "../../Components/UnderConstruction";
import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

export default function BPLO() {
    return (
        <>
            <PublicHeader activatePage="services" />
            <UnderConstruction
                serviceName="BPLO"
                description="We're setting up the Business Permit and Licensing Office services for your convenience."
            />
            <PublicFooter />
        </>
    );
}
