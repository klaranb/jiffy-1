import React, {Component} from 'react';
// here we import in our loader spinner as an image
import loader from './images/loader.svg'
import Gif from './Gif'
import clearButton from './images/close-icon.svg'

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}


const Header  = ({clearSearch, hasResults}) => (
  <div className='header grid'>
    {hasResults ? <button onClick={clearSearch}><img src={clearButton} /></button> : <h1 className='title' onClick={clearSearch}>Jiffy</h1>}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className='user-hint'>
    {/* here we check whether we have a loading state and render out
      either our spinner or hintText based on that, using a ternary operator
      (if/else) */}
    {loading ? <img className="block mx-auto" src={loader}/> : hintText}
  </div>
);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm:'',
      hintText: '',
      // we have an array of gifs
      gifs:[]
    };
  }

  // we want a function that searches the giphy api using
  // fetch and puts the search terms into the query url and
  // then we can do something with the results

  // we can also write async methonds into our components
  // that let us use the async / await style of function
  searchGiphy = async searchTerm => {
    this.setState({
      loading:true
    })

    // first we try our fetch
    try {
      // here we use the await keyword to wait for our response to come back
      const response = await fetch (`https://api.giphy.com/v1/gifs/search?api_key=grS4JeD1X64BUY1PK9PkqSEnIcBPQoUJ&q=${searchTerm}&limit=50&offset=0&rating=pg&lang=en`);

      // here we convert our raw response into json data
      // const {data} gets the .data part of our response
      const {data} = await response.json();

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      //here we grab a random result from our images
      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        // here we use our spread to take our previous gifs
        // spread them out, and then add our new random gif to the end
        gifs:[...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));

      // if our fetch fails, we catch it down here
    } catch (error) {
        this.setState((prevState, props) => ({
            ...prevState,
            hintText: error,
            loading:false
        }));
    }
  };


  // with create react app we can write our methods
  // as arrow functions, meaning we don't need the constructor and bind
  handleChange = event => {
    const {value} = event.target
    // by setting the searchTerm in our state and also using that
    // on the input as the value, we have created what is called
    // a controlled input
    this.setState((prevState, props) => ({
      // we take our old props and spread them out here
      ...prevState,
      // and then we overwrite the ones we want after
      searchTerm: value,
      // we set the hintText text only when we have more than 2 characters
      // in our input, otherwise we make it an empty string
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

    // when we have two or more characters in our search box
    // and we have also pressed enter, we then want to run a search

    handleKeyPress = event => {
      const {value} = event.target

      if (value.length > 2 && event.key === 'Enter') {
        //here we call our searchGiphy function using the search term
        this.searchGiphy(value)
      }
    };

    // here we reset our state by clearing everything out
    // and making it default again
    clearSearch = () => {
      this.setState((prevState, props) => ({
        ...prevState,
        searchTerm:'',
        hintText:'',
        gifs:[]
      }));
      // here we grab the input and then focus the cursor back into into it
      this.textInput.focus();
    };

    render () {
      // const searchTerm = this.state.searchTerm
      const {searchTerm, gifs} = this.state;
      const hasResults = gifs.length;


      return (
          <div className="page">
            <Header clearSearch={this.clearSearch} hasResults={hasResults}/>


            <div className="search grid">
              {/* our stack of gif images*/}
              {/* here we loop over our array of gif images from our state
                and we create multiple videos from it*/}

              {this.state.gifs.map(gif => (
                <Gif {...gif} />
              ))}

              <input
                className="input grid-item"
                placeholder="Type something"
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                value={searchTerm}
                ref={(input ) => {this.textInput = input;}}
              />
            </div>
            {/* here we pass our userHint all of our state using a spread */}
            <UserHint {...this.state}/>
          </div>
      );
  }
}

export default App;
