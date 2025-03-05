import axios from 'axios';
import React, { useEffect, useState } from 'react'

const App = () => {
  const [revenues,setRevenues] = useState([]);

  useEffect(()=> {
    featchAllRevenues()
  },[])

  //----------------------------Featch all Generated Revenues---------------------
  const featchAllRevenues = async()=> {
    try {
      const revenues = await axios.get('http://127.0.0.1:3320/api/revenue/getAll')
      setRevenues(revenues.data.revenues)
    } catch (error) {
      console.log ('Revenue not featched ! ',error)
    }
  }
  // ______________________________________________________________________________

  return (
    <div>
      
    </div>
  )
}

export default App
