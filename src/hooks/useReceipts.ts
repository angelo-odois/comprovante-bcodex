
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { toast } from '@/hooks/use-toast';

export interface ReceiptHistoryItem {
  id: string;
  paymentData: PaymentData;
  logo?: CompanyLogo;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<ReceiptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReceipts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select(`
          *,
          company_logos (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedReceipts: ReceiptHistoryItem[] = (data || []).map(receipt => {
        const paymentData: PaymentData = {
          id: receipt.id,
          tipo: receipt.payment_type as any,
          valor: receipt.amount,
          dataHora: new Date(receipt.payment_date),
          status: receipt.status as any,
          pagador: {
            nome: receipt.payer_name,
            cpfCnpj: receipt.payer_document,
            banco: receipt.payer_bank,
            agencia: receipt.payer_agency,
            conta: receipt.payer_account
          },
          beneficiario: {
            nome: receipt.beneficiary_name || '',
            cpfCnpj: receipt.beneficiary_document || '',
            banco: receipt.beneficiary_bank || '',
            agencia: receipt.beneficiary_agency || '',
            conta: receipt.beneficiary_account || '',
            chavePix: receipt.beneficiary_pix_key || ''
          },
          transacao: {
            numeroAutenticacao: receipt.auth_number,
            endToEnd: receipt.end_to_end || '',
            descricao: receipt.description || ''
          }
        };

        // Add boleto data if it exists
        if (receipt.boleto_document) {
          paymentData.dadosBoleto = {
            documento: receipt.boleto_document,
            codigoBarras: receipt.boleto_barcode || '',
            dataVencimento: receipt.boleto_due_date ? new Date(receipt.boleto_due_date) : new Date(),
            dataPagamento: receipt.boleto_payment_date ? new Date(receipt.boleto_payment_date) : new Date(),
            valorDocumento: receipt.boleto_document_value || 0,
            multa: receipt.boleto_fine || 0,
            juros: receipt.boleto_interest || 0,
            descontos: receipt.boleto_discount || 0
          };
        }

        // Add card data if it exists
        if (receipt.card_brand) {
          paymentData.dadosCartao = {
            bandeira: receipt.card_brand,
            ultimosDigitos: receipt.card_last_digits || '',
            parcelas: receipt.card_installments || 1
          };
        }

        const logo = receipt.company_logos ? {
          url: receipt.company_logos.url,
          name: receipt.company_logos.name,
          size: receipt.company_logos.file_size,
          type: receipt.company_logos.file_type
        } : undefined;

        return {
          id: receipt.id,
          paymentData,
          logo,
          templateId: receipt.template_id,
          createdAt: new Date(receipt.created_at),
          updatedAt: new Date(receipt.updated_at)
        };
      });
      
      setReceipts(formattedReceipts);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar comprovantes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveReceipt = async (
    paymentData: PaymentData, 
    logo?: CompanyLogo, 
    templateId?: string
  ) => {
    if (!user) return;

    try {
      let logoId = null;
      
      // Save logo if provided
      if (logo) {
        const { data: logoData, error: logoError } = await supabase
          .from('company_logos')
          .insert({
            user_id: user.id,
            name: logo.name,
            url: logo.url,
            file_size: logo.size || null,
            file_type: logo.type || null
          })
          .select()
          .single();

        if (logoError) throw logoError;
        if (!logoData) throw new Error("Falha ao salvar logo");
        logoId = logoData.id;
      }

      // Save receipt
      const receiptData = {
        user_id: user.id,
        template_id: templateId,
        logo_id: logoId,
        payment_type: paymentData.tipo,
        amount: paymentData.valor,
        status: paymentData.status,
        payment_date: paymentData.dataHora.toISOString(),
        payer_name: paymentData.pagador.nome,
        payer_document: paymentData.pagador.cpfCnpj,
        payer_bank: paymentData.pagador.banco,
        payer_agency: paymentData.pagador.agencia,
        payer_account: paymentData.pagador.conta,
        beneficiary_name: paymentData.beneficiario?.nome,
        beneficiary_document: paymentData.beneficiario?.cpfCnpj,
        beneficiary_bank: paymentData.beneficiario?.banco,
        beneficiary_agency: paymentData.beneficiario?.agencia,
        beneficiary_account: paymentData.beneficiario?.conta,
        beneficiary_pix_key: paymentData.beneficiario?.chavePix,
        auth_number: paymentData.transacao.numeroAutenticacao,
        end_to_end: paymentData.transacao.endToEnd,
        description: paymentData.transacao.descricao,
        fees: 0,
        ...(paymentData.dadosBoleto && {
          boleto_document: paymentData.dadosBoleto.documento,
          boleto_barcode: paymentData.dadosBoleto.codigoBarras,
          boleto_due_date: paymentData.dadosBoleto.dataVencimento.toISOString().split('T')[0],
          boleto_payment_date: paymentData.dadosBoleto.dataPagamento.toISOString().split('T')[0],
          boleto_document_value: paymentData.dadosBoleto.valorDocumento,
          boleto_fine: paymentData.dadosBoleto.multa,
          boleto_interest: paymentData.dadosBoleto.juros,
          boleto_discount: paymentData.dadosBoleto.descontos
        }),
        ...(paymentData.dadosCartao && {
          card_brand: paymentData.dadosCartao.bandeira,
          card_last_digits: paymentData.dadosCartao.ultimosDigitos,
          card_installments: paymentData.dadosCartao.parcelas
        })
      };

      const { data, error } = await supabase
        .from('receipts')
        .insert([receiptData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Comprovante salvo",
        description: "Comprovante salvo com sucesso no histórico.",
      });

      fetchReceipts();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar comprovante",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteReceipt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Comprovante removido",
        description: "Comprovante removido com sucesso.",
      });

      fetchReceipts();
    } catch (error: any) {
      toast({
        title: "Erro ao remover comprovante",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [user]);

  return {
    receipts,
    loading,
    saveReceipt,
    deleteReceipt,
    fetchReceipts,
  };
};
