import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from '../../components/InvoiceRevenue.module.scss';
const AOS = require("aos");
import "aos/dist/aos.css";
import axios from 'axios';




interface Revenue {
  _id: string,
  id_client: string,
  annee: string,
  mois: string,
  nomClient: string,
  nombreFacturesPayees: string,
  montantTotalPaye: string,
  createdAt: string,
}

const RevenueWebPart: React.FC = () => {
    const [revenues, setRevenues] = useState<Revenue[]>([]);
      
    // Featching Data 
    useEffect(()=> {
      FeatchingRevenues()
    },[])


    // -------------------------Featching Revenue--------------------------------
        const FeatchingRevenues =async ()=> {
          try {
            const revenuesData = await axios.get ("http://127.0.0.1:3320/api/revenue/getAll")
            console.log(revenuesData.data);
            setRevenues(revenuesData.data.revenues)
          } catch (error) {
            console.log ("Error Featching Revenues from DB !")
          }
        }
    // ___________________________________________________________________________
  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.TableContent} >
        <table className={styles.table}>
          <thead>
            <th>Annee</th>
            <th>Mois</th>
            <th>Client</th>
            <th>nombre Factures Payees</th>
            <th>montant Total Paye</th>
          </thead>
          <tbody>
            {
              revenues.map((revenue)=> {
                return(
                  <tr key={revenue._id}>
                    <td>🗓️ {revenue.annee} </td>
                    <td>📆 {revenue.mois} </td>
                    <td style={{fontWeight: "500"}}>🕴️ {revenue.nomClient} </td>
                    <td>✍️ {revenue.nombreFacturesPayees} </td>
                    <td>💷 {revenue.montantTotalPaye}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueWebPart;
