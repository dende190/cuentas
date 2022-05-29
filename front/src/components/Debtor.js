import {useState} from 'react';
import '../styles/Debtor.css';
import Trash from '../img/trash.png';
import addDotInNumberText from './../utils/addDotInNumberText';

function Debtor({data, handlerChangePaid, handlerClickDebtorDelete}) {
  return (
    <div className={`container_debtor_info jsDebtor${data.id}`}>
      <label>
        <input
          className="debtor_checkbox"
          data-id={data.id}
          type="checkbox"
          defaultChecked={data.paid}
          onChange={handlerChangePaid}
        />
        {data.name}
        <span className="debtor_expanse">
          ({addDotInNumberText(data.expense)})
        </span>
      </label>
      <button
        className="debtor_trash"
        data-id={data.id}
        onClick={handlerClickDebtorDelete}
      >
        <img src={Trash} data-id={data.id} onClick={handlerClickDebtorDelete}/>
      </button>
    </div>
  );
}

export default Debtor;
