import {Link} from 'react-router-dom';
import generateExcel from '../utils/generateExcel';
import '../styles/Header.css'
import addDotInNumberText from './../utils/addDotInNumberText';

function Header({
  showConfiguration,
  setShowConfiguration,
  userCurrentSalaryAndBills
}) {
  const handlerDownloadBillsReport = async function() {
    const billsReport = await fetch(
      `${process.env.REACT_APP_URL_API}analitica/deudas`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const billsReportJson = await billsReport.json();
    generateExcel(billsReportJson);
  };

  const handlerLogOut = function() {
    localStorage.removeItem('token');
    window.location.href = 'iniciar_sesion';
  };

  const handlerShowModal = function() {
    setShowConfiguration(!showConfiguration);
  }

  return (
    <header className="header">
      <div className="bills_information">
        <h3
          className={
            'bills_information-current_salary' +
            (userCurrentSalaryAndBills.alertExpense ? ' -alert' : '')
          }>
          Sueldo Actual:
          {addDotInNumberText(userCurrentSalaryAndBills.currentSalary)}
        </h3>
        <h3 className="bills_information-total_bills">
          Gastos:
          {addDotInNumberText(userCurrentSalaryAndBills.totalBills)}
        </h3>
      </div>
      <div>
        <button
          className="header_button links"
          onClick={handlerShowModal}
        >
          Configuracion
        </button>
        <button
          className="header_button links"
          onClick={handlerDownloadBillsReport}
        >
          Generar Informe
        </button>
        <button className="header_button links" onClick={handlerLogOut}>
          Cerrar Sesion
        </button>
      </div>
    </header>
  );
}

export default Header;
