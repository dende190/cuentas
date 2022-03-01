import {useState} from 'react';
import Debtor from './Debtor';

function DebtorList({billId, list, setList, setBillPaidOut}) {
  const handlerChangePaid = async (event) => {
    const dDebtorCheck = event.target;
    const paidOutResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deudor/cambiar_estado_de_pago`,
      {
        method: 'post',
        body: (
          JSON
          .stringify({
            debtorInBillId: dDebtorCheck.dataset.id,
            paid: dDebtorCheck.checked,
            billId: billId,
          })
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
    const paidOut = await paidOutResponse.json();
    setBillPaidOut(paidOut);
  };

  const handlerClickDebtorDelete = async (event) => {
    const dDebtor = event.target;
    const newExpenseResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deudor/eliminar`,
      {
        method: 'post',
        body: (
          JSON
          .stringify({debtorInBillId: dDebtor.dataset.id})
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const newExpenseJson = await newExpenseResponse.json();
    dDebtor.parentElement.remove();
    list.forEach((debtor, index) => {
      list[index] = {
        ...debtor,
        expense: newExpenseJson.expense,
      };
    });

    setList([...list]);
  };

  return (
    <div className="debtor_list">
      {
        list.map(debtor => (
          <Debtor
            key={debtor.id}
            data={debtor}
            handlerChangePaid={handlerChangePaid}
            handlerClickDebtorDelete={handlerClickDebtorDelete}
          />
        ))
      }
    </div>
  );
}

export default DebtorList;
