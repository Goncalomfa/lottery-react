import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3'; //connecting to metamask
import lottery from './lottery.js';//this is the contract already

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }; //it's the same of having the constructor

  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); //where using metamask, we dont have to specify the from
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players});
  }

  onSubmit = async (event) => { //like this we don't need to bind functions, value of "this" will be set to be equal to the component
    event.preventDefault();

    //transactions async await
    const accounts = await web3.eth.getAccounts();

    //making sure that the users are aware that the transaction gets approved by the network
    this.setState({ message: 'Waiting on transaction sucess...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction sucess...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
        This contract is managed by {this.state.manager}. There are currently {this.state.players.length} people entered,
        competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
