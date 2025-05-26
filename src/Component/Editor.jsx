import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function Editor({ onCreate , id }) {
  const initial = {
      id: id,
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
      },
      website: '',
      company: {
        catchPhrase: '',
      },
    }

  //보내는 값에 따라 이값이 변경됨
    const [formData, setFormData] = useState(initial);

    const handleChange = (e) => {
      const { name, value } = e.target;
      // 값이 키 : { 키 : 값}일때를 위해 만든 if문 그냥 키 :value면 else꺼만 사용하면된다
      if (name.includes('.')) {
          const [outerKey, innerKey] = name.split('.');
          setFormData(prev => ({
          ...prev,
          [outerKey]: {
              ...prev[outerKey],
              [innerKey]: value,
          },
          }));
      } else {
          setFormData(prev => ({
          ...prev,
          [name]: value,
          }));
      }
    };

  return (
    <>
      <InputGroup style={{marginBottom:"1rem"}}> {/* className 필요?? */}
        <Form.Control
          name="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Form.Control
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Form.Control
          name="phone"
          placeholder="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup style={{marginBottom:"1rem"}}>
        <InputGroup.Text>Address</InputGroup.Text>
        <Form.Control
          name="address.street"
          placeholder="street"
          value={formData.address.street}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup style={{marginBottom:"1rem"}}>
        <InputGroup.Text>Portfolio (website)</InputGroup.Text>
        <Form.Control
          name="website"
          placeholder="website"
          value={formData.website}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <InputGroup.Text>Motto</InputGroup.Text>
        <Form.Control
          as="textarea"
          name="company.catchPhrase"
          placeholder="catchPhrase"
          value={formData.company.catchPhrase}
          onChange={handleChange}
        />
      </InputGroup>

      <br />
      <Button variant="primary" type="button" onClick={() => {onCreate(formData); setFormData(initial);}}>
        Submit
      </Button>
    </>
  );
}

export default Editor