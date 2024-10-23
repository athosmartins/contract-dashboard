import React, { useEffect, useState } from 'react';
import { CheckCircle, Folder } from 'lucide-react';
import MaterialContactsSection from './MaterialContactsSection';
import Hotjar from '@hotjar/browser';

const siteId = 5177402;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
      style={{ width: `${value}%` }}
    />
  </div>
);

const formatDate = (dateString, performed = false) => {
  const date = new Date(dateString + 'T12:00:00-03:00');
  
  if (isNaN(date.getTime())) {
    return 'Data Inválida';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  const year = date.getFullYear().toString().slice(-2);

  // If the event is performed (completed), return the "concluído em" format
  if (performed) {
    return `concluído em ${day}/${month}/${year}`;
  }

  // Otherwise, return the standard date format
  return `${day}/${month}/${year}`;
};

const calculateDate = (baseDate, daysToAdd) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

const calculateDaysRemaining = () => {
  const now = new Date();
  const saoPauloNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const currentStepIndex = getCurrentStep();
  const currentStep = timelineSteps[currentStepIndex];

  const end = new Date(currentStep.date + 'T23:59:59-03:00');
  const diffInMs = end - saoPauloNow;
  const diffInDays = (diffInMs / (1000 * 60 * 60 * 24)) - 1;

  return Math.max(0, Math.ceil(diffInDays));
};

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate.toISOString().split('T')[0];
};

// Define time intervals in a single object
const timeIntervalsPlanned = {
  // contractSentDate: 0, // Assuming no days added; adjust if needed
  signature: 1,
  keysDelivery: 4,
  certidoesNegativas: 14,
  viabilityConfirmation: 90,
  commissionPayment: 95,
  projectSubmission: 30,
  projectApproval: 180, // days
  landPayment: 7,
  deedSigning: 40,
  incorporationSubmission: 30,
  finishingMaterialsDeadline: 90,
  incorporationRegistration: 60,
  materialQuantityDelivery: 90,
  constructionEndMonths: 24, // Use months here
};

const timeIntervalsPerformed = {
  contractSentDate: "2024-10-16",
  signatureDate: "2024-10-17",
  keysDelivery: "2024-10-21",
  certidoesNegativas: "2024-10-22",
  // Add more performed steps here as needed
};

const contractData = {

  get signatureDate() {
    return timeIntervalsPerformed.signatureDate || calculateDate(this.contractSentDate, timeIntervalsPlanned.signature);
  },
  get keysDelivery() {
    return timeIntervalsPerformed.keysDelivery || calculateDate(this.signatureDate, timeIntervalsPlanned.keysDelivery);
  },
  get certidoesNegativas() {
    return timeIntervalsPerformed.certidoesNegativas || calculateDate(this.signatureDate, timeIntervalsPlanned.certidoesNegativas);
  },
  get viabilityConfirmation() {
    return calculateDate(this.signatureDate, timeIntervalsPlanned.viabilityConfirmation);
  },
  get commissionPayment() {
    return calculateDate(this.signatureDate, timeIntervalsPlanned.commissionPayment);
  },
  get projectSubmission() {
    return calculateDate(this.viabilityConfirmation, timeIntervalsPlanned.projectSubmission);
  },
  get projectApproval() {
    return calculateDate(this.projectSubmission, timeIntervalsPlanned.projectApproval);
  },
  get landPayment() {
    return calculateDate(this.projectApproval, timeIntervalsPlanned.landPayment);
  },
  get deedSigning() {
    return calculateDate(this.projectApproval, timeIntervalsPlanned.deedSigning);
  },
  get incorporationSubmission() {
    return calculateDate(this.projectApproval, timeIntervalsPlanned.incorporationSubmission);
  },
  get finishingMaterialsDeadline() {
    return calculateDate(this.projectApproval, timeIntervalsPlanned.finishingMaterialsDeadline);
  },
  get incorporationRegistration() {
    return calculateDate(this.incorporationSubmission, timeIntervalsPlanned.incorporationRegistration);
  },
  get materialQuantityDelivery() {
    return calculateDate(this.finishingMaterialsDeadline, timeIntervalsPlanned.materialQuantityDelivery);
  },
  get constructionEnd() {
    return addMonths(this.incorporationRegistration, timeIntervalsPlanned.constructionEndMonths);
  },
};

