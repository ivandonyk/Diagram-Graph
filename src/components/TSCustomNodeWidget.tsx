import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { TSCustomNodeModel } from './TSCustomNodeModel';
import PublicIcon from "./PublicIcon";

export interface TSCustomNodeWidgetProps {
	node: TSCustomNodeModel;
	engine: DiagramEngine;
}

export interface TSCustomNodeWidgetState {}

export class TSCustomNodeWidget extends React.Component<TSCustomNodeWidgetProps, TSCustomNodeWidgetState> {
	constructor(props: TSCustomNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="custom-node">
				<PortWidget engine={this.props.engine} port={this.props.node.getPort('in')}>
					<div className="circle-port" />
				</PortWidget>
				<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
					<div className="circle-port" />
				</PortWidget>

				{
					this.props.node.accessLevel === "public" &&
					<PublicIcon/>
				}

				<div className="d-flex">
					{
						this.props.node.resourceType === 'AWS::S3::Bucket' &&
						<img src="/public/bitbucket.svg" className="node-image"/>
					}
					{
						this.props.node.resourceType === 'AWS::Lambda::Function' &&
						<img src="/public/aws.svg" className="node-image"/>
					}
					{
						this.props.node.resourceType === 'AWS::DynamoDB::Table' &&
						<img src="/public/dynamo.svg" className="node-image"/>
					}
					{
						this.props.node.resourceType === 'AWS::ApiGateway::RestApi' &&
						<img src="/public/amazon.svg" className="node-image"/>
					}
					<div>
						<div className="node-label">{this.props.node.resourceType}</div>
						<div className="node-name">{this.props.node.name}</div>
					</div>
				</div>
				<hr className="node-messages-link-hr"/>
				<a onClick={() => this.props.node.onNodeMessagesOpen(this.props.node)} className={`node-messages-link ${this.props.node.resourceType === 'AWS::Lambda::Function' ? 'have-messages' : ''}`}>
					<i className="material-icons">speaker_notes</i>
					Discuss
					{
						this.props.node.resourceType === 'AWS::Lambda::Function' &&
							<span className="ml-1">(5)</span>
					}
				</a>

			</div>
		);
	}
}
