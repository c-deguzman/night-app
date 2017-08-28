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

    this.going = this.going.bind(this);
    this.not_going = this.not_going.bind(this);

    this.login = this.login.bind(this);

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

    $.ajax({
      type: "POST",
      url: "/get_my_goings",
      contentType: 'application/json'
    }).done((data_locs) => {
      this.setState({
        my_locs: data_locs
      });
    });

    if (window.location.search !== ""){
      var urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has("term") && urlParams.has("area") && urlParams.has("page")){
        this.yelp_search(urlParams.get("term"), urlParams.get("area"), parseInt(urlParams.get("page")));
      }
    }
  }

  yelp_search(term, area, page){

    if (this.state.searched){
      if (page < 0){
        page = 0;
      } else if (page > Math.floor(this.state.total_results / 30) - 1){
        page = Math.floor(this.state.total_results / 30) - 1;
      }
    }

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
        total_results: Math.min(data.total, 1000),
        curr_page: page
      })
    }, () => {

      this.state.locs.map((item,i) => 
        $.ajax({
          type: "POST",
          url: "/get_loc_goings",
          contentType: 'application/json',
          data: JSON.stringify({loc: item.id})
        }).done((loc_going) => {
          this.setState({
            [item.id]: loc_going.len
          });
        })
      )

      window.scrollTo(0, 0);
    });
  }

  handleSubmit(event){
    event.preventDefault();

    var term = event.target.search_term.value;
    var area = event.target.search_area.value;

    this.yelp_search(term, area, 0);
  
  }

  going(id){
    $.ajax({
      type: "POST",
      url: "/set_going",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((data) => {
      if (data.result == "success"){
        this.setState({
          [id]: this.state[id] + 1, 
          my_locs: this.state.my_locs.concat([id])
        });
      }
    });
  }

  not_going(id){
    $.ajax({
      type: "POST",
      url: "/set_not_going",
      contentType: 'application/json',
      data: JSON.stringify({id: id})
    }).done((data) => {
      if (data.result == "success"){
        this.setState({
          [id]: this.state[id] - 1, 
          my_locs: this.state.my_locs.filter((item) => item != id)
        });
      }
    });
  }

  login(){
    window.location.href = "/login?term=" + this.state.search_term + "&area=" + this.state.search_area + "&page=" + this.state.curr_page;
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
                <h1 className="centre"> Search Tonight's Nightlife</h1> 
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3" htmlFor="search_term">I'm looking for:</label>
                    <div className="col-md-6 col-sm-6">
                      <input type="text" className="form-control" id="search_term" name="search_term" placeholder="Enter search term(s) here" required/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3" htmlFor="search_area">In the area of:</label>
                    <div className="col-md-6 col-sm-6">
                      <input type="text" className="form-control" id="search_area" name="search_area" placeholder="Enter location here" required/>
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
                          <img src={item.image_url} className="img_result"/>
                        </div>
                        <h3>{item.name}</h3>
                        <p>Yelp Quality Rating: {item.rating}</p>
                        <p>Yelp Price Rating: {item.price}</p>
                        <p>{item.location.address1}</p>
                        <p>People going: {this.state[item.id]}</p>
                        {
                          (this.state.user === false) ?
                          <button className="btn btn-default" onClick={this.login}> Mark GOING </button> :
                            (this.state.my_locs.indexOf(item.id) == -1) ?
                            <button className="btn btn-default" onClick={() => this.going(item.id)}> Mark GOING </button> :
                            <button className="btn btn-default" onClick={() => this.not_going(item.id)}> Mark NOT GOING </button>                             
                        }
                        
                      </li>)
                }
              </ul> 


              <div className="btn-group centre" id="pagination">
                { 
                  this.state.curr_page > 0 ?
                    <div>
                    <button className="btn btn-default" onClick={() => this.yelp_search(this.state.search_term, this.state.search_area, 0)}>First</button>
                    <button className="btn btn-default" onClick={() => this.yelp_search(this.state.search_term, this.state.search_area, this.state.curr_page - 1)}>
                      Previous
                    </button> 
                    </div>:
                    null
                }
                {
                  this.state.curr_page < Math.floor(this.state.total_results / 30) - 1 ?
                    <div>
                    <button className="btn btn-default" onClick={() => this.yelp_search(this.state.search_term, this.state.search_area, this.state.curr_page + 1)}>
                      Next
                    </button> 
                    <button className="btn btn-default" onClick={() => this.yelp_search(this.state.search_term, this.state.search_area, Math.floor(this.state.total_results / 30) - 1)}>
                      Last
                    </button>
                    </div>:
                    null
                }
              </div>

              <div className="centre" id="page_num">
                <p>Page {this.state.curr_page + 1}</p>
              </div>
            </div> :
            null
          }
        </div> 
      </div>
    );
  }
}