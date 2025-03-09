import * as React from 'react';
import { useState } from 'react';
 const AOS = require("aos");
import "aos/dist/aos.css";
import styles from '../Expenses.module.scss';
const { VocaFlexMWSTn } = require('vecoflextnmws')




interface Expense {
  
}






const MonthlyCharge: React.FC = () => {

    // -----------------------Filter System--------------------------------
    const [allFiltredDatas, setAllFiltredDatas] = useState<Expense[]>([])
    const [oneFiltredData, setOneFiltredData] = useState<Expense | null>(null)
  
    console.log(allFiltredDatas);// liste des données filtre
  
    console.log(oneFiltredData)// un ligne de la liste des données filtré
  
  
    const getAllFiltredDatas = (data: Expense[]) => { setAllFiltredDatas(data) }
    const getOneFiltredData = (data: Expense) => { setOneFiltredData(data) }
    // ___________________________________________________________________
 

  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.tableContainer}>
    

      <div className={styles.HeaderTabelCtrl}>
        <div className={styles.searchInput}>
          <VocaFlexMWSTn
            data={""}
            keys={[""]}
            lang={"en-US"}
            threshold={"0.4"}
            allFiltredDatas={getAllFiltredDatas}
            oneFiltredData={getOneFiltredData}
            titre={"expenseName"}
            description={"expenseType"}
          />

        </div>

       
      </div>

      <div className={styles.TableContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Controls</th>
              <th>Expense Name</th>
              <th>Expense Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Day</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>

            {/* Ligne pour ajouter un nouveau client en haut du tableau */}
            





            
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default MonthlyCharge;
