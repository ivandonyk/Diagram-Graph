import * as React from "react";
import { hot } from "react-hot-loader";
import {Button} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import {TSCustomNodeModel} from "./TSCustomNodeModel";
import { MessageList, Input } from 'react-chat-elements';

export const defaultMessages = [
	{
		position: 'none',
		type: 'text',
		text: 'Hey guys! Can you tell me why we need this block?',
		date: new Date(Date.now() - 1000 * 60 * 8),
		avatar : 'https://html5css.ru/w3images/avatar2.png',
		title : 'John',
		replyButton : true,
		replyClick : () => alert('q'),
		forwardClick : () => alert('q'),
	},
	{
		reply : {
			photoURL: 'https://html5css.ru/w3images/avatar2.png',
			title: 'John',
			titleColor: '#8717ae',
			message: 'Hey guys! Can you tell me why we need this block?'
		},
		position: 'none',
		type: 'text',
		text: "Morning. This is something like middleware between our REST API and Amazon services.",
		date: new Date(Date.now() - 1000 * 60 * 8),
		avatar : 'https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
		title : 'Jack'
	},
	{
		position: 'none',
		type: 'text',
		text: "If you have any questions, ask here",
		date: new Date(Date.now() - 1000 * 60 * 5),
		avatar : 'https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
		title : 'Jack',
		replyButton : true
	},
	{
		position: 'none',
		type: 'text',
		text: "Thanks. I'll check this",
		date: new Date(Date.now() - 1000 * 60 * 4),
		avatar : 'https://html5css.ru/w3images/avatar2.png',
		title : 'John',
		replyButton : true
	},
];

interface IMessagesDrawerProps {
	drawerOpened : boolean;
	openedNode : TSCustomNodeModel;
	toggleDrawer : Function;
}

interface IMessagesDrawerState {
	messages : any;
	newMessage : string;
	showMessages : boolean
}

class MessagesDrawer extends React.Component<IMessagesDrawerProps, IMessagesDrawerState> {

	inputRef : any;
	replyMessage : any;

	constructor(props : IMessagesDrawerProps)
	{
		super(props);
	}

	componentDidMount(): void
	{

	}

	sendMessage ()
	{
		this.setState({
			newMessage : '',
			showMessages : true,
			messages : [...(!this.state.showMessages ? [] : this.state.messages), {
				position: 'none',
				type: 'text',
				text: this.state.newMessage.replace(/\>\>\>.+\<\<\< /, ''),
				date: new Date(Date.now()),
				avatar : 'https://html5css.ru/howto/img_avatar.png',
				title : 'You',
				replyButton : true,
				reply : this.replyMessage ? {
					photoURL: this.replyMessage.avatar,
					title: this.replyMessage.title,
					titleColor: '#8717ae',
					message: this.replyMessage.text
				} : null
			}]
		});

		this.replyMessage = null;
		setTimeout(() => this.inputRef.clear(), 0);
	}

	onReply (el)
	{
		this.replyMessage = el;
		console.log(el);
		this.inputRef.input.value = ">>> " + el.text + " <<< ";
		this.setState({...this.state, newMessage: ">>> " + el.text + " <<< "});
		this.inputRef.input.focus();
	}

	componentWillReceiveProps(nextProps: Readonly<IMessagesDrawerProps>, nextContext: any): void
	{
		if (this.props.drawerOpened === false && nextProps.drawerOpened === true)
		{
			this.onOpen(nextProps);
		}
	}

	onOpen (nextProps)
	{
		let messages = [];
        if (nextProps.openedNode.resourceType === 'AWS::Lambda::Function')
        {
            messages = defaultMessages;
        }

		this.setState({messages, showMessages : nextProps.openedNode.resourceType === 'AWS::Lambda::Function'});
	}

	public render() {

		return <Drawer anchor="right" open={this.props.drawerOpened} onClose={() => this.props.toggleDrawer(false)} >
			<div>
				{
					this.props.openedNode &&
					<div className="d-flex justify-content-between py-3 px-4" style={{background: '#fff', minWidth: 520}}>
						<h2 className="m-0">Discussion</h2>
						<div className="d-flex">
							{
								this.props.openedNode.resourceType === 'AWS::S3::Bucket' &&
								<img src="/public/bitbucket.svg" className="node-image"/>
							}
							{
								this.props.openedNode.resourceType === 'AWS::Lambda::Function' &&
								<img src="/public/aws.svg" className="node-image"/>
							}
							{
								this.props.openedNode.resourceType === 'AWS::DynamoDB::Table' &&
								<img src="/public/dynamo.svg" className="node-image"/>
							}
							{
								this.props.openedNode.resourceType === 'AWS::ApiGateway::RestApi' &&
								<img src="/public/amazon.svg" className="node-image"/>
							}
							<div>
								<div className="node-label">{this.props.openedNode.resourceType}</div>
								<div className="node-name">{this.props.openedNode.name}</div>
							</div>
						</div>
					</div>
				}
				<hr className="m-0"/>

				{
					this.props.openedNode && (this.state.showMessages || this.props.openedNode.resourceType === 'AWS::Lambda::Function') &&
					<div className="px-2 py-3 h-100" style={{position: 'relative'}}>
						<MessageList
							onReplyClick={e => this.onReply(e)}
							className='message-list'
							lockable={true}
							toBottomHeight={'100%'}
							dataSource={this.state.messages} />

					</div>
				}

				{
					this.props.openedNode && this.props.openedNode.resourceType !== 'AWS::Lambda::Function' && !this.state.showMessages &&
					<div className="no-messages">No messages yet. Write first.</div>
				}

				<div className="messages-input" onKeyDown={e => e.stopPropagation()}>
					<Input
						ref={el => this.inputRef = el}
						placeholder="Type here..."
						multiline={false}
						onChange={e => this.setState({...this.state, newMessage : e.target.value})}
						rightButtons={
							<Button onClick={() => this.sendMessage()} title="Send" color="primary">Send</Button>
						}/>
				</div>

			</div>
		</Drawer>;
	}
}

declare let module: any;

export default hot(module)(MessagesDrawer);
