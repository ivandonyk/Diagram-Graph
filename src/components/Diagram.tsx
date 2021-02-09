import * as React from "react";
import { hot } from "react-hot-loader";

import createEngine, {
	DefaultLinkModel,
	DefaultNodeModel, DefaultPortModel,
	DiagramModel
} from '@projectstorm/react-diagrams';

import {
	CanvasWidget
} from '@projectstorm/react-canvas-core';
import {TSCustomNodeModel} from "./TSCustomNodeModel";
import TSCustomNodeFactory from "./TSCustomNodeFactory";

interface IDiagramProps {
	graphData : any,
	onNodeMessagesOpen : Function
}

interface IDiagramState {
	engine: any;
}

class Diagram extends React.Component<IDiagramProps, IDiagramState> {

	constructor(props : IDiagramProps)
	{
		super(props);
		this.state = {
			engine : null
		};
	}

	componentDidMount()
	{
		this.renderGraphData();
	}

	public renderGraphData ()
	{
		const data = this.props.graphData;
		const engine = createEngine();
		console.log(JSON.parse(JSON.stringify(data)));

		engine.getNodeFactories().registerFactory(new TSCustomNodeFactory() as any);

		data.nodes = data.nodes.map((nodeData, i) =>
		{
			let node = new TSCustomNodeModel({
				id : nodeData.id,
				name : nodeData.logicalId,
				resourceType : nodeData.resourceType,
				accessLevel : nodeData.accessLevel,
				onNodeMessagesOpen : this.props.onNodeMessagesOpen
			});

			//(node as any).addOutPort('Out');

			return node;
		});


		let links = [],
			nodesOrderIds = [],
			nodesNextSiblings = {},
			nodesIdsWithSiblings = [];

		data.edges.reverse().forEach((edge, i) =>
		{
			const nodeSource = data.nodes.find(node => node.id === edge.source);
			const nodeTarget = data.nodes.find(node => node.id === edge.target);
			const link = new DefaultLinkModel();

			if (nodesNextSiblings[nodeSource.id] === undefined)
			{
				nodesNextSiblings[nodeSource.id] = [];
			}

			nodesNextSiblings[nodeSource.id].push(nodeTarget.id);
			if (nodesNextSiblings[nodeSource.id].length > 1)
			{
				nodesIdsWithSiblings.push(nodeTarget.id);
			}


			link.setSourcePort(nodeSource.getPort('out'));
			link.setTargetPort(nodeTarget.getPort('in'));
			link.addLabel(edge.referenceType);
			links.push(link);

			if (nodesOrderIds.indexOf(nodeSource.id) === -1)
			{
				nodesOrderIds.push(nodeSource.id);
			}

			if (nodesOrderIds.indexOf(nodeTarget.id) === -1)
			{
				nodesOrderIds.push(nodeTarget.id);
			}

		});

		let i = 0;
		let processedNodesIds = [];

		nodesOrderIds.forEach(nodeId =>
		{
			let node = data.nodes.find(node => node.id === nodeId);
			if (processedNodesIds.indexOf(node.id) !== -1)
			{
				return;
			}

			node.setPosition(Math.max(50, 300 * i), 100);
			processedNodesIds.push(node.id);

			if (nodesNextSiblings[nodeId] && nodesNextSiblings[nodeId].length > 1)
			{
				nodesNextSiblings[nodeId].forEach((nextNodeId, j) =>
				{
					let nextNode = data.nodes.find(node => node.id === nextNodeId);
					nextNode.setPosition(300 * (i + 1), 50 + j * 150);
					processedNodesIds.push(nextNode.id);
				});
			}

			i++;
		});

		const model = new DiagramModel();
		/*const node1 = new DefaultNodeModel({
			name: 'Node 1',
			color: 'rgb(0,192,255)',
		});
		node1.setPosition(100, 100);
		let port1 = node1.addOutPort('Out');
		let port2 = node2.addOutPort('Out');
		const link = port1.link<DefaultLinkModel>(port2);
		link.addLabel('Hello World!');
		*/
		model.addAll(...data.nodes, ...links);
		engine.setModel(model);

		this.setState({engine});
	}

	public render() {

		const {engine} = this.state;

		if (!engine)
		{
			return null;
		}

		return <CanvasWidget className="diagram-container" engine={engine} />;
	}
}

declare let module: any;

export default hot(module)(Diagram);
