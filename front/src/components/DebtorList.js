import {useState} from 'react';
import Debtor from './Debtor';

function DebtorList({list, setList}) {
  const handlerChangePaid = async (event) => {
    const dDebtorCheck = event.target;
    await fetch(
      `${process.env.REACT_APP_URL_API}deudor/cambiar_estado_de_pago`,
      {
        method: 'post',
        body: (
          JSON
          .stringify({
            debtorInBillId: dDebtorCheck.dataset.id,
            paid: dDebtorCheck.checked
          })
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
  };

  return (
    <div className="debtor_list">
      {
        list.map(debtor => (
          <Debtor
            key={debtor.id}
            data={debtor}
            handlerChangePaid={handlerChangePaid}
          />
        ))
      }
    </div>
  );
}

export default DebtorList;
