import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {LagerTable} from "./LagerTable";
import {EditProduktModal} from "./EditProduktModal";
import {EditKategorieModal} from "./EditKategorieModal";
import { useApi } from './ApiService';

/**
 * Clone an object recursively. Subsequent changes to the original will not be changed in the clone and vice versa.
 * Does not support functions and object cycles (among other things) because it relies on JSON (de)-serialization.
 *
 * @param o original object
 * @returns {any} cloned object
 */
const deepClone = o => JSON.parse(JSON.stringify(o));

/**
 * Assign a value to a key in the target object.
 * Key can be a combination of multiple object keys separated by dots.
 *
 * For example: `merge("a.b.c", {a:{b:{c:false}}}, true)` returns `{a:{b:{c:true}}}`.
 *
 * @param {string} key
 * @param {{}} obj
 * @param {*} value
 * @returns {{}} obj
 */
function deepAssign(key, obj, value) {
    const accessors = key.split('.');
    const accessor = accessors.pop();
    for (const accessor of accessors) {
        obj = obj[accessor];
    }

    obj[accessor] = value;

    return obj;
}

export function Lager() {
    const columns = React.useMemo(
        () => [
            {
                id: 'expander',
                Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
                    <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? 'Icon' : 'Icon'}
              </span>
                ),
                accessor: 'icon',
                Cell: ({cell, row}) => {
                    return row.canExpand ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${row.depth * 2}rem`,
                                }
                            })}
                        >

                <div {
                         ...{
                             style: {
                                 height: "1.5em",
                                 backgroundImage: "url(" + cell.value + ")",
                                 backgroundSize: "contain",
                                 backgroundRepeat: "no-repeat",
                                 backgroundPosition: "center"
                             }
                         }
                     } />
                </span>
                    ) : null;
                }
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Ist Lagerbestand',
                accessor: 'lagerbestand.istLagerbestand',
            },
            {
                Header: 'Soll Lagerbestand',
                accessor: 'lagerbestand.sollLagerbestand',
            },
            {
                Header: 'Einheit',
                accessor: 'lagerbestand.einheit.name',
            },
        ],
        []
    );

    const [data, setData] = React.useState(null);
    const [originalData, setOriginalData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    const api = useApi();

    // TODO: use something like https://github.com/rally25rs/react-use-timeout#useinterval or https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data to update the data
    React.useEffect(
        () =>
            api.readKategorie()
                .then((r) => r.json())
                .then((r) => {
                        setOriginalData(deepClone(r));
                        setData(r._embedded.kategorieRepresentationList);
                    }
                ), []
    )

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowId, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setData(old => {
                const [kategorieId, _, produktId] = rowId.split('').map(parseInt);
                if (produktId === undefined) {
                    deepAssign(columnId, old[kategorieId], value);
                    return deepClone(old);
                }

                // walk the old data object using the accessor of the table columns
                deepAssign(columnId, old[kategorieId].produkte[produktId], value);

                return deepClone(old);
            }
        )
    }

    const persistProdukt = (rowId, patch) => {
        const [kategorieId, _, produktId] = rowId.split('').map(parseInt);
        const {produkte, id: kategorie} = data[kategorieId];
        const produkt = produkte[produktId];
        const changedData = {...deepClone(produkt), kategorie};
        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }

        api.updateProdukt(produkt.id, changedData);
    };

    const persistKategorie = (rowId, patch) => {
        const [kategorieId, _, produktId] = rowId.split('').map(parseInt);
        const kategorie = data[kategorieId];

        const {name} = patch;
        if (name) {
            api.updateKategorie(kategorie.id, name);
        }
    };

    const deleteKategorie = (rowId) => {
        // setSkipPageReset(true)
        setData(old => {
                const [kategorieId, _, produktId] = rowId.split('').map(parseInt);
            const kategorie = old[kategorieId];
            const length = kategorie.produkte.length;
            if (length === 0) {
                    api.deleteKategorie(kategorie.id)
                        .then(console.log, console.log);
                    old.splice(kategorieId, 1);
                    return deepClone(old);
                }

                console.log(`unable to delete: kategorie ${kategorieId} (${kategorie.name}) has ${length} produkte`);

                return old;
            }
        )
    };

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        setSkipPageReset(false)
    }, [data]);

    const [modal, setModal] = React.useState({type: null, state: {}});

    const dispatchModal = (type, cell, row) => {
        let columnId = undefined;
        let rowId = undefined;
        let values = undefined;
        try {
            columnId = cell.column.id
            rowId = row.id;
            values = row.cells;
        } catch (e) {

        }

        let state = {};
        switch (type) {
            case "EditProduktModal":
                state = {
                    rowData: values,
                    rowId
                }
                break;
            case "EditKategorieModal":
                let [rowData] = values.filter(({column}) => column.id === "name");
                state = {
                    value: rowData.value,
                    rowId
                }
                break;
        }

        setModal({
            type, state
        })
    }

    if (data === null) {
        return (
            <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                <LagerTable
                    columns={columns}
                    data={data}
                    updateMyData={updateMyData}
                    skipPageReset={skipPageReset}
                    dispatchModal={dispatchModal}/>
            </div>

            <EditProduktModal
                show={modal.type === "EditProduktModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistProdukt}
                rowId={modal.state.rowId}
                rowData={modal.state.rowData}/>

            <EditKategorieModal
                show={modal.type === "EditKategorieModal"}
                close={() => dispatchModal(null)}
                updateMyData={updateMyData}
                persist={persistKategorie}
                deleteKategorie={deleteKategorie}
                {...modal.state} />
        </div>
    )
}
