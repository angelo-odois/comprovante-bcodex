
export interface PaymentData {
  id: string;
  tipo: 'PIX' | 'TED' | 'DOC' | 'Boleto' | 'Cartão';
  valor: number;
  dataHora: Date;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  
  // Dados do pagador
  pagador: {
    nome: string;
    cpfCnpj: string;
    banco: string;
    agencia: string;
    conta: string;
  };
  
  // Dados do beneficiário
  beneficiario: {
    nome: string;
    cpfCnpj: string;
    banco: string;
    agencia: string;
    conta: string;
    chavePix?: string;
  };
  
  // Dados da transação
  transacao: {
    numeroAutenticacao: string;
    endToEnd: string;
    descricao: string;
    taxas?: number;
  };
}

export interface CompanyLogo {
  url: string;
  name: string;
}
