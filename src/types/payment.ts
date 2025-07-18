
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
  
  // Dados do beneficiário (opcionais para boleto)
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

  // Dados específicos para boleto
  dadosBoleto?: {
    documento: string;
    codigoBarras: string;
    dataVencimento: Date;
    dataPagamento: Date;
    valorDocumento: number;
    multa: number;
    juros: number;
    descontos: number;
  };
}

export interface CompanyLogo {
  url: string;
  name: string;
}
