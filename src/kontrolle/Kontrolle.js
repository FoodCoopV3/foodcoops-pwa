import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import "jspdf-autotable"
import React, { useEffect, useState } from "react";
import { Button, Table } from 'react-bootstrap';
import { useApi } from '../ApiService';
import "./kontrolle.css";
import { green, red } from '@mui/material/colors';


export function Kontrolle() {
    const [discrepancyList, getDiscrepancyList] = useState([]);
    const api = useApi();

    useEffect(() => {
      const fetchDiscrepancyList = async () => {
        try {
          const response = await api.readBestellUebersicht();
          const data = await response.json();
          if (data && data.discrepancy) {
            getDiscrepancyList(data.discrepancy);
            console.log(data.discrepancy);
          } else {
            getDiscrepancyList([]);
            console.log(data.discrepancy);
          }
        } catch (error) {
          console.error('Error getting frischBestellung')
        }
      };

      fetchDiscrepancyList();
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

        const zuViellieferung = discrepancyList.filter(items => items.zuVielzuWenig > 0);
        const zuWeniglieferung = discrepancyList.filter(items => items.zuVielzuWenig < 0);

        const generatePDF = () => {
            const doc = new jsPDF();

            doc.setFontSize(16); // Größe der Schriftart setzen
            doc.setFont("helvetica", "bold"); // Schriftart und Stil setzen (fett)
            doc.text("Liste der zu viel und zu wenig gelieferten Lebensmittel", 10, 10);
            
            const columnNames = ["Produktbezeichnung", "Menge", "Einheit"];

            if (zuViellieferung.length > 0) {
              doc.setFontSize(10); // Größe der Schriftart setze
              doc.text("Zu viel geliefert:", 10, 20);
              const zuViellieferungRows = zuViellieferung.map(item => [item.bestand.name, item.zuVielzuWenig, item.bestand.einheit.name]);
              doc.autoTable({
                head: [columnNames],
                body: zuViellieferungRows,
                startY: 30
              })
            }
            
            if(zuWeniglieferung.length > 0){
              const startY = zuViellieferung.length > 0 ? doc.lastAutoTable.finalY + 10 : 30;
              doc.setFontSize(10); // Größe der Schriftart setze
              doc.text("Zu wenig geliefert:", 10, startY - 10);
              const zuWeniglieferungRows = zuWeniglieferung.map(item => [item.bestand.name, Math.abs(item.zuVielzuWenig), item.bestand.einheit.name]);
              doc.autoTable({
                head: [columnNames],
                body: zuWeniglieferungRows,
                startY: startY
              });
            }
            
            doc.save("Lebensmittel_Liste.pdf");
        };

        return (
            <div className="main-einkauf">
                <Accordion defaultExpanded>
                    <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" gutterBottom><AddBoxIcon sx={{color: green[500]}}/> Zu viel geliefert</Typography>
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
                          {zuViellieferung.map((item, index) => (
                            <tr>
                              <td>{item.bestand.name}</td>
                              <td>{Math.abs(item.zuVielzuWenig)}</td>
                              <td>{item.bestand.einheit.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" gutterBottom><IndeterminateCheckBoxIcon sx={{color: red[500]}}/> Zu wenig geliefert</Typography>
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
                                <td>{item.bestand.name}</td>
                                <td>{Math.abs(item.zuVielzuWenig)}</td>
                                <td>{item.bestand.einheit.name}</td>
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