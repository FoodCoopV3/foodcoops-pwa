import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from "react";
import { Button, Table } from 'react-bootstrap';
import { useApi } from '../ApiService';
import "./kontrolle.css";


export function Kontrolle() {
    const [frischBestellung, getFrischBestellung] = useState([]);
    const api = useApi();

    useEffect(() => {
      const fetchFrischBestellung = async () => {
        try {
          const response = await api.readFrischBestellung();
          const data = await response.json();
          if (data && data._embedded && data._embedded.frischBestellungRepresentationList) {
            getFrischBestellung(data._embedded.frischBestellungRepresentationList);
            console.log(frischBestellung);
          } else {
              getFrischBestellung([]);
              console.log(frischBestellung);
          }
        } catch (error) {
          console.error('Error getting frischBestellung')
        }
      };

      fetchFrischBestellung();
    }, []);

    const foodItems = [
        {
          "Name": "Apfel",
          "Einheit": "Kg",
          "Differenz": 2,
          "Status": "ZW"
        },
        {
          "Name": "Apfel mit einem grünen Belag. Ich glaube das ist ein Schimmel.",
          "Einheit": "Kg",
          "Differenz": 0,
          "Status": "OK"
        },
        {
          "Name": "Banane",
          "Einheit": "Stück",
          "Differenz": 10,
          "Status": "ZV"
        },
        {
          "Name": "Karotte",
          "Einheit": "Kg",
          "Differenz": 5,
          "Status": "ZW"
        },
        {
          "Name": "Tomate",
          "Einheit": "Stück",
          "Differenz": 3,
          "Status": "ZW"
        },
        {
          "Name": "Brokkoli",
          "Einheit": "Stück",
          "Differenz": 8,
          "Status": "ZV"
        },
        {
          "Name": "Spinat",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "ZW"
        },
        {
          "Name": "Ei",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "ZV"
        },
        {
          "Name": "Huhn",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "OK"
        },
        {
          "Name": "Rindfleisch",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "ZV"
        },
        {
          "Name": "Lachs",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "ZW"
        },
        {
          "Name": "Reis",
          "Einheit": "Gramm",
          "Differenz": 0,
          "Status": "ZW"
        },
        {
          "Name": "Nudeln",
          "Einheit": "Gramm",
          "Differenz": 0,
          "Status": "ZW"
        },
        {
          "Name": "Brot",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "ZV"
        },
        {
          "Name": "Käse",
          "Einheit": "Gramm",
          "Differenz": 0,
          "Status": "OK"
        },
        {
          "Name": "Joghurt",
          "Einheit": "Stück",
          "Differenz": 0,
          "Status": "OK"
        },
        {
          "Name": "Milch",
          "Einheit": "Liter",
          "Differenz": 19,
          "Status": "ZW"
        },
        {
          "Name": "Müsli",
          "Einheit": "Gramm",
          "Differenz": 500,
          "Status": "ZV"
        },
        {
          "Name": "Erdnussbutter",
          "Einheit": "Gramm",
          "Differenz": 0,
          "Status": "OK"
        },
        {
          "Name": "Honig",
          "Einheit": "Gramm",
          "Differenz": 10,
          "Status": "ZW"
        },
        {
          "Name": "Schokolade",
          "Einheit": "Gramm",
          "Differenz": 9,
          "Status": "ZV"
        }
    ];

    const listContent = () => {
        const zuViellieferung = foodItems.filter(items => items.Status === "ZV");
        const zuWeniglieferung = foodItems.filter(items => items.Status === "ZW");

        const generatePDF = () => {
            const doc = new jsPDF();
            doc.text("Liste der zu viel und zu wenig gelieferten Lebensmittel", 10, 10);
            
            doc.text("Zu viel geliefert:", 10, 20);
            zuViellieferung.forEach((item, index) => {
            doc.text(`${item.Name} - ${item.Differenz} ${item.Einheit}`, 10, 30 + index * 10);
            });

            doc.text("Zu wenig geliefert:", 10, zuViellieferung.length > 0 ? 30 + zuViellieferung.length * 10 : 20);
            zuWeniglieferung.forEach((item, index) => {
            doc.text(`${item.Name} - ${item.Differenz} ${item.Einheit}`, 10, (zuViellieferung.length > 0 ? 40 : 30) + zuViellieferung.length * 10 + index * 10);
            });

            doc.save("Lebensmittel_Liste.pdf");
        };


        return (
            <div className="main-einkauf">
                <Accordion defaultExpanded>
                    <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" gutterBottom>Zu viel geliefert</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {frischBestellung.map((order, index) => (
                        <tr key={order.id}>
                          <td>
                            {order.id}
                          </td>
                          <td>
                            {order.bestellmenge}
                          </td>
                        </tr>
                      ))}
                      <Table>
                        <thead>
                        <tr>
                          <th>Produkt</th>
                          <th>Menge</th>
                          <th>Einheit</th>
                        </tr>
                        </thead>
                        <tbody>
                          {zuViellieferung.map((item, index) => (
                            <tr>
                              <td>{item.Name}</td>
                              <td>{item.Differenz}</td>
                              <td>{item.Einheit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" gutterBottom>Zu wenig geliefert</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table>
                          <thead>
                          <tr>
                            <th>Produkt</th>
                            <th>Menge</th>
                            <th>Einheit</th>
                          </tr>
                          </thead>
                          <tbody>
                            {zuWeniglieferung.map((item, index) => (
                              <tr>
                                <td>{item.Name}</td>
                                <td>{item.Differenz}</td>
                                <td>{item.Einheit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                    </AccordionDetails>
                </Accordion>

                <div style={{marginTop: "20px"}}>
                <Button onClick={generatePDF} variant="success" style={{width: "150px"}}>Als PDF herunterladen</Button>
                </div>

            </div>
        );
    }

    return (
        <div className="Content">
            {listContent()}
        </div>
    );
}