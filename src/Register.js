import React from 'react';
import $ from "jquery";
import Alert from './Alert';
import Navbar from './Navbar';


export default class Register extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.handle_submit = this.handle_submit.bind(this);
    
    this.state = {
      status: "Not Sent",
      error_show: true
    }
  }
  
  handle_submit(event) {
    
    event.preventDefault();
    
    var user = event.target.user.value;
    var pass = event.target.pass.value;
    
    var send_data = {user: user, pass: pass};
    
    var request = $.ajax({
      type: "POST",
      url: "/register",
      contentType: 'application/json',
      data: JSON.stringify(send_data),
    });
    
    request.done((data) => {
        
        if (data.result == "error"){
          this.setState({
            status: data.result,
            error: data.error,
            error_show: true
          });
        } else {
          this.setState({
            status: data.result,
            error_show: true
          }, () =>{
            document.getElementById("register_form").reset();
            window.location.assign("/login");
          });
        }
      });
  }
  
  render() {
    return (
      <div>
        <Navbar logged_in={false} curr="register"/>

        <h1 className="centre">Register</h1>
        
        <div className="centre">
          <form className="form-horizontal" onSubmit={this.handle_submit} id="register_form">
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="email">Email*:</label>
              <div className="col-sm-12">
                <input type="email" className="form-control" id="email" name="email" placeholder="Enter email (optional)" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="user">Username:</label>
              <div className="col-sm-12">
                <input type="text" className="form-control" id="user" name="user" placeholder="Enter username"  pattern="^[a-z0-9_-]{3,15}$" required/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
              <div className="col-sm-12"> 
                <input type="password" className="form-control" id="pwd" name="pass" placeholder="Enter password" required />
              </div>
            </div>

            <div className="form-group"> 
              <div className="col-sm-10">
                <button type="submit" className="btn btn-default">Register</button>
              </div>
            </div>
          </form>
        </div>
      
        <div  id="email_notice">
            <p className="centre"> Username must be 3 - 15 characters. Only lowercase alphanumeric, hyphens, and dashes are allowed.</p>
            <p className="centre"> * Currently email is not used for anything. </p>  
      </div>


      <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.status} error={this.state.error} success={"Account created successfully. Redirecting you to login."} />
    </div>
    );
  }
}