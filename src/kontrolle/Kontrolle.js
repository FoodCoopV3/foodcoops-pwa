import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, ListGroup } from "react-bootstrap";
import "./kontrolle.css";


export function Kontrolle(){

    const foodItems = [
        "Apfel",
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

    const initialSelections = Array.from({length: foodItems.length}, (_, index) => ({id: index, selection: null}));

    const [selections, setSelections] = React.useState(initialSelections);

    const handleSelection = (itemId, option) => {
        setSelections(prevSelections  => {
            return prevSelections.map(selection => {
                if (selection.id === itemId) {
                    return{ ...selection, selection: option};
                }
                return selection;
            });
        });
    };

    

    const content = () => {
        return(
            <div style={{display: "flex", justifyContent: "center"}}>
                <Card style={{marginTop: '20px', maxWidth: 'calc(100% - 100px)', width: '100%', height: '1000px', overflowY: selections.length > 10 ? 'scroll' : 'auto' }}>
                    <ListGroup>
                        {selections.map((item, index) => (
                            <ListGroup.Item key={item.id} className="custom-list-group-item">
                                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <div style={{flexBasis: '33.333%', textAlign: "left"}}>
                                        {foodItems[index]}
                                    </div>
                                    <div style={{flexBasis: '33.333%', textAlign: "center"}}>
                                        <button style={{marginRight: "10px", width: "100px", height: "30px", backgroundColor: item.selection === "option1" ? "green" : "gray", color: "white", borderRadius: "8px", border: "none"}} onClick={() => handleSelection(item.id, "option1")}>Zu viel</button>
                                        <button style={{marginRight: "10px", width: "100px", height: "30px", backgroundColor: item.selection === "option2" ? "red" : "gray", color: "white", borderRadius: "8px", border: "none"}} onClick={() => handleSelection(item.id, "option2")}>Zu wenig</button>
                                    </div>
                                    <div style={{flexBasis: '33.333%', textAlign: "right"}}>
                                        <input type="text" style={{maxWidth: '100%'}} />
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            </div>
        );
    }

    return(
        <div>
            {content()}
        </div>
    );
}