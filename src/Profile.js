import React from 'react';
import $ from 'jquery';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import Navbar from './Navbar';

export default class FirstNotice extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.handle_submit = this.handle_submit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      result: "n/a",
      error: "",
      error_show: true,
      pics: [],
      user: "",
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg"
    }
  }

  componentDidMount() {
    
    $.ajax({
      type: "POST",
      url: "/get_user",
      contentType: 'application/json'
    }).done((data_user) => {
      this.setState({
        user: data_user
      });
    });
  }

  handle_submit(event){
  	event.preventDefault();

      var disp = event.target.disp.value;

      $.ajax({
        type: "POST",
        url: "/set_disp",
        contentType: 'application/json',
        data: JSON.stringify({displayName: disp})
      }).done((disp_data) => {

      	console.log(disp_data);

        this.setState({
          error_show: true,
          result: disp_data.result,
          error: disp_data.error
        }, () =>
        {
          if (disp_data.result == "success"){
            this.setState({
              user: disp
            })
          }
        }
        );
         
      });
  }
  
  render(){
    return (
      <div>
        <Navbar logged_in={this.state.user !== false} user={this.state.user} curr="profile"/> 

        <div className="centre">
          <div id="notice_box">
            <h1 id="title"> Update Profile </h1>
            <p className="basic">You can update your display name at any time, as many times as you want.</p>
            
            <div className="centre">
              <form className="form-horizontal" onSubmit={this.handle_submit}>
	            <div className="form-group">
	              <label className="control-label col-sm-8" htmlFor="disp">New Display Name:</label>
	              <div className="col-sm-12">
	                <input type="text" className="form-control" id="disp" name="disp" placeholder="Enter new display name" required/>
	              </div>
	            </div>

	            <div className="form-group"> 
	              <div className="col-sm-10">
	                <button type="submit" className="btn btn-warning">Update</button>
	              </div>
	            </div>
	          </form>
        	</div>
          </div>
        </div>

        <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Your display name has been successfully updated."} /> :

      </div>);
  }
}