const timelineSteps = [
  {
    emoji: '📤',
    key: 'contractSentDate',
    date: contractData.contractSentDate,
    label: 'Envio do Contrato',
    time: 0,
    timeUnit: 'dias',
    fromStepLabel: null,
    clickable: false,
  },
  {
    emoji: '✍️',
    key: 'signatureDate',
    date: contractData.signatureDate,
    label: 'Assinatura do Contrato',
    time: timeIntervalsPlanned.signature,
    timeUnit: 'dias',
    fromStepLabel: 'Envio do Contrato',
    clickable: false,
  },
  {
    emoji: '🔑',
    key: 'keysDelivery',
    date: contractData.keysDelivery,
    label: 'Entrega de Chaves',
    time: timeIntervalsPlanned.keysDelivery,
    timeUnit: 'dias',
    fromStepLabel: 'Assinatura do Contrato',
    clickable: false,
  },
  {
    emoji: '📄',
    key: 'certidoesNegativas',
    date: contractData.certidoesNegativas,
    label: 'Envio de CNDs',
    time: timeIntervalsPlanned.certidoesNegativas,
    timeUnit: 'dias',
    fromStepLabel: 'Assinatura do Contrato',
  },
  {
    emoji: '✅',
    key: 'viabilityConfirmation',
    date: contractData.viabilityConfirmation,
    label: 'Confirmação da Viabilidade',
    time: timeIntervalsPlanned.viabilityConfirmation,
    timeUnit: 'dias',
    fromStepLabel: 'Assinatura do Contrato',
  },
  {
    emoji: '💰',
    key: 'commissionPayment',
    date: contractData.commissionPayment,
    label: 'Pagamento da Comissão',
    time: timeIntervalsPlanned.commissionPayment,
    timeUnit: 'dias',
    fromStepLabel: 'Assinatura do Contrato',
  },
  {
    emoji: '📋',
    key: 'projectSubmission',
    date: contractData.projectSubmission,
    label: 'Protocolo do Projeto na PBH',
    time: timeIntervalsPlanned.projectSubmission,
    timeUnit: 'dias',
    fromStepLabel: 'Confirmação da Viabilidade',
  },
  {
    emoji: '🏛️',
    key: 'projectApproval',
    date: contractData.projectApproval,
    label: 'Aprovação do Projeto',
    time: Math.round(timeIntervalsPlanned.projectApproval / 30), // Convert days to months
    timeUnit: 'meses',
    fromStepLabel: 'Protocolo do Projeto na PBH',
    estimate: true,
  },
  {
    emoji: '💰',
    key: 'landPayment',
    date: contractData.landPayment,
    label: 'Pagamento do Terreno',
    time: timeIntervalsPlanned.landPayment,
    timeUnit: 'dias',
    fromStepLabel: 'Aprovação do Projeto',
  },
  {
    emoji: '📃',
    key: 'deedSigning',
    date: contractData.deedSigning,
    label: 'Assinatura da Escritura',
    time: timeIntervalsPlanned.deedSigning,
    timeUnit: 'dias',
    fromStepLabel: 'Aprovação do Projeto',
  },
  {
    emoji: '📑',
    key: 'incorporationSubmission',
    date: contractData.incorporationSubmission,
    label: 'Protocolo da Incorporação',
    time: timeIntervalsPlanned.incorporationSubmission,
    timeUnit: 'dias',
    fromStepLabel: 'Aprovação do Projeto',
  },
  {
    emoji: '🎨',
    key: 'finishingMaterialsDeadline',
    date: contractData.finishingMaterialsDeadline,
    label: 'Formalização de Troca de Revestimentos',
    time: timeIntervalsPlanned.finishingMaterialsDeadline,
    timeUnit: 'dias',
    fromStepLabel: 'Aprovação do Projeto',
  },
  {
    emoji: '🏗️',
    key: 'incorporationRegistration',
    date: contractData.incorporationRegistration,
    label: 'Registro da Incorporação e Início das Obras',
    time: Math.round(timeIntervalsPlanned.incorporationRegistration / 30),
    timeUnit: 'meses',
    fromStepLabel: 'Protocolo da Incorporação',
    estimate: true,
  },
  {
    emoji: '📦',
    key: 'materialQuantityDelivery',
    date: contractData.materialQuantityDelivery,
    label: 'Entrega do Quantitativo de Materiais',
    time: timeIntervalsPlanned.materialQuantityDelivery,
    timeUnit: 'dias',
    fromStepLabel: 'Formalização de Troca de Revestimentos',
  },
  {
    emoji: '🏢',
    key: 'constructionEnd',
    date: contractData.constructionEnd,
    label: 'Conclusão das Obras',
    time: timeIntervalsPlanned.constructionEndMonths,
    timeUnit: 'meses',
    fromStepLabel: 'Registro da Incorporação e Início das Obras',
    estimate: true,
  },
];

const getCurrentStep = () => {
  const now = new Date();
  const saoPauloNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

  for (let i = 0; i < timelineSteps.length; i++) {
    const stepDate = new Date(timelineSteps[i].date + 'T23:59:59-03:00');
    if (saoPauloNow <= stepDate) {
      return i;
    }
  }
  return timelineSteps.length - 1;
};

const getNextStepName = () => {
  const currentStepIndex = getCurrentStep();
  return timelineSteps[currentStepIndex]?.label || '';
};

