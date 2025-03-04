import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../components/InvoiceRevenue.module.scss';

interface Invoice {
  _id: string;
  id_client: { name: string } | null;
  montantInitial: number;
  remise: number;
  montantApresRemise: number;
  montantPaye: number;
  montantRestant: number;
  datePaiementEntreprise: string;
  datePaiementClient: string;
  statut: string;
}

interface Client {
  _id: string;
  name: string;
}

const InvoiceWebPart: React.FC = () => {
  const [addInvoicective, setAddInvoicective] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [editedMontantPaye, setEditedMontantPaye] = useState<{ [key: string]: number }>({});

  const [newInvoice, setNewInvoice] = useState({
    id_client: '',
    montantInitial: 0,
    remise: 0,
    montantPaye: 0,
    datePaiementEntreprise: '',
    statut: 'unpaid',
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3320/api/invoice/getAll');
      setInvoices(res.data.invoices || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3320/api/client/getAll');
      setClients(res.data.clients || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients :', error);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({
      ...prev,
      [name]: ['montantInitial', 'remise', 'montantPaye'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };



  const handleAddInvoice = async () => {
    if (!newInvoice.id_client) {
      alert('Veuillez sélectionner un client.');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:3320/api/invoice/create', newInvoice);
      fetchInvoices();
      setNewInvoice({
        id_client: '',
        montantInitial: 0,
        remise: 0,
        montantPaye: 0,
        datePaiementEntreprise: '',
        statut: 'unpaid',
      });
      setAddInvoicective(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture :", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:3320/api/invoice/deleteOne/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture :', error);
    }
  };

  const handleEditClick = (invoice: Invoice) => {
    setEditingInvoiceId(invoice._id);
    setEditedMontantPaye({
      ...editedMontantPaye,
      [invoice._id]: invoice.montantPaye,
    });
  };

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setEditedMontantPaye({
      ...editedMontantPaye,
      [id]: parseFloat(e.target.value) || 0,
    });
  };

  const handleUpdate = async (id: string) => {
    const updatedMontantPaye = editedMontantPaye[id];
    try {
      const updatedInvoice = invoices.find((inv) => inv._id === id);
      if (!updatedInvoice) return;
      const updatedData: Partial<Invoice> = { montantPaye: updatedMontantPaye };
      if (updatedMontantPaye >= updatedInvoice.montantApresRemise) {
        updatedData.datePaiementClient = new Date().toISOString();
        updatedData.statut = "paid";
      }
      await axios.put(`http://127.0.0.1:3320/api/invoice/updateOne/${id}`, updatedData);
      fetchInvoices();
      setEditingInvoiceId(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture :", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingInvoiceId(null);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Non payé";
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

  return (
    <div className={styles.invoice}>
      <h2>Gestion des Factures</h2>
      <button onClick={() => setAddInvoicective(!addInvoicective)}>Ajouter</button>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Montant Initial</th>
            <th>Remise (%)</th>
            <th>Montant Après Remise</th>
            <th>Montant Payé</th>
            <th>Montant Restant</th>
            <th>Date paiement entreprise</th>
            <th>Date dernier paiement client</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* pour lajout de nouveau invoice: */}
          {addInvoicective ?
            <tr>
              <td><select name="id_client" onChange={handleChange} value={newInvoice.id_client}>
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
              </td>
              <td><input type="number" name="montantInitial" placeholder="Montant Initial (€)" onChange={handleChange} value={newInvoice.montantInitial} />
              </td>
              <td>
                <input type="number" name="remise" placeholder="Remise (%)" onChange={handleChange} value={newInvoice.remise} />
              </td>
              <td>Montant Après Remise</td>
              <td>
                <input type="number" name="montantPaye" placeholder="Montant Payé (€)" onChange={handleChange} value={newInvoice.montantPaye} />
              </td>
              <td>Montant Restant</td>
              <td>
                <input type="date" name="datePaiementEntreprise" onChange={handleChange} value={newInvoice.datePaiementEntreprise} />
              </td>
              <td>Date paiement client</td>
              <td>Statut</td>
              <td>
                <button onClick={handleAddInvoice}>save</button>
                <button onClick={() => setAddInvoicective(false)}>close</button>
              </td>
            </tr>
            : null
          }

          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.id_client?.name || "Inconnu"}</td>
              <td>{invoice.montantInitial.toFixed(2)} €</td>
              <td>{invoice.remise} %</td>
              <td>{invoice.montantApresRemise?.toFixed(2)} €</td>
              <td>
                {editingInvoiceId === invoice._id ? (
                  <input
                    type="number"
                    value={editedMontantPaye[invoice._id] || 0}
                    onChange={(e) => handleMontantChange(e, invoice._id)}
                  />
                ) : (
                  `${invoice.montantPaye?.toFixed(2)} €`
                )}
              </td>
              <td>{invoice.montantRestant?.toFixed(2)} €</td>
              <td>{formatDateTime(invoice.datePaiementEntreprise)}</td>
              <td>{formatDateTime(invoice.datePaiementClient)}</td>
              <td>{invoice.statut}</td>
              <td>
                {editingInvoiceId === invoice._id ? (
                  <>
                    <button onClick={() => handleUpdate(invoice._id)}>Enregistrer</button>
                    <button onClick={handleCancelEdit}>Annuler</button>
                  </>
                ) : (
                  <>
                    {invoice.statut === "paid" ? null :
                      <>
                        <button onClick={() => handleDelete(invoice._id)}>Supprimer</button>
                        <button onClick={() => handleEditClick(invoice)}>Modifier</button>
                      </>
                    }

                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default InvoiceWebPart;
