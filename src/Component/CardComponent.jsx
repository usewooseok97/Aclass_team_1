import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';

function CardComponent({name,email , address , phone , website , company , id, onDelete}) {
  const [checked, setChecked] = useState(false);
  //아이템을 사용함 재사용시 수정
  return (
    <div style={{position:'relative' , width: '18rem',margin:"2em", padding : 0 }}>
        <div style={{position : "absolute" ,left : "40%" , backgroundColor: 'rgba(236, 229, 210, 0.76)' , borderRadius : 5, width : "50px", height : "20px" , zIndex: 10}}></div>
        <Card style={{ width: '18rem', padding : "8px", marginTop : "10px" ,position: 'relative',outline: 'none',border: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' , background: 'linear-gradient(135deg, #FFF199, #F2DA79)'}} >
        <input checked={checked} onChange={() => setChecked(!checked)} type='checkbox' style={{position: "absolute"}}></input>
        <Card.Body>
            <Card.Header >
                <Card.Text># {id+1} {name}</Card.Text>
            </Card.Header>
            <Card.Text>Email : {email}</Card.Text>
            <Card.Text>Address : {`${address.street}`}</Card.Text>
            <Card.Text>Phone : {phone}</Card.Text>
            <Card.Text>Portfolio : <Card.Link href="#">{website}</Card.Link></Card.Text>
            <Card.Text>Motto : {`${company.catchPhrase}`}</Card.Text>
            {checked ?
            <Button onClick={() => {onDelete(name); setChecked(!checked); }} variant="danger" size='sm' style={{ position: "absolute", left: "40%" }}>
              삭제하기
            </Button> : null
          }
        </Card.Body>
        </Card>
    </div>
  );
}
export default CardComponent