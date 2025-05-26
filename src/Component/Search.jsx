
import { FormControl } from 'react-bootstrap';

function Search({ setSearchQuery }) {

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div style={{width : "30%", display:"flex" , position : "relative" , left:0, marginLeft : "2em"}}>
      <FormControl
        type="text"
        placeholder="name-Search"
        onChange={handleInputChange}
      />
    </div>
  );
}
export default Search