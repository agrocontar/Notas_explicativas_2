'use client'
import { Dropdown } from "primereact/dropdown"
import api from "@/app/api/api";
import { useEffect, useState } from "react";
import { Company } from "../page";

interface SelectComapanyProps {
  setSelectedCompany: any
  selectedCompany: Company | null;
}



export const SelectCompany = ({ selectedCompany, setSelectedCompany }: SelectComapanyProps) => {
  const [companies, setCompanies] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {

      try{
        const response = await api.get('/companies/user');
        setCompanies(response.data);
      }catch(err){
        console.log('Erro ao buscar Empresas', err)
      }
    };
    fetchCompanies();
  }, []);

  return (
    <>
      <Dropdown 
          value={selectedCompany} 
          onChange={(e) => setSelectedCompany(e.value)} 
          options={companies} 
          optionLabel="name" 
          placeholder="Selecione a Empresa" 
          className="w-full md:w-14rem"
          editable
      />
    </>
  );
}