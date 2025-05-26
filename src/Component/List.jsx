
import Container from "react-bootstrap/Container"
import CardComponent from "./CardComponent"


function List({users , onDelete ,searchQuery}){
    //searchQuery에 따라서 출력함
    const getFilterData = (searchQuery) => {
        if (!searchQuery) {
            return users
        }
        return users.filter((todo) =>  todo.name.toLowerCase().includes(searchQuery.toLowerCase()))   
    }

    return(
        <Container  style={{maxWidth: '1100px',minWidth: '300px',width: '100%',display : "flex", flexWrap : "wrap", padding:0}}>
            {users ? getFilterData(searchQuery).map((item , index) => {
                return <CardComponent key={index} {...item} id={index} onDelete={onDelete}/>
            }) :  null }
        </Container>
    )
}
export default List
