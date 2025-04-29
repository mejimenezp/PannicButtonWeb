import { useState, useEffect } from "react";

const getUnique = (array, key) =>
  [...new Set(array.map((item) => item[key]).filter(Boolean))].sort();

const useDynamicFilters = (data, isDependent = true) => {
  const [filters, setFilters] = useState({
    departamento: "",
    area: "",
    ciudad: "",
    vereda: "",
    localidad: ""
  });

  const [filterOptions, setFilterOptions] = useState({
    departamentos: [],
    areas: [],
    ciudades: [],
    veredas: [],
    localidades: []
  });

  const [filteredData, setFilteredData] = useState(data);

  const extractFilterOptions = (currentFilters = filters) => {
    let filtered = data;

    if (isDependent) {
      if (currentFilters.departamento) {
        filtered = filtered.filter(d => d.Departamento === currentFilters.departamento);
      }
      if (currentFilters.area) {
        filtered = filtered.filter(d => d.Area === currentFilters.area);
      }
      if (currentFilters.ciudad) {
        filtered = filtered.filter(d => d.Ciudad === currentFilters.ciudad);
      }
      if (currentFilters.vereda) {
        filtered = filtered.filter(d => d.Vereda === currentFilters.vereda);
      }
    }

    setFilterOptions({
      departamentos: getUnique(filtered, "Departamento"),
      areas: getUnique(filtered, "Area"),
      ciudades: getUnique(filtered, "Ciudad"),
      veredas: getUnique(filtered, "Vereda"),
      localidades: getUnique(filtered, "Localidad")
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    setFilters(updatedFilters);
    extractFilterOptions(updatedFilters);
  };

  const handleClearFilters = () => {
    const empty = {
      departamento: "",
      area: "",
      ciudad: "",
      vereda: "",
      localidad: ""
    };
    setFilters(empty);
    extractFilterOptions(empty);
  };

  useEffect(() => {
    extractFilterOptions();
  }, [data]); // refresh options if new data is loaded

  useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        (filters.departamento === "" || item.Departamento === filters.departamento) &&
        (filters.area === "" || item.Area === filters.area) &&
        (filters.ciudad === "" || item.Ciudad === filters.ciudad) &&
        (filters.vereda === "" || item.Vereda === filters.vereda) &&
        (filters.localidad === "" || item.Localidad === filters.localidad)
      );
    });
    setFilteredData(filtered);
  }, [filters, data]);

  return {
    filters,
    filterOptions,
    filteredData,
    handleFilterChange,
    handleClearFilters
  };
};

export default useDynamicFilters;
