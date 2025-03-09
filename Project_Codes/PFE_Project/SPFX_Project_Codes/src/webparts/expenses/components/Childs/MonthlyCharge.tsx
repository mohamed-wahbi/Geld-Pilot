import * as React from 'react';
import { useState, useEffect } from 'react';
import 'aos/dist/aos.css';
import styles from '../Expenses.module.scss';
import axios from 'axios';
const { VocaFlexMWSTn } = require('vecoflextnmws');

interface Expense {
  expenseName: string;
  expenseType: string;
}

interface Charge {
  _id: string;
  expenseName: string;
}

const MonthlyCharge: React.FC = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]); // Charges sélectionnées
  const [charges, setCharges] = useState<Charge[]>([]); // Liste des charges
  const [generatChargeFixTab, setGeneratChargeFixTab] = useState(false);

  console.log(charges);

  useEffect(() => {
    fetchCharges();
  }, []);

  // Fonction pour récupérer toutes les charges fixes
  const fetchCharges = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3320/api/expense-fix/getAll');
      setCharges(res.data.Expenses_Fixs);
    } catch (error) {
      console.error('Erreur lors de la récupération des charges fixes !', error);
    }
  };

  // ----------------------- Filter System --------------------------------
  const [allFiltredDatas, setAllFiltredDatas] = useState<Expense[]>([]);
  const [oneFiltredData, setOneFiltredData] = useState<Expense | null>(null);

  console.log(allFiltredDatas); // liste des données filtrées
  console.log(oneFiltredData); // une ligne de la liste des données filtrées

  const getAllFiltredDatas = (data: Expense[]) => {
    setAllFiltredDatas(data);
  };
  const getOneFiltredData = (data: Expense) => {
    setOneFiltredData(data);
  };

  // ------------------- Handel Select Charges -----------------------------
  const handleChargeSelection = (chargeId: string) => {
    setSelectedCharges((prevSelected) =>
      prevSelected.includes(chargeId)
        ? prevSelected.filter((id) => id !== chargeId) // Désélectionner
        : [...prevSelected, chargeId] // Sélectionner
    );
  };



  return (
    <div className={styles.tableContainer}>
      <div className={styles.HeaderTabelCtrl}>
        <div className={styles.searchInput}>
          <VocaFlexMWSTn
            data={''}
            keys={['']}
            lang={'en-US'}
            threshold={'0.4'}
            allFiltredDatas={getAllFiltredDatas}
            oneFiltredData={getOneFiltredData}
            titre={'expenseName'}
            description={'expenseType'}
          />
        </div>

        <div className={styles.generateRevenue}>
          <div className={styles.Top}>
            <p>Generat Monthly Expenses</p>
            <button
            style={{borderRadius: "5px"}}
              onClick={() => {
                setGeneratChargeFixTab(!generatChargeFixTab);
                setYear('');
                setMonth('');
              }}
            >
              {generatChargeFixTab ? '❌' : '🆕'}
            </button>
          </div>

          {generatChargeFixTab && (
            <div className={styles.GenerateForm}>
              <div className={styles.inputGenerateForm}>
                <label>Year</label>
                <input
                  style={{ marginLeft: "15px" }}
                  placeholder="2025"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGenerateForm}>
                <label>Month</label>
                <input
                  placeholder="01 - 12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                />
              </div>

              <div >
                <ul className={styles.inputGenerateFormUl}>
                  {charges.map((charge) => (
                    <li key={charge._id}>

                      <input
                        type="checkbox"
                        onChange={() => handleChargeSelection(charge._id)}
                        checked={selectedCharges.includes(charge._id)}
                      />
                      {charge.expenseName}

                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.btnContent}>
                <button style={{ border: 'none', margin: " 0px 10px", borderRadius: "5px" }}>➕</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.TableContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Année</th>
              <th>Mois</th>
              <th>Nom Charge</th>
              <th>Type Charge</th>
              <th>Montant Prévisionnel (€)</th>
              <th>Montant Réel (€)</th>
              <th>Cavred Day</th>
              <th>Statut Charge</th>
              <th>Contrôle</th>
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
