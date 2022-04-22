import React from 'react';

const {createContext, useContext} = React;

const ApiContext = createContext(null);

export const ApiProvider = (props) => {
    const value = {
        createProdukt: props.createProdukt || createProdukt,
        readProdukt: props.readProdukt || readProdukt,
        deleteProdukt: props.deleteProdukt || deleteProdukt,
        updateProdukt: props.updateProdukt || updateProdukt,
        createKategorie: props.createKategorie || createKategorie,
        readKategorie: props.readKategorie || readKategorie,
        deleteKategorie: props.deleteKategorie || deleteKategorie,
        updateKategorie: props.updateKategorie || updateKategorie,
        createEinheit: props.createEinheit || createEinheit,
        readEinheit: props.readEinheit || readEinheit,
        deleteEinheit: props.deleteEinheit || deleteEinheit,
        readFrischBestellung: props.readFrischBestellung || readFrischBestellung,
        readFrischBestellungProProdukt: props.readFrischBestellungProProdukt || readFrischBestellungProProdukt,
        readFrischBestand: props.readFrischBestand || readFrischBestand,
        readFrischBestellungProPerson: props.readFrischBestellungProPerson || readFrischBestellungProPerson,
        createFrischBestellung: props.createFrischBestellung || createFrischBestellung,
        updateFrischBestellung: props.updateFrischBestellung || updateFrischBestellung,
        readFrischBestellungBetweenDatesProPerson: props.readFrischBestellungBetweenDatesProPerson || readFrischBestellungBetweenDatesProPerson
    };

    return (
        <ApiProvider.Provider value={value}>
            {props.children}
        </ApiProvider.Provider>
    );
};

export const useApi = () => {
    return {
        createProdukt,
        readProdukt,
        deleteProdukt,
        updateProdukt,
        createKategorie,
        readKategorie,
        deleteKategorie,
        updateKategorie,
        createEinheit,
        readEinheit,
        deleteEinheit,
        readFrischBestellung,
        readFrischBestellungProProdukt,
        readFrischBestand,
        readFrischBestellungProPerson,
        createFrischBestellung,
        updateFrischBestellung,
        readFrischBestellungBetweenDatesProPerson
    };

    // FIXME: Get services working correctly https://the-guild.dev/blog/injectable-services-in-react
    // return useContext(ApiContext);
};

//const BACKEND_URL = "https://foodcoops-backend.herokuapp.com/";
const BACKEND_URL = "http://localhost:8080/";
const KATEGORIEN = "kategorien/";
const PRODUKTE = "produkte/";
const EINHEITEN = "einheiten/";
const FRISCHBESTELLUNG =  "frischBestellung/";
const DATUM = "datum/"
const MENGE = "menge/"
const FRISCHBESTAND = "frischBestand/";
const PERSON = "person/";

/**
 * https://github.com/Food-Coop/foodcoops-backend#new-produkte
 */
const createProdukt = (data) =>
    fetch(BACKEND_URL + PRODUKTE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });


/**
 * https://github.com/Food-Coop/foodcoops-backend#get-all-produkte
 * https://github.com/Food-Coop/foodcoops-backend#get-one-produkte
 */
const readProdukt = (id = undefined) => id ?
    fetch(BACKEND_URL + PRODUKTE + id) :
    fetch(BACKEND_URL + PRODUKTE);

/**
 * https://github.com/Food-Coop/foodcoops-backend#delete-produkte
 */
const deleteProdukt = (id) =>
    fetch(BACKEND_URL + PRODUKTE + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

/**
 * https://github.com/Food-Coop/foodcoops-backend#update-produkte
 */
const updateProdukt = (id, changedData) =>
    fetch(BACKEND_URL + PRODUKTE + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedData),
    });

/**
 * https://github.com/Food-Coop/foodcoops-backend#new-kategorien
 */
const createKategorie = (name, icon) =>
    fetch(BACKEND_URL + KATEGORIEN, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: "", name, icon}),
    });

/**
 * https://github.com/Food-Coop/foodcoops-backend#get-all-kategorien
 * https://github.com/Food-Coop/foodcoops-backend#get-one-kategorien
 */
const readKategorie = (id = undefined) => id ?
    fetch(BACKEND_URL + KATEGORIEN + id) :
    fetch(BACKEND_URL + KATEGORIEN);
    //alert ("readkat");

/**
 * https://github.com/Food-Coop/foodcoops-backend#delete-kategorien
 */
const deleteKategorie = (id) =>
    fetch(BACKEND_URL + KATEGORIEN + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

/**
 * https://github.com/Food-Coop/foodcoops-backend#update-kategorien
 */
const updateKategorie = (id, name) =>
    fetch(BACKEND_URL + KATEGORIEN + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name}),
    });

/**
 * https://github.com/Food-Coop/foodcoops-backend#get-all-einheiten
 * https://github.com/Food-Coop/foodcoops-backend#get-one-einheiten
 */
const readEinheit = (id = undefined) => id ?
    fetch(BACKEND_URL + EINHEITEN + id) :
    fetch(BACKEND_URL + EINHEITEN);


/**
 * https://github.com/kingr89/Food-Coop-REST-Service#new-einheiten
 */
const createEinheit = (name) =>
    fetch(BACKEND_URL + EINHEITEN, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: null, name}),
    });

/**
 * https://github.com/kingr89/Food-Coop-REST-Service#delete-einheiten
 */
const deleteEinheit = (id) =>
    fetch(BACKEND_URL + EINHEITEN + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

const readFrischBestellung = () => 
    fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM);

const readFrischBestellungProProdukt = () => 
    fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM + MENGE);

const readFrischBestand = (id = undefined) => id ?
    fetch(BACKEND_URL + FRISCHBESTAND + id) :
    fetch(BACKEND_URL + FRISCHBESTAND);

const readFrischBestellungProPerson = (person_id) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG + DATUM + person_id)

const createFrischBestellung = (data) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: "undefined"}),
    });

const updateFrischBestellung = (data, frischBestellungId) =>
    fetch(BACKEND_URL + FRISCHBESTELLUNG + frischBestellungId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, id: frischBestellungId}),
    });

const readFrischBestellungBetweenDatesProPerson = (datum1, datum2, person_id) => {
    fetch(BACKEND_URL + FRISCHBESTELLUNG + datum1 + "/" + datum2 + "/" + person_id)
}