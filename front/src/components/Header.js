import {Link} from 'react-router-dom';
import '../styles/Header.css'
import generateExcel from '../utils/generateExcel';

function Header() {
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

  return (
    <header className="header">
      <Link to="/" className="links">
        Inicio
      </Link>
      <button
        className="header_button links"
        onClick={handlerDownloadBillsReport}
      >
        Generar Informe
      </button>
      <button className="header_button links" onClick={handlerLogOut}>
        Cerrar Sesion
      </button>
    </header>
  );
}

export default Header;
