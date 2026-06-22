import React from "react";
import UnderConstruction from "@/Components/UnderConstruction";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
export default function PESO() {
    return (
        <>
            <PublicHeader activatePage="services" />
            <UnderConstruction
                serviceName="Public Employment Service Office (PESO)"
                description="Connecting Cabuyao residents with job opportunities across the Philippines."
                expectedLaunch="Coming Soon"
            />
            <PublicFooter />
        </>
    );
}
