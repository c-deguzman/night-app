import React from 'react';
import $ from 'jquery';

export default class Navbar extends React.Component {

	constructor (props){
		super(props);

		this.render = this.render.bind(this);
	}

	render() {

		if (this.props.logged_in){
			return (
			<nav className="navbar navbar-default navbar-inverse navbar-static-top">
	      		<div className="container-fluid">
		            <div className="navbar-header">
		              <div className="navbar-header">
		                <a className="navbar-brand" href="/">Photo App Zeta</a>
		            </div>
		            </div>

		            <ul className="nav navbar-nav">
		              <li className="active"><a href="/home">Home</a></li>
		              <li><a href="/add_pic">Add Pic</a></li>
		              <li><a href="/my_pics">My Pictures</a></li>
		            </ul> 
		             
		            <p className="navbar-text"> Signed in as {this.props.user} </p> 
		           
		            <ul className="nav navbar-nav navbar-right">
		            	<li><a href="/profile"><span className="glyphicon glyphicon-user" /> Profile </a></li>
		              	<li><a href="/logout"><span className="glyphicon glyphicon-log-out" /> Logout </a></li>
		            </ul> 
	          	</div>
	        </nav>
			);
		} else {
			return (
			<nav className="navbar navbar-default navbar-inverse navbar-static-top">
	      		<div className="container-fluid">
		            <div className="navbar-header">
		              	<div className="navbar-header">
		                	<a className="navbar-brand" href="/">Photo App Zeta</a>
		            	</div>
		            </div>

		            <ul className="nav navbar-nav">
		              	<li className="active"><a href="/home">Home</a></li>
		            </ul> 
		             
		            <p className="navbar-text"> Not signed in </p> 
		           
		            <ul className="nav navbar-nav navbar-right">
		              	<li><a href="/register"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
              			<li><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
		            </ul> 
	          	</div>
	        </nav>
			);
		}
	}
}
