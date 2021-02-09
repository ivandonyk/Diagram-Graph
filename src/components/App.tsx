import * as React from "react";
import { hot } from "react-hot-loader";

import "./../assets/scss/App.scss";
import Diagram from "./Diagram";
import {TSCustomNodeModel} from "./TSCustomNodeModel";
import MessagesDrawer from "./MessagesDrawer";

interface IAppProps {
}

interface IAppState {
    graphData: any;
    drawerOpened : boolean,
    openedNode : TSCustomNodeModel;
}

class App extends React.Component<IAppProps, IAppState> {

    constructor(props : IAppProps)
    {
        super(props);
        this.state = {
            graphData : null,
            drawerOpened : false,
            openedNode : null
        };

        this.onNodeMessagesOpen = this.onNodeMessagesOpen.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    componentDidMount()
    {
        fetch("public/graph.json").then(response =>
        {
            response.json().then(data =>
            {
                this.setState({graphData : data});
            });
        });
    }

    toggleDrawer (drawerOpened)
    {
        this.setState({ ...this.state, drawerOpened });
    }

    onNodeMessagesOpen (node : TSCustomNodeModel)
    {
        this.setState({ ...this.state, openedNode : node, drawerOpened : true });
    }

    public render()
    {
        const {graphData} = this.state;

        return (
            <React.Fragment key="right">
                <div className="diagram-background">
                    {
                        graphData &&
                        <Diagram graphData={graphData} onNodeMessagesOpen={this.onNodeMessagesOpen}/>
                    }
                </div>

                <MessagesDrawer drawerOpened={this.state.drawerOpened}
                                openedNode={this.state.openedNode} toggleDrawer={this.toggleDrawer}/>

            </React.Fragment>
        );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
