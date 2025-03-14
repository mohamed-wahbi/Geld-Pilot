import * as React from 'react';
import { useState } from 'react';
import styles from '../MonthlyActivities.module.scss';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';


const Generate: React.FC = () => {
  const [generatMonthlyActivitiesTab, setGeneratMonthlyActivitiesTab] = useState(false);
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [bankFund, setBankFund] = useState<number | null>(null);






  // ----------------------------------generated Monthly Activities function---------------------------------

  const generatedMonthlyActivitiesResults = async () => {
    if (!year || !month || bankFund === null) {
      notify("All inputs are required ⛔")
      return;
    }

    try {
      await axios.post("http://127.0.0.1:3320/api/monthly-financial-activitie/create", {
        year,
        month,
        bankFund
      });
      notify("Monthly Activities created successfully ✅ ")
      setBankFund(null);
      setYear("")
      setMonth("")
      setGeneratMonthlyActivitiesTab(false)
    } catch (error) {
      notify("Monthly Activities already ⛔ ")
      notify("Monthly Activities date not exist ⛔ ")
      console.error("Erreur lors de la création de l'activité financière:", error);

    }
  };
  // _______________________________________________________________________________






  // ----------------------------------Notif Alert---------------------------------
  const notify = (text: string) => toast(text, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  });
  // _______________________________________________________________________________


  return (
    <div>
      <ToastContainer />
      <div className={styles.HeaderTabelCtrl} style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
        <div className={styles.generateRevenue}>
          <div className={styles.Top}>
            <p>Generat Monthly Activitys</p>
            <button onClick={() => {
              setGeneratMonthlyActivitiesTab(!generatMonthlyActivitiesTab);
              setYear("");
              setMonth("");
              setBankFund(null);
            }}>
              {generatMonthlyActivitiesTab ? "❌" : "🆕"}
            </button>
          </div>

          {generatMonthlyActivitiesTab && (
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

              <div className={styles.inputGenerateForm}>
                <label>Bank Fund</label>
                <input
                  placeholder="1000"
                  value={bankFund ?? ""}
                  type="number"
                  onChange={(e) => setBankFund(Number(e.target.value))}
                  required
                />
              </div>


              <div className={styles.btnContent}>
                <button style={{ border: "none" }} onClick={generatedMonthlyActivitiesResults}>➕</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
