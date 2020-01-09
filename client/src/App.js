import React, { Component } from "react";
import BountiesContract from "./contracts/Bounties.json";
import getWeb3 from "./getWeb3";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';


import Row from 'react-bootstrap/Row';


import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


import "./App.css";

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      storageValue: 0,
      contract: undefined,
      bountyAmount: "1",
      bountyData: "Enter Bounty Details",
      bountyDeadline: 1678587903,
      
      account: null,
      web3: null,
      bounties:[]
    }
    this.handleIssueBounty = this.handleIssueBounty.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }
  handleChange(event)
  {
    switch(event.target.name) {
        case "bountyData":
            this.setState({"bountyData": event.target.value})
            break;
        case "bountyDeadline":
            this.setState({"bountyDeadline": event.target.value})
            break;
        case "bountyAmount":
            this.setState({"bountyAmount": event.target.value})
            break;
        default:
            break;
    }
  }


  async handleIssueBounty(event)
  {
    if (typeof this.state.contract !== 'undefined') {
      console.log("Handle Issue Bounty",this.state.account);
      event.preventDefault();
      await this.state.contract.methods.issueBounty(this.state.bountyData,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
      
    }
  }
  

  componentWillMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("Network Id -->",networkId)
      console.log("Bounties Contract: >>",BountiesContract);
      const deployedNetwork = BountiesContract.networks[networkId];
      console.log("Account Addresses->>",accounts);
      console.log("Deployed Network: -->",deployedNetwork);
      if(deployedNetwork){
      const instance = new web3.eth.Contract(
        BountiesContract.abi,
        deployedNetwork.address
      );
      this.setState({contract: instance})
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log(accounts[0]);
      this.setState({ web3:web3, account:accounts[0]
         });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    
    }
    await this.loadBountiesData();
  };
 
  async loadBountiesData(){
    const bountyCount = await this.state.contract.methods.bountyCount().call();
    
    for(var i = 0;i<bountyCount;i++){
      const bounty = await this.state.contract.methods.bounties(i).call()
      this.setState({
        bounties: [...this.state.bounties, bounty]
      })

    }
  }
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    

    // Get the value from the contract to prove it worked.
   

    // Update state with the result.
    
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
         {/* <FormControl */}
        
        <form>
          <div className = "form-group">
            <label >Name</label>
            <input className="form-control" type="text" placeholder = "Please type your name"></input>
          </div>
       </form>
      

       <Form onSubmit={this.handleIssueBounty}>
          <FormGroup
            controlId="fromCreateBounty"
          >
            <FormControl
              componentClass="textarea"
              name="bountyData"
              value={this.state.bountyData}
              placeholder="Enter bounty details"
              onChange={this.handleChange}
            />
           

            <FormControl
              type="text"
              name="bountyDeadline"
              value={this.state.bountyDeadline}
              placeholder="Enter bounty deadline"
              onChange={this.handleChange}
            />
           

            <FormControl
              type="text"
              name="bountyAmount"
              value={this.state.bountyAmount}
              placeholder="Enter bounty amount"
              onChange={this.handleChange}
            />
            
            <Button type="submit">Issue Bounty</Button>
          </FormGroup>
      </Form>
      
        {
          this.state.bounties.map((bounty,key) => {
            return (
              
              <ul className = "list-group" key = {key}>
              
                <li className = "list-group-item">{bounty.data}</li>
               
              </ul>
            )
          }

          )
        }
  
</div>
     
      
    );
  }
}

export default App;
