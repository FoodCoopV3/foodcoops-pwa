import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { useApi } from '../ApiService';
import {useKeycloak} from "@react-keycloak/web";
import { BrotTable } from './BrotTable';
import { deepAssign } from '../util'

export function Brot(){
    const columns = React.useMemo(
        () => [
            {   Header: 'BrotID',
                accessor: 'id'
            },
            {
                Header: 'Brotname',
                accessor: 'name',
            },
            {
                Header: 'Gewicht',
                accessor: 'gewicht',
            },
            {
                Header: 'Preis',
                accessor: 'preis',
            },
            {
                Header: 'Bestellmenge',
                accessor: 'bestellmenge',
            }
        ]
    );

    const [brotBestellung, setBrotBestellung] = React.useState([]);
    const [brotBestellungBetweenDatesProPerson, setBrotBestellungBetweenDatesProPerson] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAlsoLoading, setIsAlsoLoading] = React.useState(true);
    const [isAlsoLoading2, setIsAlsoLoading2] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);
    const [brotBestellungSumme, setBrotBestellungSumme] = React.useState([]);

    const api = useApi();
    const {keycloak} = useKeycloak();

    React.useEffect(
        () => {
            api.readBrotBestellungProProdukt()
                .then((r) => r.json())
                .then((r) => {
                    setBrotBestellungSumme(old => {
                        const n = r?._embedded?.brotBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading(false);
                }
            );
            api.readBrotBestand()
                .then((r) => r.json())
                .then((r) => {
                    setData(old => {
                        let n = r?._embedded?.brotBestandRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsLoading(false);
                }
            );
            let person_id = keycloak.tokenParsed.preferred_username;
            api.readBrotBestellungBetweenDatesProPerson(person_id)
                .then((r) => r.json())
                .then((r) => {
                    setBrotBestellungBetweenDatesProPerson(old => {
                        let n = r?._embedded?.brotBestellungRepresentationList;
                        return n === undefined ? old : n;
                    });
                    setIsAlsoLoading2(false);
                }
            );
            api.readBrotBestellungProPerson(person_id)
                .then(r => r.json())
                .then(r => {
                    setBrotBestellung(old => {
                        const n = r?._embedded?.brotBestellungRepresentationList
                        return n === undefined ? old : n;
                    }
                );
            });
        }, [reducerValue]
    )

    const checkAlreadyOrdered = (brotBestandId) =>{
        for(let j = 0; j < brotBestellung.length; j++){
            if(brotBestandId == brotBestellung[j].brotbestand.id){
                return brotBestellung[j].id;
            }
        }
        return null;
    }

    const getDeadline = (n) => {
        //n = 7 => nächste Deadline, n = 0 => letzte Deadline, n = -7 => vorletzte Deadline, ...
        let datum = new Date();
        var heute = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
        var deadline = new Date(heute.setDate(heute.getDate()-heute.getDay() + n));
        return deadline;
    }

    const submitBestellung = () => {
        const result = {};
        let preis = 0;
        for (let i = 0; i < data.length; i++) {
            let produktId = "ProduktId" + i;
            let brotBestandId = document.getElementById(produktId).innerText;
            let personId = keycloak.tokenParsed.preferred_username;
            let datum = new Date();
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;

            //Check if Bestellmenge is valid
            if (bestellmenge == "") {
            } 
            else {
                const {_links, ...supported} = data[i];
                deepAssign("person_id", result, personId);
                deepAssign("brotbestand", result, supported);
                deepAssign("bestellmenge", result, bestellmenge);
                deepAssign("datum", result, datum);

                //Überprüfe ob bereits eine Bestellung in dieser Woche getätigt wurde
                let check = checkAlreadyOrdered(brotBestandId);
                if(check != null){
                    //Bestellung updaten
                    if (bestellmenge <= 10) {
                        api.updateBrotBestellung(result, check);
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            api.updateBrotBestellung(result, check);
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }

                else{
                    //Neue Bestellung abgeben
                    if (bestellmenge <= 10) {
                        api.createBrotBestellung(result);
                    }
                    else {
                        let artikel = "ProduktName" + i;
                        let artikelname = document.getElementById(artikel).innerText;
                        if(window.confirm("Möchten Sie wirklich " + bestellmenge + " " + artikelname + " bestellen?")){
                            api.createBrotBestellung(result);
                        }
                        else{
                            alert("Okay, dieses Produkt wird nicht bestellt. Alle anderen schon.");
                        }
                    }
                }
                forceUpdate();
            }
        }
        document.getElementById("preis").innerHTML = "Preis: " + preis + "€";
        alert("Ihre Bestellung wurde übermittelt. Vielen Dank!");
    };

    const content = () => {
        if (isLoading || isAlsoLoading || isAlsoLoading2) {
            return (
                <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }

        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < brotBestellungSumme.length; j++){
                if(data[j].id === brotBestellungSumme[j].brotbestand.id){
                    deepAssign("bestellsumme", data[j], brotBestellungSumme[j].bestellmenge);
                }
                else{
                    deepAssign("bestellsumme", data[j], 0);
                } 
            }
            for(let j = 0; j < brotBestellungBetweenDatesProPerson.length; j++){
                if(data[j].id === brotBestellungBetweenDatesProPerson[j].brotbestand.id){
                    deepAssign("bestellmengeAlt", data[j], brotBestellungBetweenDatesProPerson[j].bestellmenge);
                }    
            }
            for(let j = 0; j < brotBestellung.length; j++){
                if(checkAlreadyOrdered(data[j].id)){
                    deepAssign("bestellmengeNeu", data[j], brotBestellung[j].bestellmenge);
                }   
            }
            
        }

        return (
            <BrotTable
                columns={columns}
                data={data}/>
        );
    }

    const deadline = () => {
        let date = getDeadline(7);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        date = "Deadline: " + day + "." + month + "." + year + " 00:00 Uhr";
        return (
            <div>{date}</div>
        );
    }

    return(
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                {deadline()}
                {content()}
                <h4 id = "preis"></h4>
                <Button style={{margin:"0.25rem"}} variant="success" onClick={() => submitBestellung()}>Submit Bestellung</Button>
            </div>
        </div>
    );
}