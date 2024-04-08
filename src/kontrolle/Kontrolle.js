import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Dropdown, ListGroup, Button } from "react-bootstrap";
import "./kontrolle.css";
import { PlusCircle } from "react-bootstrap-icons";
import { DashCircle } from "react-bootstrap-icons";


export function Kontrolle() {
    const foodItems = [
        "Apfel",
        "Apfel mit einem grünen Belag. Ich glaube das ist ein Schimmel.",
        "Banane",
        "Karotte",
        "Tomate",
        "Brokkoli",
        "Spinat",
        "Ei",
        "Huhn",
        "Rindfleisch",
        "Lachs",
        "Reis",
        "Nudeln",
        "Brot",
        "Käse",
        "Joghurt",
        "Milch",
        "Müsli",
        "Erdnussbutter",
        "Honig",
        "Schokolade"
    ];

    // Initialisierung von selections mit einer neuen Eigenschaft für die Einheit
    const initialSelections = Array.from({length: foodItems.length}, (_, index) => ({id: index, selection: null, unit: "Einheit"}));

    const [selections, setSelections] = useState(initialSelections);

    const handleSelection = (itemId, option) => {
        setSelections(prevSelections => {
            return prevSelections.map(selection => {
                if (selection.id === itemId) {
                    return { ...selection, selection: option };
                }
                return selection;
            });
        });
    };

    // Diese Funktion aktualisiert nun die Einheit für das spezifische Lebensmittel
    const handleUnitSelect = (itemId, unit) => {
        setSelections(prevSelections => {
            return prevSelections.map(selection => {
                if (selection.id === itemId) {
                    return { ...selection, unit: unit };
                }
                return selection;
            });
        });
    };

    const listContent = () => {
        return (
            <div className="card-container">
                <Card className="mt-4">
                    <ListGroup>
                        {selections.map((item, index) => (
                            <ListGroup.Item key={item.id} className="custom-list-group-item">
                                <div className="d-flex align-items-center justify-content-between">

                                    {/* Linke Spalte: Name des Elements */}
                                    <div className="left-column">
                                        <div className="long-text">
                                            {foodItems[index]}
                                        </div>
                                    </div>

                                    {/* Rechte Spalte: Buttons, Eingabefeld und Dropdown */}
                                    
                                    <div className="right-column">
                                        {/*Buttons*/}
                                        <Button
                                            variant={item.selection === "option1" ? "success" : "secondary"}
                                            className="mr-2"
                                            style={{width: "120px", height: "40px",}}
                                            onClick={() => {
                                                handleSelection(item.id, item.selection === "option1" ? null : "option1");
                                            }}
                                        >
                                           <PlusCircle /> <span>Zu viel</span>
                                        </Button>
                                        <Button
                                            variant={item.selection === "option2" ? "danger" : "secondary"}
                                            style={{ width: "120px", height: "40px" }}
                                            onClick={() => {
                                                handleSelection(item.id, item.selection === "option2" ? null : "option2");
                                            }}
                                        >
                                           <DashCircle /> <span>Zu wenig</span>
                                        </Button>
                                    
                                        {/*Eingabefeld*/}
                                        <input type="text" style={{width: "90px", height: "40px",marginRight: '10px', marginLeft: '10px'}}/>
                                    
                                        {/*Dropdown*/}
                                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className="dropdown-toggle-custom">
                                                {item.unit}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleUnitSelect(item.id, "Kilogramm")}>Kilogramm</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleUnitSelect(item.id, "Liter")}>Liter</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleUnitSelect(item.id, "Stück")}>Stück</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            </div>
        );
    }

    const submitButton = () => {
        return(
            <div style={{marginTop: "20px"}}>
                <Button variant="success" style={{width: "150px"}}>Submit</Button>
            </div>
        );
    }

    return (
        <div className="Content">
            {listContent()}
            {submitButton()}
        </div>
    );
}