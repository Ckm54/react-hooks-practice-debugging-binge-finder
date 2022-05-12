import React, { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import Adapter from "../Adapter";
import TVShowList from "./TVShowList";
import Nav from "./Nav";
import SelectedShowContainer from "./SelectedShowContainer";

function App() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShow, setSelectedShow] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [filterByRating, setFilterByRating] = useState("");

  useEffect(() => {
    Adapter.getShows().then((shows) => setShows(shows));
    
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  function handleSearch(e) {
    setSearchTerm(e.target.value.toLowerCase());
    const results = shows.filter((show) => (show.name.toLowerCase()).includes(searchTerm))
    setShows(results)
  }

  function handleFilter(e) {
    e.target.value === "No Filter"
      ? setFilterByRating("")
      : setFilterByRating(e.target.value);
  }

  function selectShow(show) {
    Adapter.getShowEpisodes(show.id).then((episodesData) => {
      
      setEpisodes(episodesData);
      setSelectedShow(show);

    });
    
  }

  let displayShows = [...shows];
  if (filterByRating) {
    displayShows = displayShows.filter((s) => {
      return s.rating.average >= filterByRating;
    });
  }

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

  return (
    <div>
      <Nav
        handleFilter={handleFilter}
        handleSearch={handleSearch}
        search={searchTerm}
      />
      <Grid celled>
        <Grid.Column width={5}>
          {!isEmpty(selectedShow) ? (
            <SelectedShowContainer
              selectedShow={selectedShow}
              allEpisodes={episodes}
            />
          ) : (
            <div />
          )}
        </Grid.Column>
        <Grid.Column width={11}>
          <TVShowList
            shows={displayShows}
            selectShow={selectShow}
            searchTerm={searchTerm}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
