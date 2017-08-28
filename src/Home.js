import React from 'react';
import $ from 'jquery';
import Navbar from './Navbar';
import Alert from './Alert';
import Confirm from 'react-confirm-bootstrap';
import update from 'immutability-helper';


export default class Home extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.yelp_search = this.yelp_search.bind(this);

    this.state = {
      locs: [],
      my_locs: [],
      user: false,
      no_img: "https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg",
      curr_page: 0,
      searched: false,
      total_results: 0
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

  yelp_search(term, area, page){
    $.ajax({
      type: "POST",
      url: "/yelp",
      contentType: "application/json",
      data: JSON.stringify({term: term, location: area, limit: 30, offset: page * 30})
    }).done((data) =>{
      this.setState({
        search_term: term,
        search_area: area,
        locs: data.businesses,
        searched: true,
        total_results: data.total,
        curr_page: page
      })
    }, () => {
      window.scrollTo(0, 0);
    });
  }

  handleSubmit(event){
    event.preventDefault();

    var term = event.target.search_term.value;
    var area = event.target.search_area.value;

    this.yelp_search(term, area, 0);
  
  }

  render() {
    return (
      <div >

        <Navbar logged_in={this.state.user !== false} user={this.state.user} curr="home"/> 
        
        <div className="container">
          <div className="page-header">
            {this.state.searched ?
              <h1 className="centre"> {this.state.total_results} Search Results Found </h1> :
              <div>
                <h1 className="centre"> Search </h1> 
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3" htmlFor="search_term">I'm looking for:</label>
                    <div className="col-md-6 col-sm-6">
                      <input type="text" className="form-control" id="search_term" name="search_term" placeholder="Enter search term(s) here" onChange={this.changeQuery}  required/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3" htmlFor="search_area">In the area of:</label>
                    <div className="col-md-6 col-sm-6">
                      <input type="text" className="form-control" id="search_area" name="search_area" placeholder="Enter location here" onChange={this.changeQuery}  required/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-md-1 col-md-offset-3 col-sm-1 col-sm-offset-3">
                      <button className="btn btn-default" type="submit"> Submit </button>
                    </div>
                  </div>
                </form>
              </div>
          }
          </div>
        
          {
            this.state.searched ?
            <div>
              <ul className="list-group" id="results">
                {
                  this.state.locs.map((item,i) => 
                      <li key={i} className="list-group-item result" onClick={() => {}}> 
                        <div className="right">
                          <img src={this.state.locs[i].image_url} className="img_result"/>
                        </div>
                        <h3>{this.state.locs[i].name}</h3>
                        <p>Yelp Rating: {this.state.locs[i].rating}</p>
                      </li>)
                }
              </ul> 
              {
                (this.state.curr_page != 0) ?
                <button className="btn btn-default" onClick={() => this.yelp_search(this.state.search_term, this.state.search_area, this.state.curr_page - 1)}>Last Page</button> :
                null
              } 
              {
                (this.state.curr_page * 30 < this.state.total_results) ?
                <button className="btn btn-default" onClick={() => this.yelp_search(this.state.search_term, this.state.search_area, this.state.curr_page + 1)}>Next Page</button> :
                null
              } 
            </div> :
            null
          }
        </div> 
      </div>
    );
  }
}