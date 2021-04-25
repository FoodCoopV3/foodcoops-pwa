import React from "react";
import Button from "react-bootstrap/Button";
import {LagerModal} from "./LagerModal";
import {deepAssign} from "./util";

export function NewProduktModal(props) {
    const [newData, setNewData] = React.useState({});

    const capitalize = word => word.replace(/^\w/, c => c.toUpperCase());
    const getName = (accessor, humanName) => typeof humanName === "string" ? humanName : capitalize(accessor);

    const initial = {
        ...Object.fromEntries([...props.columns, {Header: "Kategorie", accessor: "kategorie"}]
            .map(({Header: humanName, accessor}) => [accessor, {name: getName(accessor, humanName), value: ""}])),
        ...newData
    };

    const close = () => {
        props.close();
        setNewData({});
    };

    const save = () => {
        const result = {};
        for (const [accessor, {value}] of Object.entries(initial)) {
            deepAssign(accessor, result, value);
        }
        for (const [accessor, {value}] of Object.entries(newData)) {
            deepAssign(accessor, result, value);
        }

        const isAnyLagerbestandChanged = Object.entries(result.lagerbestand)
            .filter(([name, value]) => name === "einheit" ? result.lagerbestand.einheit.name !== "" : value !== "")
            .length > 0;
        if (!isAnyLagerbestandChanged) {
            result.lagerbestand = {};
        }

        // FIXME: support setting icon and kategorie (see added TODO items)
        const {icon, kategorie, ...supported} = result;
        props.create(supported);
        close();
    };

    const title = "Produkt erstellen";

    const mapper = ([accessor, {name, value}]) => {
        let edit = <input
                name={name}
                value={value}
                onChange={function ({target: {value}}) {
                    const changed = {};
                    changed[accessor] = {name, value};
                    return setNewData(prev => ({...prev, ...changed}));
                }}/>;

        if (accessor === "icon") {
            edit = <p>TODO: https://github.com/UnderNotic/react-file-load</p>;
        } else if (accessor === "kategorie") {
            edit = <p>TODO: https://github.com/Food-Coop/foodcoops-pwa/commit/0fabfd9953ffd08d4256c70a4a18856d60ae7dee</p>;
        }

        return <tr key={accessor}>
            <td>
                <label style={{margin: 0}}>{name}:</label>
            </td>
            <td>
                {edit}
            </td>
        </tr>;
    };
    const body = Object.entries(initial).map(mapper);

    const footer = <>
        <Button onClick={close}>Änderungen verwerfen</Button>
        <Button onClick={save}>Änderungen übernehmen</Button>
    </>;

    return (
        <LagerModal
            title={title}
            body={body}
            footer={footer}
            show={props.show}
            hide={close}
            parentProps={props}
        />
    );
}
