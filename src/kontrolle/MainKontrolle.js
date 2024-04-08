import React, {useState} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom/";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Kontrolle } from "./Kontrolle";

export function MainKontrolle(){
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Router>
            <div>
                <Paper squere>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    >
                    <Tab label="Kontronllpanel" component={Link} to="/kontrolle" />
                    </Tabs>
                </Paper>
                <Switch>
                    <Route path="/kontrolle">
                        <Kontrolle />
                    </Route>
                    <Route>
                        <Redirect to="/kontrolle" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}