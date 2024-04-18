import React, { useState, useEffect } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { BrotEinkauf } from './BrotEinkauf';
import { FrischEinkauf } from './FrischEinkauf';
import { LagerwareEinkauf } from './LagerwareEinkauf';
import { ZuVielZuWenigEinkauf } from './ZuVielZuWenigEinkauf';
import { useApi } from '../ApiService';
import NumberFormatComponent from '../logic/NumberFormatComponent';
import './MainEinkauf.css';

export function MainEinkauf( { isLarge }) {
  const [totalFrischPrice, setTotalFrischPrice] = useState(0);
  const [totalBrotPrice, setTotalBrotPrice] = useState(0);
  const [totalProduktPrice, setTotalProduktPrice] = useState(0);
  const [totalDiscrepancyPrice, setTotalDiscrepancyPrice] = useState(0);
  const [frisch, setFrisch] = useState([]);
  const [brot, setBrot] = useState([]);
  const [produkt, setProdukt] = useState([]);
  const [discrepancy, setDiscrepancy] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { keycloak } = useKeycloak();
  const api = useApi();
  const [forceUpdate, setForceUpdate] = React.useReducer(x => x+1, 0);

  const zuVielzuWenigTitle = (
      <Typography variant="h6" gutterBottom>Zu Viel-Einkauf 
      </Typography>
  );

  const handleFrischPriceChange = (price) => {
    setTotalFrischPrice(price);
    setDeliveryCost(price * 0.05);
  };

  const handleBrotPriceChange = (price) => {
    setTotalBrotPrice(price);
  };

  const handleProduktPriceChange = (price) => {
    setTotalProduktPrice(price);
  };

  const handleDiscrepancyPriceChange = (price) => {
    setTotalDiscrepancyPrice(price);
  };

  const handleFrisch = (frisch) => {
    setFrisch(frisch);
  };

  const handleBrot = (brot) => {
    setBrot(brot);
  };

  const handleProdukt = (produkt) => {
    setProdukt(produkt);
  };

  const handleDiscrepancy = (discrepancy) => {
    setDiscrepancy(discrepancy);
  };

  useEffect(() => {
    const total = totalFrischPrice + totalBrotPrice + totalProduktPrice + deliveryCost + totalDiscrepancyPrice;
    setTotalPrice(total);
  }, [totalFrischPrice, totalBrotPrice, totalProduktPrice, deliveryCost, totalDiscrepancyPrice]);

  const clearInputFields = () => {
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach((input) => {
      input.value = "";
    });
    setTotalFrischPrice(0);
    setTotalBrotPrice(0);
    setTotalProduktPrice(0);
    setTotalDiscrepancyPrice(0);
    setDeliveryCost(0);
    setTotalPrice(0);
  };

  const submitEinkauf = async () => {
    let person_id = keycloak.tokenParsed.preferred_username;
    let email = keycloak.tokenParsed.email;

    // Lagerware
    let bestandBuyObjects = [];
    for (let i = 0; i < produkt.length; i++) {
      let lagerInputId = "InputfieldLager" + i;
      let einkaufsmenge = document.getElementById(lagerInputId).value;
      if (einkaufsmenge === undefined || einkaufsmenge === '0' || einkaufsmenge === '') {
      } else {
          //to get id of bestandEinkauf
            const newBestandBuyObject = {
                amount: einkaufsmenge,
                bestandEntity: {
                    type: "lager",
                    id: produkt[i].id,
                    kategorie: {
                      id: produkt[i].kategorie.id,
                      mixable: produkt[i].kategorie.mixable,
                      name: produkt[i].kategorie.name
                    },
                    lagerbestand: {
                      einheit: {
                        id: produkt[i].lagerbestand.einheit.id,
                        name: produkt[i].lagerbestand.einheit.name
                      },
                      istLagerbestand: produkt[i].lagerbestand.istLagerbestand,
                      sollLagerbestand: produkt[i].lagerbestand.sollLagerbestand
                    },
                    name: produkt[i].name,
                    preis: produkt[i].preis, 
                    verfuegbarkeit: produkt[i].verfuegbarkeit
                },
            };
            try {
              const response = await api.createBestandBuyObject(newBestandBuyObject);
              const data = await response.json();
              bestandBuyObjects.push(data);
            } catch (error) {
              toast.error("Fehler beim Übermitteln des Einkaufs. Bitte versuchen Sie es erneut.");
            }   
        }
    }

    // Brot
    let bestellungsEinkaufe = [];
    for (let i = 0; i < brot.length; i++) {
      let brotInputId = "InputfieldBrot" + i;
      let einkaufsmenge = document.getElementById(brotInputId).value;
      if (einkaufsmenge === undefined || einkaufsmenge === '0' || einkaufsmenge === '') {
      } else {
          const brotEinkauf = {
              amount: einkaufsmenge,
              bestellung: {
                type: "brot",
                bestellmenge: brot[i].bestellmenge,
                datum: brot[i].datum,
                id: brot[i].id,
                personId: brot[i].personId,
                brotbestand: {
                  type: "brot",
                  gewicht: brot[i].brotbestand.gewicht,
                  id: brot[i].brotbestand.id,
                  name: brot[i].brotbestand.name,
                  preis: brot[i].brotbestand.preis,
                  verfuegbarkeit: brot[i].brotbestand.verfuegbarkeit
                },
              },
            };
            bestellungsEinkaufe.push(brotEinkauf);
        }
    }

    // Frisch
    for (let i = 0; i < frisch.length; i++) {
      let frischInputId = "InputfieldFrisch" + i;
      if (document.getElementById(frischInputId) === null) {
        continue;
      }
      let einkaufsmenge = document.getElementById(frischInputId).value;
      if (einkaufsmenge === undefined || einkaufsmenge === '0' || einkaufsmenge === '') {
      } else {
          const frischEinkauf = {
              amount: einkaufsmenge,
              bestellung: {
                type: "frisch",
                datum: frisch[i].datum,
                bestellmenge: frisch[i].bestellmenge,
                id: frisch[i].id,
                personId: frisch[i].personId,
                done: frisch[i].done,
                frischbestand: {
                  type: "frisch",
                  einheit: {
                    id: frisch[i].frischbestand.einheit.id,
                    name: frisch[i].frischbestand.einheit.name
                  },
                  gebindegroesse: frisch[i].frischbestand.gebindegroesse,
                  herkunftsland: frisch[i].frischbestand.herkunftsland,
                  id: frisch[i].frischbestand.id,
                  kategorie: {
                    id: frisch[i].frischbestand.kategorie.id,
                    name: frisch[i].frischbestand.kategorie.name
                  },
                  name: frisch[i].frischbestand.name,
                  preis: frisch[i].frischbestand.preis,
                  verfuegbarkeit: frisch[i].frischbestand.verfuegbarkeit
                },
              },
            };
            bestellungsEinkaufe.push(frischEinkauf);
        }
    }

    // Zu Viel Zu Wenig
    let discrepancyEinkaufe = [];
    for (let i = 0; i < discrepancy.length; i++) {
      let discrepancyInputId = "InputfieldDiscrepancy" + i;
      let einkaufsmenge = document.getElementById(discrepancyInputId).value;
      if (einkaufsmenge === undefined || einkaufsmenge === '0' || einkaufsmenge === '') {
      } else {
          const discrepancyEinkauf = {
              amount: einkaufsmenge,
              discrepancy: {
                bestand: {
                  type: discrepancy[i].bestand.type,
                  gebindegroesse: discrepancy[i].bestand.gebindegroesse,
                  herkunftsland: discrepancy[i].bestand.herkunftsland,
                  id: discrepancy[i].bestand.id,
                  name: discrepancy[i].bestand.name,
                  preis: discrepancy[i].bestand.preis,
                  verfuegbarkeit: discrepancy[i].bestand.verfuegbarkeit,
                  einheit: {
                    id: discrepancy[i].bestand.einheit.id,
                    name: discrepancy[i].bestand.einheit.name
                  },
                  kategorie: {
                    id: discrepancy[i].bestand.kategorie.id,
                    name: discrepancy[i].bestand.kategorie.name,
                    mixable: discrepancy[i].bestand.kategorie.mixable
                  },
                  },
                gewollteMenge: discrepancy[i].gewollteMenge,
                id: discrepancy[i].id,
                zuBestellendeGebinde: discrepancy[i].zuBestellendeGebinde,
                zuVielzuWenig: discrepancy[i].zuVielzuWenig,
                },
            };
            console.log(discrepancyEinkauf);
            discrepancyEinkaufe.push(discrepancyEinkauf);
        }
    }

    try {
      const einkaufData = {
        //Bestand = Lagerware
        bestandEinkauf: bestandBuyObjects,
        // Bestellung = Brot & Frischware
        bestellungsEinkauf: bestellungsEinkaufe,
        // Zu Viel Einkauf
        tooMuchEinkauf: discrepancyEinkaufe,
        personId: person_id,
      };
      const response = await api.createEinkauf(einkaufData);
      console.log(einkaufData);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Einkauf ID: ", responseData.id); 
        setForceUpdate();
        clearInputFields();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success("Ihr Einkauf wurde übermittelt. Vielen Dank!");
        //TODO: Fehler ausgeben, falls es nicht klappt
        //await api.createEinkaufPdf(responseData.id, email);
      } else {
        toast.error("Fehler beim Übermitteln des Einkaufs. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="main-einkauf">
      <div>
        <Accordion defaultExpanded>
          <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" gutterBottom>Frischwaren-Einkauf</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FrischEinkauf onPriceChange={handleFrischPriceChange} handleFrisch={handleFrisch} forceUpdate={forceUpdate}/>
            {frisch.length === 0 ? (
              "Sie haben letzte Woche keine Frischbestellung getätigt."
            ) : (
              <h5>Frisch-Preis: <NumberFormatComponent value={totalFrischPrice.toFixed(2)} /> €</h5>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary aria-controls="panel1-content" id="panel1-header" expandIcon={<ExpandMoreIcon />}>
            {zuVielzuWenigTitle}
          </AccordionSummary>
          <AccordionDetails>
            <ZuVielZuWenigEinkauf onPriceChange={handleDiscrepancyPriceChange} handleDiscrepancy={handleDiscrepancy} forceUpdate={forceUpdate}/>
            {discrepancy.length === 0 ? (
              "Es gibt diese Woche keine Produkte auf der Zu Viel-Liste."
            ) : (
              <h5>Zu Viel-Preis: <NumberFormatComponent value={totalDiscrepancyPrice.toFixed(2)} /> €</h5>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" gutterBottom>Brot-Einkauf</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BrotEinkauf onPriceChange={handleBrotPriceChange} handleBrot={handleBrot} forceUpdate={forceUpdate}/>
            {brot.length === 0 ? (
              "Sie haben letzte Woche keine Brotbestellung getätigt."
            ) : (
              <h5>Brot-Preis: <NumberFormatComponent value={totalBrotPrice.toFixed(2)} /> €</h5>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" gutterBottom>Lagerware-Einkauf</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <LagerwareEinkauf onPriceChange={handleProduktPriceChange} handleProdukt={handleProdukt} forceUpdate={forceUpdate}/>
            {produkt.length === 0 ? (
              "Es gibt momentan keine Produkte im Lager."
            ) : (
              <h5>Lagerwaren-Preis: <NumberFormatComponent value={totalProduktPrice.toFixed(2)} /> €</h5>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      <div className={isLarge ? 'price-section-large' : 'price-section'}>
        <div className="price-details">
          <div>
            <h4>Frischware:</h4>
            <h4>Zu Viel:</h4>
            <h4>Brot:</h4>
            <h4>Lagerware:</h4>
            <h4>5 % Lieferkosten:</h4>
          </div>
          <div className="total-price">
            <h4><span className={isLarge ? 'price-large' : 'price'}><NumberFormatComponent value={totalFrischPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className={isLarge ? 'price-large' : 'price'}><NumberFormatComponent value={totalDiscrepancyPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className={isLarge ? 'price-large' : 'price'}><NumberFormatComponent value={totalBrotPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className={isLarge ? 'price-large' : 'price'}><NumberFormatComponent value={totalProduktPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
            <h4><span className={isLarge ? 'price-large' : 'price'}><NumberFormatComponent value={deliveryCost.toFixed(2)} /></span> <span className="currency">€</span></h4>
          </div>
        </div>
        <hr className="hr-divider" id="sum-divider" />
        <div className="total-price-section">
          <h4>Insgesamt:</h4>
          <h4><span className={isLarge ? 'price-large' : 'price'}><NumberFormatComponent value={totalPrice.toFixed(2)} /></span> <span className="currency">€</span></h4>
        </div>
        <Button className="confirm-button" variant="success" onClick={submitEinkauf}>
          Einkauf bestätigen	
        </Button>
        <ToastContainer/>
      </div>
    </div>
  );
}
