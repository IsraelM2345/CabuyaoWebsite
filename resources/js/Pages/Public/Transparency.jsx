import React from "react";
import UnderConstruction from "../../Components/UnderConstruction";
import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
export default function Transparency() {
    return (
        <>
            <PublicHeader activePage="government" />
            <UnderConstruction
                serviceName="Transparency Seal"
                description="We're preparing the transparency portal to provide you with access to government information and data."
            />
            <PublicFooter />
        </>
    );
}