const calculateProgress = () => {
  const now = new Date();
  const saoPauloNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

  // Get the date from where progress starts (signatureDate)
  const start = new Date(contractData.signatureDate + 'T00:00:00-03:00');
  
  // Get the current step we are tracking
  const currentStepIndex = getCurrentStep();
  const currentStep = timelineSteps[currentStepIndex];

  // End date for the current step
  const end = new Date(currentStep.date + 'T23:59:59-03:00'); 

  // Calculate total days between signature and the current step deadline
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  // Calculate how many days have passed since signature date
  const elapsedDays = Math.floor((saoPauloNow - start) / (1000 * 60 * 60 * 24));

  // Calculate progress as percentage
  const progress = (elapsedDays / totalDays) * 100;

  // Make sure the progress is between 0 and 100
  return Math.min(100, Math.max(0, progress));
};


const drivefolders = [
  { name: 'Documentos dos Proprietários', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
  { name: 'Documentos das Incorporadoras', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
  { name: 'Documentos do Terreno', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
  { name: 'Contratos e Memorial Descritivo', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
];

const getMillisToNextMidnight = () => {
  const now = new Date();
  const saoPaulo = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const tomorrow = new Date(saoPaulo);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow - saoPaulo;
};

const ContractDashboard = () => {
  const [expandedSteps, setExpandedSteps] = useState(Array(timelineSteps.length).fill(false));
  const [, setUpdate] = useState(0);

  const toggleExpanded = (index) => {
    setExpandedSteps(prevExpandedSteps => {
      const newExpanded = [...prevExpandedSteps];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  useEffect(() => {
    console.log("MaterialContactsSection:", MaterialContactsSection);

    const scheduleNextUpdate = () => {
      const msUntilMidnight = getMillisToNextMidnight();

      const timer = setTimeout(() => {
        setUpdate(prev => prev + 1);
        scheduleNextUpdate(); // Schedule the next update
      }, msUntilMidnight);

      return () => clearTimeout(timer);
    };

    const cleanup = scheduleNextUpdate();
    return cleanup;
  }, []);

  console.log(MaterialContactsSection);

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Painel de Acompanhamento</h1>
        
        <div className="mb-6 bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Informações Gerais</h2>
          <p><strong>Imóvel:</strong> Rua Djalma Carneiro 49, Palmeiras, Belo Horizonte - MG</p>
          <p><strong>Permutantes:</strong> Ricardo Rosa e Patrícia Tauil</p>
          <p><strong>Incorporadoras:</strong> Argon Engenharia e Dacosta Incorporadora</p>
        </div>

        {/* Timeline */}
        <div className="mb-6 bg-white p-4 rounded-md shadow">
          <div className="flex items-baseline mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Linha do Tempo</h2>
            <span className="ml-2 text-gray-500 text-sm">(Clique nos itens para mais informações)</span>
          </div>
          <ul className="space-y-4">
            {timelineSteps.map((item, index) => {
              const isExpanded = expandedSteps[index];
              const isPerformed = timeIntervalsPerformed[item.key]; // Correctly get the performed date

              // Handle pluralization
              const timeValue = item.time;
              let timeUnit = item.timeUnit;

              if (timeValue === 1) {
                if (timeUnit === 'dias') timeUnit = 'dia';
                if (timeUnit === 'meses') timeUnit = 'mês';
              }

              // Only apply the onClick handler if the item is clickable
              const handleClick = item.clickable !== false ? () => toggleExpanded(index) : null;

              return (
                <li key={index} className={`flex flex-col ${getCurrentStep() === index ? 'font-bold' : ''}`}>
                  <div className={`flex items-center ${item.clickable !== false ? 'cursor-pointer' : ''}`} onClick={handleClick}>
                    <span className="mr-3 text-xl">{item.emoji}</span>
                    <div className="flex-grow">
                      {/* Apply line-through to the whole line if performed */}
                      <span className={`text-gray-700 ${isPerformed ? 'line-through' : ''}`}>
                        {item.label}: {isPerformed ? formatDate(isPerformed, true) : formatDate(item.date)}
                      </span>
                      {getCurrentStep() === index && <span className="ml-2 text-green-500 text-sm">(Etapa Atual)</span>}
                    </div>
                    {isPerformed && <CheckCircle className="text-green-500 ml-2" size={20} />}
                  </div>
                  {isExpanded && (
                    <div className="ml-8 mt-2 text-gray-600 italic text-sm">
                      {timeValue} {timeUnit} a partir de {item.fromStepLabel}
                      {item.estimate ? ' (Estimativa)' : ''}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-white p-4 rounded-md shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Progresso até Próxima Etapa - {getNextStepName()}</h3>
          <ProgressBar value={calculateProgress()} />
          <p className="text-right text-gray-600 mt-2">
            {calculateDaysRemaining() === 0 
              ? 'Prazo termina hoje!' 
              : `${calculateDaysRemaining()} ${calculateDaysRemaining() === 1 ? 'dia' : 'dias'} até término do prazo`}
          </p>
        </div>

        {/* File Downloads */}
        <div className="mb-6 bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Central de Arquivos</h2>
          <ul className="space-y-2">
            {drivefolders.map((folder, index) => (
              <li key={index}>
                <a 
                  href={folder.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Folder size={18} className="mr-2" />
                  {folder.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Material Contacts Section */}
        <MaterialContactsSection />
      </div>
    </ErrorBoundary>
  );
};

export default ContractDashboard;
