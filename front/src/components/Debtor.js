import {Fragment, useState} from 'react';

function Debtor({data, handlerChangePaid}) {
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
      </label>
    </Fragment>
  );
}

export default Debtor;
