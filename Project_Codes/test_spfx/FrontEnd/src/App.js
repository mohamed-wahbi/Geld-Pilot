import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [newInvoice, setNewInvoice] = useState({
        id_client: "",
        montantInitial: null,
        remise: null,
        montantPaye: null,
        datePaiementEntreprise: "",
        statut: "unpaid"
    });
    const [editingInvoice, setEditingInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
        fetchClients();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:3320/api/invoice/getAll");
            setInvoices(res.data.invoices);
        } catch (error) {
            console.error("Erreur lors de la récupération des factures :", error);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:3320/api/client/getAll");
            setClients(res.data.clients);
        } catch (error) {
            console.error("Erreur lors de la récupération des clients :", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewInvoice((prev) => ({
            ...prev,
            [name]: ["montantInitial", "remise", "montantPaye"].includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleAddInvoice = async () => {
        if (!newInvoice.id_client) {
            alert("Veuillez sélectionner un client.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:3320/api/invoice/create", newInvoice);
            fetchInvoices();
            setNewInvoice({
                id_client: "",
                montantInitial: null,
                remise: null,
                montantPaye: null,
                datePaiementEntreprise: "",
                statut: "unpaid"
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout de la facture :", error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:3320/api/invoice/deleteOne/${id}`);
            fetchInvoices();
        } catch (error) {
            console.error("Erreur lors de la suppression de la facture :", error);
        }
    };

    const handleEditClick = (invoice) => {
        setEditingInvoice({ ...invoice });
    };

    const handleUpdate = async () => {
        if (!editingInvoice) return;

        try {
            await axios.put(`http://127.0.0.1:3320/api/invoice/updateOne/${editingInvoice._id}`, editingInvoice);
            fetchInvoices();
            setEditingInvoice(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la facture :", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Gestion des Factures</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Montant Initial</th>
                        <th>Remise (%)</th>
                        <th>Montant Après Remise</th>
                        <th>Montant Payé</th>
                        <th>Montant Restant</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice._id}>
                            <td>{invoice.id_client.name}</td>
                            <td>{invoice.montantInitial.toFixed(2)} €</td>
                            <td>{invoice.remise} %</td>
                            <td>{invoice.montantApresRemise.toFixed(2)} €</td>
                            <td>{invoice.montantPaye.toFixed(2)} €</td>
                            <td>{invoice.montantRestant.toFixed(2)} €</td>
                            <td>{invoice.statut}</td>
                            <td>
                                <button onClick={() => handleEditClick(invoice)}>Modifier</button>
                                <button onClick={() => handleDelete(invoice._id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Ajouter une facture</h3>
            <select name="id_client" onChange={handleChange} value={newInvoice.id_client}>
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                    <option key={client._id} value={client._id}>{client.name}</option>
                ))}
            </select>
            <input type="number" name="montantInitial" placeholder="Montant Initial (€)" onChange={handleChange} value={newInvoice.montantInitial} />
            <input type="number" name="remise" placeholder="Remise (%)" onChange={handleChange} value={newInvoice.remise} />
            <input type="number" name="montantPaye" placeholder="Montant Payé (€)" onChange={handleChange} value={newInvoice.montantPaye} />
            <input type="date" name="datePaiementEntreprise" onChange={handleChange} value={newInvoice.datePaiementEntreprise} />
            <button onClick={handleAddInvoice}>Ajouter</button>

            {editingInvoice && (
                <div>
                    <h3>Modifier la facture</h3>
                    <input
                        type="number"
                        name="montantInitial"
                        value={editingInvoice.montantInitial}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, montantInitial: parseFloat(e.target.value) || 0 })}
                    />
                    <input
                        type="number"
                        name="remise"
                        value={editingInvoice.remise}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, remise: parseFloat(e.target.value) || 0 })}
                    />
                    <input
                        type="number"
                        name="montantPaye"
                        value={editingInvoice.montantPaye}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, montantPaye: parseFloat(e.target.value) || 0 })}
                    />
                    <input
                        type="date"
                        name="datePaiementEntreprise"
                        value={editingInvoice.datePaiementEntreprise}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, datePaiementEntreprise: e.target.value })}
                    />
                    <button onClick={handleUpdate}>Enregistrer</button>
                    <button onClick={() => setEditingInvoice(null)}>Annuler</button>
                </div>
            )}
        </div>
    );
};

export default App;
