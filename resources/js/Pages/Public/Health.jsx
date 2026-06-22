import React from "react";
import UnderConstruction from "@/Components/UnderConstruction";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
export default function Health() {
    return (
        <>
            <PublicHeader activatePage="services" />
            <UnderConstruction
                serviceName="Health Services"
                description="Access to city health programs, medical services, and health resources for Cabuyao residents."
                expectedLaunch="Coming Soon"
            />
            <PublicFooter />
        </>
    );
}
