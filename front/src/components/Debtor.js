import {Fragment, useState} from 'react';

function Debtor({data, handlerChangePaid, handlerClickDebtorDelete}) {
  return (
    <Fragment>
      <label>
        <input
          data-id={data.id}
          type="checkbox"
          defaultChecked={data.paid}
          onChange={handlerChangePaid}
        />
        {data.name}
        <span>({data.expense})</span>
        <button data-id={data.id} onClick={handlerClickDebtorDelete}>
          Borrar
        </button>
      </label>
    </Fragment>
  );
}

export default Debtor;
