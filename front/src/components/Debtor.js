import {Fragment, useState} from 'react';

function Debtor({data, handlerChangePaid}) {
  return (
    <Fragment>
      <label>
        <input
          type="checkbox"
          defaultChecked={data.paid}
          onChange={handlerChangePaid}
        />
        {data.name}
      </label>
    </Fragment>
  );
}

export default Debtor;
