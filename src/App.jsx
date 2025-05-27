import ThemeProvider from 'react-bootstrap/ThemeProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from "react"
import './App.css'


import Weather from './Component/Weather';


function App() {
    const [users , setUsers] = useState([]);
    const [searchQuery , setSearchQuery] = useState("")

    useEffect(() => {
        FetchUserInfo()
    },[])
  
    const FetchUserInfo = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json => setUsers(json))
    }

    //새로운 list를 추가
    // const onCreate = (Newdata) => {
    //   // 이름이 중복되는지 확인
    //   const isDuplicate = users.some(user => user.name === Newdata.name);
    //   if (!isDuplicate) {
    //       setUsers([...users, Newdata]);
    //   }
    // };
    //이름(key 값)를 기준으로 찾아서 제거

    const onDelete = ( name ) => {
      // 키값을 기준으로 함
      const copy = users.filter((item) => item.name != name)
      setUsers([...copy])
    }

//검색을 JsonSearch에서 받아서 list에 넘겨줌
  return(
    // ThemeProvider는 변환형
    <ThemeProvider breakpoints={['xxxl','xxl', 'xl', 'lg', 'md', 'sm', 'xs']} minBreakpoint="xxs" >
      <Weather/>
    </ThemeProvider>
  )
}

export default App
