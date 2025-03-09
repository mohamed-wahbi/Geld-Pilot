import * as React from 'react';
import { useState, useEffect } from 'react';
import 'aos/dist/aos.css';
import styles from '../Expenses.module.scss';
import axios from 'axios';
const { VocaFlexMWSTn } = require('vecoflextnmws');
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";

// Define TypeScript interfaces for better type safety
interface MonthlyExpense {
  _id: string;
  year: string;
  month: string;
  expenseName: string;
  expenseType: string;
  estimatedAmount: string;
  actualAmount: string;
  covredDay: string;
  chargeStatus: string;
}

interface Charge {
  _id: string;
  expenseName: string;
}

const MonthlyCharge: React.FC = () => {
  // State variables
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [charges, setCharges] = useState<Charge[]>([]);
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [editableData, setEditableData] = useState<Record<string, Partial<MonthlyExpense>>>({});
  const [createOneTab, setCreateOneTab] = useState<boolean>(false);

  // Input fields for creating a new charge
  const [expenseName, setExpenseName] = useState<string>('');
  const [expenseType, setExpenseType] = useState<string>('');
  const [estimatedAmount, setEstimatedAmount] = useState<string>('');
  const [actualAmount, setActualAmount] = useState<string>('');
  const [covredDay, setCovredDay] = useState<string>('');
  const [editableRow, setEditableRow] = useState<string | null>(null);

  useEffect(() => {
    fetchCharges();
    fetchMonthlyExpenses();
  }, []);

  // Fetch charges from the API
  const fetchCharges = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3320/api/expense-fix/getAll");
      setCharges(response.data.Expenses_Fixs);
    } catch (error) {
      console.error("Erreur lors de la récupération des charges fixes !", error);
    } finally {
    }
  };

  // Fetch monthly expenses from the API
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3320/api/monthly-expense/getAll");
      setMonthlyExpenses(response.data.monthlyExpenses);
    } catch (error) {
      console.error("Erreur lors de la récupération des charges mensuelles !", error);
    }
  };

  // Handle the charge selection
  const handleChargeSelection = (chargeId: string) => {
    setSelectedCharges((prevSelected) =>
      prevSelected.includes(chargeId)
        ? prevSelected.filter((id) => id !== chargeId)
        : [...prevSelected, chargeId]
    );
  };

  // Handle charge registration
  const RegisterOneNewCharge = async () => {
    if (!year || !month || !expenseName || !expenseType || !actualAmount) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:3320/api/monthly-expense/create",
        { year, month, expenseName, expenseType, estimatedAmount, actualAmount, covredDay }
      );
      console.log("Charge créée avec succès", response.data);
      setExpenseName("")
      setExpenseType("")
      setEstimatedAmount("")
      setActualAmount("")
      setCovredDay("")
      fetchMonthlyExpenses();
    } catch (error) {
      console.error("Erreur lors de la création de la charge mensuelle", error);
    }
  };

  // Handle editing of monthly charge
  const handleEditClick = (item: MonthlyExpense) => {
    setEditableRow(item._id)
    setEditableData((prev) => ({
      ...prev,
      [item._id]: {
        estimatedAmount: item.estimatedAmount,
        actualAmount: item.actualAmount,
        covredDay: item.covredDay || '',
      }
    }));
  };

  // Handle change in input fields for editing
  const handleChange = (id: string, field: string, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // Update the charge with edited data
  const updateOneMonthlyChargesById = async (id: string) => {
    const data = editableData[id];
    if (!data) {
      setEditableRow(null)
      return;
    } 

    try {
      await axios.put(`http://127.0.0.1:3320/api/monthly-expense/updateOne/${id}`, data);
      setExpenseName("")
      setExpenseType("")
      setEstimatedAmount("")
      setActualAmount("")
      setCovredDay("")
      setEditableRow(null);
      fetchMonthlyExpenses();
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la charge mensuelle", error);
    }
  };

  // Delete charge
  const deleteOneMonthlyChargesById = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:3320/api/monthly-expense/deleteOne/${id}`);
      fetchMonthlyExpenses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la charge mensuelle", error);
    }
  };


  // -----------------------Filter System--------------------------------
  const [allFiltredDatas, setAllFiltredDatas] = useState<MonthlyExpense[]>([])
  const [oneFiltredData, setOneFiltredData] = useState<MonthlyExpense | null>(null)

  console.log(allFiltredDatas);// liste des données filtre

  console.log(oneFiltredData)// un ligne de la liste des données filtré


  const getAllFiltredDatas = (data: MonthlyExpense[]) => { setAllFiltredDatas(data) }
  const getOneFiltredData = (data: MonthlyExpense) => { setOneFiltredData(data) }
  // ___________________________________________________________________
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
            <p>Generate Monthly Expenses</p>
            <button
              style={{ borderRadius: "5px" }}
              onClick={() => setCreateOneTab(!createOneTab)}
            >
              {createOneTab ? '❌' : '🆕'}
            </button>
          </div>

          {createOneTab && (
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

              <div className={styles.btnContent}>
                <button
                  style={{ border: 'none', margin: "0px 10px", borderRadius: "5px" }}
                  onClick={RegisterOneNewCharge}
                >
                  ➕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.TableContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Controls</th>
              <th>Année</th>
              <th>Mois</th>
              <th>Nom Charge</th>
              <th>Type Charge</th>
              <th>Montant Prévisionnel (€)</th>
              <th>Montant Réel (€)</th>
              <th>Cavred Day</th>
              <th>Statut Charge</th>
              
            </tr>
          </thead>
          <tbody>
            {monthlyExpenses.map((item) => (
              <tr key={item._id}>
                <td className={styles.ctrlCl}>
                  <span>⚙️</span>
                  <div className={styles.ctrlBtn}>
                    <MdDeleteOutline className={styles.deleteLogo} onClick={() => deleteOneMonthlyChargesById(item._id)} />
                    <HiOutlineWrench className={styles.updateLogo} onClick={() => handleEditClick(item)} />
                  </div>
                </td>
               
                <td>{item.year}</td>
                <td>{item.month}</td>
                <td>{item.expenseName}</td>
                <td>{item.expenseType}</td>
                <td>
                  {editableRow === item._id ? (
                    <input
                      className={styles.ChangeInput}
                      type="number"
                      value={editableData[item._id]?.estimatedAmount || ''}
                      onChange={(e) => handleChange(item._id, 'estimatedAmount', e.target.value)}
                    />
                  ) : (
                    item.estimatedAmount
                  )}
                </td>
                <td>
                  {editableRow === item._id ? (
                    <input
                      className={styles.ChangeInput}
                      type="number"
                      value={editableData[item._id]?.actualAmount || ''}
                      onChange={(e) => handleChange(item._id, 'actualAmount', e.target.value)}
                    />
                  ) : (
                    item.actualAmount
                  )}
                </td>
                <td>
                  {editableRow === item._id ? (
                    <input
                      className={styles.ChangeInput}
                      value={editableData[item._id]?.covredDay || ''}
                      onChange={(e) => handleChange(item._id, 'covredDay', e.target.value)}
                    />
                  ) : (
                    item.covredDay
                  )}
                </td>
                
                <td>{item.chargeStatus}</td>
                {editableRow === item._id ? (
                  <td className={styles.editRow}>
                    <button onClick={() => updateOneMonthlyChargesById(item._id)} >✅</button>
                    <button onClick={() => setEditableRow(null)}>⛔</button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyCharge;
