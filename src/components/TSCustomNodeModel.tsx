import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';
import {DefaultNodeModelGenerics} from "@projectstorm/react-diagrams-defaults/src/node/DefaultNodeModel";

export interface TSCustomNodeModelOptions extends BaseModelOptions {
	id?: string;
	color?: string;
	name?: string;
	resourceType?: string;
	accessLevel?: string;
	onNodeMessagesOpen ?: Function
}

export class TSCustomNodeModel extends NodeModel<DefaultNodeModelGenerics> {

	id: string;
	color: string;
	name: string;
	resourceType : string;
	accessLevel : string;
	onNodeMessagesOpen : Function;


	constructor(options: TSCustomNodeModelOptions = {}) {
		super({
			...options,
			type: 'ts-custom-node'
		});
		this.id = options.id || 'empty';
		this.color = options.color || 'red';
		this.name = options.name || 'empty';
		this.resourceType = options.resourceType || 'empty';
		this.accessLevel = options.accessLevel || 'empty';
		this.onNodeMessagesOpen = options.onNodeMessagesOpen;

		// setup an in and out port
		this.addPort(
			new DefaultPortModel({
				in: true,
				name: 'in'
			})
		);
		this.addPort(
			new DefaultPortModel({
				in: false,
				name: 'out'
			})
		);
	}

	serialize() {
		return {
			...super.serialize(),
			id : this.id,
			color: this.color,
			name: this.name,
			resourceType: this.resourceType,
			accessLevel: this.accessLevel,
			onNodeMessagesOpen: this.onNodeMessagesOpen,
		};
	}

	deserialize(event): void {
		super.deserialize(event);
		this.id = event.data.id;
		this.color = event.data.color;
		this.name = event.data.name;
		this.resourceType = event.data.resourceType;
		this.accessLevel = event.data.accessLevel;
		this.onNodeMessagesOpen = event.data.onNodeMessagesOpen;
	}
}
