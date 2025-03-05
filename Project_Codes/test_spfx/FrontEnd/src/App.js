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
      <div>
        <table border={2}>
        <thead>
            <tr>
              <th>Annee</th>
              <th>Mois</th>
              <th>Client</th>
              <th>nombre Factures Payees</th>
              <th>montant Total Paye</th>
            </tr>
          </thead>
          <tbody>
            
              {
                revenues.map((revenue)=>{
                  return(
                  <tr>
                    <td> {revenue.annee} </td>
                    <td> {revenue.mois} </td>
                    <td> {revenue.nomClient} </td>
                    <td> {revenue.nombreFacturesPayees} </td>
                    <td> {revenue.montantTotalPaye} </td>
                  </tr>
                  )
                })
              }
            
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
