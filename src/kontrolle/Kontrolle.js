import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import { deepAssign } from "../util";
import { useApi } from "../ApiService";
import { useKeycloak } from "@react-keycloak/web";
import { Card } from "react-bootstrap";

export function Kontrolle(){

    const content = () => {
        return(
            <div>
                <dic>
                TODO: "Zu viel / Zu wenig Liste implementieren"
                </dic>
            </div>
        );
    }

    return(
        <div>
            {content()}
        </div>
    );
}