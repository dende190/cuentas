import {Fragment, useState} from 'react';
import DebtorForm from './DebtorForm';
import DebtorList from './DebtorList';

function Bill(props) {
  const {id, description, payment} = props.data;
  const [debtorList, setDebtorList] = useState([{
    id: 1,
    paid: false,
    name: 'yo',
  }]);
  const handlerAddDebtor = async (debtor) => {
    const debtorIdResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deudor/crear`,
      {
        method: 'post',
        body: JSON.stringify({billId: id, debtor}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const debtorId = await debtorIdResponse.json();
    if (debtorList.find(debtor => debtor.id === debtorId)) {
      return;
    }

    debtor.id = debtorId;
    setDebtorList([...debtorList, debtor]);
  };

  return (
    <Fragment>
      <div>
        <h3>{description}</h3>
        <p>Total deuda: {payment}</p>
      </div>
      <DebtorForm handlerAddDebtor={handlerAddDebtor} />
      <DebtorList list={debtorList} setList={setDebtorList} />
    </Fragment>
  );
}

export default Bill;
