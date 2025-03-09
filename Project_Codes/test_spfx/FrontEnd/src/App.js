import axios from "axios";
import React, { useEffect, useState } from "react";

const App = () => {
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [charges, setCharges] = useState([]); // Liste des charges
  const [selectedCharges, setSelectedCharges] = useState([]); // Charges sélectionnées
  const [chargesById, setChargesById] = useState([]); // Charges récupérées par ID
  const [monthlyExpenses, setMonthlyExpenses] = useState([]); // Toutes les charges mensuelles
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  const [editingId, setEditingId] = useState(null); // ID de la charge en cours d'édition
  const [editableData, setEditableData] = useState({}); // Données modifiables


  const [createOneTab, setCreateOneTab] = useState(false)



  const [expenseName, setExpenseName] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [actualAmount, setActualAmount] = useState("");
  const [covredDay, setCovredDay] = useState("");

  useEffect(() => {
    fetchCharges();
    fetchMonthlyExpenses();
  }, []);

  // Fonction pour récupérer toutes les charges fixes
  const fetchCharges = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:3320/api/expense-fix/getAll"
      );
      setCharges(res.data.Expenses_Fixs);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des charges fixes !",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer toutes les charges mensuelles
  const fetchMonthlyExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:3320/api/monthly-expense/getAll"
      );
      setMonthlyExpenses(res.data.monthlyExpenses);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des charges mensuelles !",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection des charges
  const handleChargeSelection = (chargeId) => {
    setSelectedCharges((prevSelected) =>
      prevSelected.includes(chargeId)
        ? prevSelected.filter((id) => id !== chargeId) // Désélectionner
        : [...prevSelected, chargeId] // Sélectionner
    );
  };

  // Fonction pour afficher les charges sélectionnées
  const viewSelectedCharges = async () => {
    if (selectedCharges.length === 0) {
      alert("Veuillez sélectionner au moins une charge.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:3320/api/expense-fix/getmany?ids=${selectedCharges.join(",")}`
      );

      if (Array.isArray(response.data)) {
        const chargesIds = response.data.map((item) => item._id);

        if (!month || !year || chargesIds.length === 0) {
          alert("Veuillez remplir tous les champs et sélectionner au moins une charge.");
          return;
        }

        console.log("date :", year, "___", month);
        console.log("Charges sélectionnées :", chargesIds);

        const createMonthlyCharge = await axios.post(
          "http://127.0.0.1:3320/api/monthly-expense/create",
          { month, year, expenseIds: chargesIds } // Utilisez "expenseIds" au lieu de "chargesById"
        );

        console.log(createMonthlyCharge.data);
        fetchMonthlyExpenses();
      } else {
        console.error("Réponse inattendue :", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des charges :", error);
    } finally {
      setLoading(false);
    }
  };










  const deleteOneMonthlyChargesById = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3320/api/monthly-expense/deleteOne/${id}`);
      fetchMonthlyExpenses();
    } catch (error) {
      console.log("error lors de la supprission de MonthlyCharge!", error)
    }
  }







  // -----------------------------Update--------------------------------
  const updateOneMonthlyChargesById = async (id) => {
    if (!editableData[id]) return;

    try {
      await axios.put(`http://127.0.0.1:3320/api/monthly-expense/updateOne/${id}`, {
        estimatedAmount: editableData[id].estimatedAmount,
        actualAmount: editableData[id].actualAmount,
        covredDay: editableData[id].covredDay,
      });

      setEditingId(null);
      fetchMonthlyExpenses();
    } catch (error) {
      console.log("Erreur lors de la mise à jour de MonthlyCharge!", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditableData({
      ...editableData,
      [item._id]: {
        estimatedAmount: item.estimatedAmount,
        actualAmount: item.actualAmount,
        covredDay: item.covredDay || "",
      },
    });
  };

  const handleChange = (id, field, value) => {
    setEditableData({
      ...editableData,
      [id]: {
        ...editableData[id],
        [field]: value,
      },
    });
  };









  const RegisterOneNewCharge = async () => {
    if (!year || !month || !expenseName || !expenseType || !actualAmount) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
  
    try {
      const payload = {
        year,
        month,
        expenseName,
        expenseType,
        estimatedAmount,
        actualAmount,
        covredDay,
      };
  
      const res = await axios.post(
        "http://127.0.0.1:3320/api/monthly-expense/createManuel",
        payload
      );
  
      console.log(res.data.message);
      fetchMonthlyExpenses(); // Mettre à jour la liste après ajout
      setCreateOneTab(false); // Fermer le formulaire après soumission
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };
  
  

  return (
    <div>
      <h2>Liste des Charges Fixes</h2>
      <div>
        <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <input placeholder="Month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      {loading && <p>Chargement...</p>}
      <ul>
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

      <button onClick={viewSelectedCharges} disabled={loading}>
        {loading ? "Chargement..." : "Afficher les charges sélectionnées"}
      </button>

      <h2>Tableau des Charges Mensuelles</h2>
      <button onClick={() => setCreateOneTab(!createOneTab)}>Create One</button>
      <div>
        <table border="2">
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
            {/* new monthlyExpenses */}
            {createOneTab ?
              <tr>
                <td><input value={year} placeholder="Année" onChange={(e) => setYear(e.target.value)} /></td>
                <td><input value={month} placeholder="Mois" onChange={(e) => setMonth(e.target.value)} /></td>
                <td><input value={expenseName} placeholder="Nom Charge" onChange={(e) => setExpenseName(e.target.value)} /></td>
                <td>
                  <select value={expenseType} onChange={(e) => setExpenseType(e.target.value)}>
                    <option value="">Sélectionner un type</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Admin">Admin</option>
                    <option value="Training">Training</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Travel">Travel</option>
                    <option value="HR">HR</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td><input type="number" value={estimatedAmount} placeholder="Montant Prévisionnel" onChange={(e) => setEstimatedAmount(e.target.value)} /></td>
                <td><input type="number" value={actualAmount} placeholder="Montant Réel" onChange={(e) => setActualAmount(e.target.value)} /></td>
                <td><input value={covredDay} placeholder="Cavred Day" onChange={(e) => setCovredDay(e.target.value)} /></td>
                <td>
                  <button onClick={RegisterOneNewCharge}>✅</button>
                  <button onClick={() => setCreateOneTab(false)}>❌</button>
                </td>
              </tr>

              : null
            }






            {monthlyExpenses.length > 0 ? (
              monthlyExpenses.map((item) => (
                <tr key={item._id}>
                  <td>{item.year}</td>
                  <td>{item.month}</td>
                  <td>{item.expenseName}</td>
                  <td>{item.expenseType}</td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editableData[item._id]?.estimatedAmount || ""}
                        onChange={(e) => handleChange(item._id, "estimatedAmount", e.target.value)}
                      />
                    ) : (
                      `${item.estimatedAmount} €`
                    )}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editableData[item._id]?.actualAmount || ""}
                        onChange={(e) => handleChange(item._id, "actualAmount", e.target.value)}
                      />
                    ) : (
                      `${item.actualAmount} €`
                    )}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editableData[item._id]?.covredDay || ""}
                        onChange={(e) => handleChange(item._id, "covredDay", e.target.value)}
                      />
                    ) : (
                      item.covredDay === null ? "not covered" : item.covredDay
                    )}
                  </td>
                  <td>{item.chargeStatus}</td>
                  <td>
                    {item.covredDay ? (
                      "✅"
                    ) : editingId === item._id ? (
                      <button onClick={() => updateOneMonthlyChargesById(item._id)}>Sauvegarder</button>
                    ) : (
                      <div>
                        <button onClick={() => deleteOneMonthlyChargesById(item._id)}>Supprimer</button>
                        <button onClick={() => handleEditClick(item)}>Modifier</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Aucune charge mensuelle disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
