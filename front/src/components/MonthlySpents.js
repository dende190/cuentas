import '../styles/MonthlySpents.css'

function MonthlySpents({spent}) {
  return (
    <ul className="spent">
      <li>
        <p className="spent-date">
          Fecha: {spent.date} ({spent.quantity})
        </p>
      </li>
    </ul>
  );
}

export default MonthlySpents;
