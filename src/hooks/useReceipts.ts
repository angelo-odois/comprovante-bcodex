
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PaymentData, CompanyLogo } from '@/types/payment';
import { toast } from '@/components/ui/use-toast';

export interface SupabaseReceipt {
  id: string;
  user_id: string;
  template_id: string | null;
  logo_id: string | null;
  payment_type: string;
  amount: number;
  status: string;
  payment_date: string;
  payer_name: string;
  payer_document: string;
  payer_bank: string;
  payer_agency: string;
  payer_account: string;
  beneficiary_name: string | null;
  beneficiary_document: string | null;
  beneficiary_bank: string | null;
  beneficiary_agency: string | null;
  beneficiary_account: string | null;
  beneficiary_pix_key: string | null;
  auth_number: string;
  end_to_end: string | null;
  description: string | null;
  fees: number | null;
  boleto_document: string | null;
  boleto_barcode: string | null;
  boleto_due_date: string | null;
  boleto_payment_date: string | null;
  boleto_document_value: number | null;
  boleto_fine: number | null;
  boleto_interest: number | null;
  boleto_discount: number | null;
  created_at: string;
  updated_at: string;
}

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<SupabaseReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReceipts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
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

  const saveReceipt = async (paymentData: PaymentData, logoId?: string, templateId?: string) => {
    if (!user) return;

    try {
      const receiptData = {
        user_id: user.id,
        template_id: templateId || null,
        logo_id: logoId || null,
        payment_type: paymentData.tipo,
        amount: paymentData.valor,
        status: paymentData.status,
        payment_date: paymentData.dataHora.toISOString(),
        payer_name: paymentData.pagador.nome,
        payer_document: paymentData.pagador.cpfCnpj,
        payer_bank: paymentData.pagador.banco,
        payer_agency: paymentData.pagador.agencia,
        payer_account: paymentData.pagador.conta,
        beneficiary_name: paymentData.beneficiario.nome || null,
        beneficiary_document: paymentData.beneficiario.cpfCnpj || null,
        beneficiary_bank: paymentData.beneficiario.banco || null,
        beneficiary_agency: paymentData.beneficiario.agencia || null,
        beneficiary_account: paymentData.beneficiario.conta || null,
        beneficiary_pix_key: paymentData.beneficiario.chavePix || null,
        auth_number: paymentData.transacao.numeroAutenticacao,
        end_to_end: paymentData.transacao.endToEnd || null,
        description: paymentData.transacao.descricao || null,
        fees: paymentData.transacao.taxas || null,
        boleto_document: paymentData.dadosBoleto?.documento || null,
        boleto_barcode: paymentData.dadosBoleto?.codigoBarras || null,
        boleto_due_date: paymentData.dadosBoleto?.dataVencimento?.toISOString().split('T')[0] || null,
        boleto_payment_date: paymentData.dadosBoleto?.dataPagamento?.toISOString().split('T')[0] || null,
        boleto_document_value: paymentData.dadosBoleto?.valorDocumento || null,
        boleto_fine: paymentData.dadosBoleto?.multa || null,
        boleto_interest: paymentData.dadosBoleto?.juros || null,
        boleto_discount: paymentData.dadosBoleto?.descontos || null,
      };

      const { data, error } = await supabase
        .from('receipts')
        .insert([receiptData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Comprovante salvo",
        description: "Comprovante salvo na base de dados com sucesso.",
      });

      // Refresh receipts list
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
