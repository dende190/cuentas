import {useState} from 'react';
import Debtor from './Debtor';

function DebtorList({list, setList}) {
  const handlerChangePaid = (event) => {
    console.log(event.target)
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
