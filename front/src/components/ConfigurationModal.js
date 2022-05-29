import {useState} from 'react';
import '../styles/ConfigurationModal.css'
import addDotInNumberText from './../utils/addDotInNumberText';

function ConfigurationModal({
  showConfiguration,
  setShowConfiguration,
  configuration,
  setConfiguration
}) {
  const handlerhideModal = function() {
    setShowConfiguration(!showConfiguration);
  }

  const handlerSubmit = async function(event) {
    event.preventDefault();
    const configurationResponse = await fetch(
      `${process.env.REACT_APP_URL_API}usuario/guardarConfiguracion`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, configuration}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const configurationJson = await configurationResponse.json();
    setConfiguration({
      ...configuration,
      configurationJson
    });

    handlerhideModal();
  }

  const handlerChangeSalary = (event) => {
    const salary = event.target.value.replaceAll('.', '');
    if (!salary.length) {
      setConfiguration({
        ...configuration,
        salary: 0,
        salaryWithDot: '',
      });
      return;
    }

    if (!Number(salary)) {
      return;
    }

    setConfiguration({
      ...configuration,
      salary: salary,
      salaryWithDot: addDotInNumberText(salary),
    });
  };

  const handlerChange = function(event) {
    const dInput = event.target;
    setConfiguration({
      ...configuration,
      [dInput.name]: dInput.value,
    });
  }

  return (
    <div className={`modal_container${showConfiguration ? ' ' : ' hidden'}`}>
      <div className="modal">
        <button className="modal-close" onClick={handlerhideModal}>
          x
        </button>
        <h1 className="modalTitle">
          Configuracion:
        </h1>
        <form
          method="post"
          onSubmit={handlerSubmit}
        >
          <label>
            Sueldo mensual:
            <input
              className="input configuration_input"
              type="tel"
              name="salary"
              placeholder="Sueldo mensual"
              value={(configuration.salaryWithDot || '')}
              onChange={handlerChangeSalary}
            />
          </label>
          <label>
            Dia de pago:
            <input
              className="input configuration_input"
              type="number"
              name="payday"
              placeholder="Dia de pago"
              min="1"
              max="30"
              value={(configuration.payday || '')}
              onChange={handlerChange}
            />
          </label>
          <label>
            Porcentaje para alertar gastos:
            <input
              className="input configuration_input"
              type="number"
              name="percentageAlertExpense"
              placeholder="Porcentaje para alertar gastos"
              min="0"
              max="100"
              value={(configuration.percentageAlertExpense || '')}
              onChange={handlerChange}
            />
          </label>
          <button className="button configuration">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfigurationModal;
