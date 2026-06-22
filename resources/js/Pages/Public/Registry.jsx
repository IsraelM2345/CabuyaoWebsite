import React from "react";
import UnderConstruction from "@/Components/UnderConstruction";
import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
export default function Registry() {
    return (
        <>
            <PublicHeader activatePage="services" />
            <UnderConstruction
                serviceName="Civil Registry"
                description="Online access to birth certificates, marriage certificates, and other civil registry documents."
                expectedLaunch="Coming Soon"
            />
            <PublicFooter />
        </>
    );
}
