import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Função para obter o último dia do mês seguinte no fuso horário local
const getLastDayOfNextMonth = () => {
  const now = new Date();
  const nextMonth = now.getMonth() + 1; // Próximo mês
  const nextMonthLastDay = new Date(now.getFullYear(), nextMonth + 1, 0); // Último dia do próximo mês
  return nextMonthLastDay;
};

// Função para obter a data atual no fuso horário local
const getCurrentDate = () => {
  const now = new Date();
  return now;
};

// Função para formatar a data para o formato YYYY-MM-DD no fuso horário local
const formatDate = (date) => {
  return date.toLocaleDateString('en-CA'); // 'en-CA' garante o formato YYYY-MM-DD
};


const EventFilter = ({ arrayCategories = [], onSubmit, eventStatus = "PLANNED" }) => {
  const [period, setPeriod] = useState({
    start: formatDate(getCurrentDate()),
    end: formatDate(getLastDayOfNextMonth())
  });
  const [status, setStatus] = useState(eventStatus);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState({ national: true, state: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isValidDate, setIsValidDate] = useState(true); // Estado para controlar a validade da data

  useEffect(() => setStatus(eventStatus), [eventStatus]);
  useEffect(() => {
    setCategories(arrayCategories)
  }, [arrayCategories]);
  // Verificar se a data final é maior ou igual à data inicial
  useEffect(() => { setIsValidDate((new Date(period.end)) >= (new Date(period.start))); }, [period])

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setPeriod({ ...period, [name]: value });
    // 
    // const startDate = new Date(period.start);
    // const endDate = new Date(value);
    // setIsValidDate(endDate >= startDate);
  };



  const handleCategorySelect = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
  };

  const handleLocationChange = (e) => {
    const { name, id, value } = e.target;
    if (name === 'location') {
      setLocation({ state: "", national: id !== 'international' });
    } else if (name === 'uf') {
      setLocation({ ...location, state: value });
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = () => {
    // Converte as datas para UTC antes de enviar para o backend
    const periodUTC = {
      start: new Date(period.start).toISOString(),
      end: new Date(period.end).toISOString()
    };

    // Passar os dados do filtro para o componente pai
    onSubmit({ searchTerm, period: periodUTC, category: selectedCategory, location, status });
  };

  return (
    <div className="w-64 p-4 border border-gray-300 rounded-md">
      <h2 className="text-center text-black py-2 rounded-md">Filtro dos eventos</h2>
      <hr className="border-black border-solid border-b-2 mt-4" />

      <div className="mt-4">
        <div className="flex flex-col mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="mb-2 p-2 border border-gray-300 rounded-md"
            placeholder="Digite o nome do evento, descrição ou artista"
          />
        </div>
      </div>
      <div className="mt-4 mb-2">
        <label className="block">Período</label>
        <div className="flex flex-col relative mt-2">
          <input type="date" name="start" value={period.start}
            onChange={handleDateChange}
            className={`mb-2 p-2 border ${isValidDate ? 'border-gray-300' : 'border-red-500'} rounded-md`}
          />
          <input type="date" name="end" value={period.end}
            onChange={handleDateChange}
            className={`mb-2 p-2 border ${isValidDate ? 'border-gray-300' : 'border-red-500'} rounded-md`}
          />
          {!isValidDate && (<i className='text-center -m-2 text-red-700'>Intervalo de pesquisa inválido.</i>)}
        </div>
      </div>

      <div className="mt-4 relative">
        <label className="block">Categoria</label>
        <div className="flex flex-col mt-2">
          <select
            value={selectedCategory}
            onChange={handleCategorySelect}
            className="mb-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={`cat-${cat.id}`} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block">Localidade</label>
        <div className="mt-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="national"
              name="location"
              value={true}
              checked={location.national}
              onChange={handleLocationChange}
            />
            <label htmlFor="national" className="ml-2 mr-4">Nacional</label>
            <input
              type="radio"
              id="international"
              name="location"
              value={false}
              checked={!location.national}
              onChange={handleLocationChange}
            />
            <label htmlFor="international" className="ml-2">Internacional</label>
          </div>
        </div>
        <div className="mt-2" style={{ minHeight: '40px' }}>
          {location.national && (
            <select
              name="uf"
              value={location.state}
              id='state'
              onChange={handleLocationChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um estado</option>
              {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((state) => (
                <option key={`uf-${state}`} value={state}>{state}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white py-2 w-full rounded-md"
          onClick={handleSubmit}
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

EventFilter.propTypes = {
  arrayCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  onSubmit: PropTypes.func.isRequired,
  eventStatus: PropTypes.string
};
export default EventFilter;
