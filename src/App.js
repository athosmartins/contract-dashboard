import React from 'react';
import { Download, Phone, CheckCircle } from 'lucide-react';

const ContractDashboard = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateDate = (baseDate, daysToAdd) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  };

  const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate.toISOString().split('T')[0];
  };

  const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];

  const contractData = {
    signatureDate: twoDaysAgo,
    get certidoesNegativas() {
      return calculateDate(this.signatureDate, 14);
    },
    get viabilityConfirmation() {
      return calculateDate(this.signatureDate, 90);
    },
    get commissionPayment() {
      return calculateDate(this.signatureDate, 95);
    },
    get projectSubmission() {
      return calculateDate(this.viabilityConfirmation, 30);
    },
    get projectApproval() {
      return calculateDate(this.projectSubmission, 180);
    },
    get incorporationSubmission() {
      return calculateDate(this.projectApproval, 30);
    },
    get finishingMaterialsDeadline() {
      return calculateDate(this.projectApproval, 90);
    },
    get incorporationRegistration() {
      return calculateDate(this.incorporationSubmission, 90);
    },
    get materialQuantityDelivery() {
      return calculateDate(this.finishingMaterialsDeadline, 90);
    },
    get constructionEnd() {
      return addMonths(this.incorporationRegistration, 24);
    },
  };

  const calculateProgress = () => {
    const now = new Date();
    const start = new Date(contractData.signatureDate);
    const end = new Date(contractData.viabilityConfirmation);
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const calculateDaysRemaining = () => {
    const now = new Date();
    const end = new Date(contractData.viabilityConfirmation);
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  };

  const getCurrentStep = () => {
    const now = new Date();
    const steps = [
      { date: contractData.signatureDate, name: 'Assinatura do Contrato' },
      { date: contractData.certidoesNegativas, name: 'Envio de certidões negativas de débito' },
      { date: contractData.viabilityConfirmation, name: 'Confirmação da Viabilidade' },
      { date: contractData.commissionPayment, name: 'Pagamento da comissão à intermediadora' },
      { date: contractData.projectSubmission, name: 'Protocolo do projeto na Prefeitura' },
      { date: contractData.projectApproval, name: 'Aprovação do projeto pela Prefeitura' },
      { date: contractData.incorporationSubmission, name: 'Protocolo da Incorporação' },
      { date: contractData.finishingMaterialsDeadline, name: 'Prazo para Formalização de Troca de Revestimentos' },
      { date: contractData.incorporationRegistration, name: 'Registro da incorporação e início das obras' },
      { date: contractData.materialQuantityDelivery, name: 'Entrega do quantitativo de materiais' },
      { date: contractData.constructionEnd, name: 'Conclusão das Obras' }
    ];
    
    for (let i = 0; i < steps.length; i++) {
      if (now < new Date(steps[i].date)) {
        return i;
      }
    }
    return steps.length - 1;
  };

  const currentStep = getCurrentStep();

  const timelineSteps = [
    { emoji: '✍️', date: contractData.signatureDate, label: 'Assinatura do Contrato', days: 0 },
    { emoji: '📄', date: contractData.certidoesNegativas, label: 'Envio de certidões negativas de débito', days: 14 },
    { emoji: '✅', date: contractData.viabilityConfirmation, label: 'Confirmação da Viabilidade', days: 90 },
    { emoji: '💰', date: contractData.commissionPayment, label: 'Pagamento da comissão à intermediadora', days: 5 },
    { emoji: '📋', date: contractData.projectSubmission, label: 'Protocolo do projeto na Prefeitura', days: 30 },
    { emoji: '🏛️', date: contractData.projectApproval, label: 'Aprovação do projeto pela Prefeitura', months: 6, estimate: true },
    { emoji: '📑', date: contractData.incorporationSubmission, label: 'Protocolo da Incorporação', days: 30 },
    { emoji: '🎨', date: contractData.finishingMaterialsDeadline, label: 'Prazo para Formalização de Troca de Revestimentos', days: 90 },
    { emoji: '🏗️', date: contractData.incorporationRegistration, label: 'Registro da incorporação e início das obras', months: 2, estimate: true },
    { emoji: '📦', date: contractData.materialQuantityDelivery, label: 'Entrega do quantitativo de materiais', days: 90 },
    { emoji: '🏢', date: contractData.constructionEnd, label: 'Conclusão das Obras', months: 24, estimate: true },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Painel do Contrato</h1>
      
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Informações Gerais</h2>
        <p><strong>Imóvel:</strong> Rua Djalma Carneiro 49, Palmeiras</p>
        <p><strong>Permutantes:</strong> Ricardo Rosa e Patrícia Tauil</p>
        <p><strong>Incorporadoras:</strong> Argon Engenharia e Dacosta Incorporadora</p>
      </div>
      
      {/* Timeline */}
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Linha do Tempo do Contrato</h2>
        <ul className="space-y-4">
          {timelineSteps.map((item, index) => (
            <li key={index} className={`flex items-center ${currentStep === index ? 'font-bold' : ''}`}>
              <span className="mr-3 text-xl">{item.emoji}</span>
              <div className="flex-grow">
                <span className={`text-gray-700 ${index < currentStep ? 'line-through' : ''}`}>{item.label}: </span> 
                <span className={`text-gray-900 ${index < currentStep ? 'line-through' : ''}`}>{formatDate(item.date)}</span>
                <span className="ml-2 text-gray-500 text-sm">
                  ({item.months ? `${item.months} meses` : `${item.days} dias`}{item.estimate ? ' - Estimativa' : ''})
                </span>
                {currentStep === index && <span className="ml-2 text-green-500 text-sm">(Etapa Atual)</span>}
              </div>
              {index < currentStep && (
                <CheckCircle className="text-green-500 ml-2" size={20} />
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2 text-gray-700">Progresso até o Próximo Prazo</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{width: `${calculateProgress()}%`}}
          ></div>
        </div>
        <p className="text-right text-gray-600">{calculateDaysRemaining()} dias até término do prazo</p>
      </div>
      
      {/* File Downloads */}
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Arquivos Anexados</h2>
        <ul className="space-y-2">
          {[
            { name: 'Contrato.pdf', url: '#' },
            { name: 'Termos.docx', url: '#' },
          ].map((file, index) => (
            <li key={index}>
              <a 
                href={file.url} 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download size={18} className="mr-2" />
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* WhatsApp Contacts */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Contatos Relevantes</h2>
        <div className="flex justify-start space-x-3">
          {[
            { name: 'João Silva', phone: '+5511987654321' },
            { name: 'Maria Santos', phone: '+5511123456789' },
            { name: 'Carlos Oliveira', phone: '+5511876543210' },
          ].map((contact, index) => (
            <a
              key={index}
              href={`https://wa.me/${contact.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-1 px-3 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors w-1/3 sm:w-auto"
            >
              <Phone size={16} className="mr-1" />
              {contact.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractDashboard;