import React, { useEffect, useState } from 'react';
import { CheckCircle, Folder } from 'lucide-react';
import MaterialContactsSection from './MaterialContactsSection';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // static getDerivedStateFromError(error) {
  //   return { hasError: true };
  // }

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

const ContractDashboard = () => {
  const formatDate = (dateString) => {
    // Create a new Date object for the given date string
    const date = new Date(dateString + 'T12:00:00-03:00'); // Explicit São Paulo time
    
    // Extract the day, month, and year components
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits for day
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''); // Short month in Portuguese, remove the dot
    const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  
    // Format the date as DD/MM/YY
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
    const diffInDays = (diffInMs / (1000 * 60 * 60 * 24))-1;

    return Math.max(1, Math.ceil(diffInDays));
  };
  
  const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate.toISOString().split('T')[0];
  };

// Define time intervals in a single object
const timeIntervals = {
  signature: 2,
  certidoesNegativas: 14,
  viabilityConfirmation: 90,
  commissionPayment: 95,
  projectSubmission: 30,
  projectApproval: 180, // months equivalent in days for consistency
  landPayment: 7,
  incorporationSubmission: 30,
  finishingMaterialsDeadline: 90,
  incorporationRegistration: 90,
  materialQuantityDelivery: 90,
  constructionEndMonths: 24, // Use months here
};

const contractData = {

  get contractSentDate() {
    return '2024-10-16'
  },
  get signatureDate() {
    return calculateDate(this.contractSentDate, timeIntervals.signature); 
  },
  get certidoesNegativas() {
    return calculateDate(this.signatureDate, timeIntervals.certidoesNegativas);
  },
  get viabilityConfirmation() {
    return calculateDate(this.signatureDate, timeIntervals.viabilityConfirmation);
  },
  get commissionPayment() {
    return calculateDate(this.signatureDate, timeIntervals.commissionPayment);
  },
  get projectSubmission() {
    return calculateDate(this.viabilityConfirmation, timeIntervals.projectSubmission);
  },
  get projectApproval() {
    return calculateDate(this.projectSubmission, timeIntervals.projectApproval);
  },
  get landPayment() {
    return calculateDate(this.projectApproval, timeIntervals.landPayment);
  },
  get incorporationSubmission() {
    return calculateDate(this.projectApproval, timeIntervals.incorporationSubmission);
  },
  get finishingMaterialsDeadline() {
    return calculateDate(this.projectApproval, timeIntervals.finishingMaterialsDeadline);
  },
  get incorporationRegistration() {
    return calculateDate(this.incorporationSubmission, timeIntervals.incorporationRegistration);
  },
  get materialQuantityDelivery() {
    return calculateDate(this.finishingMaterialsDeadline, timeIntervals.materialQuantityDelivery);
  },
  get constructionEnd() {
    return addMonths(this.incorporationRegistration, timeIntervals.constructionEndMonths);
  },
};

const calculateProgress = () => {
  const now = new Date();
  const saoPauloNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const currentStepIndex = getCurrentStep();
  const currentStep = timelineSteps[currentStepIndex];
  const previousStep = timelineSteps[currentStepIndex - 1] || currentStep;

  const start = new Date(previousStep.date + 'T00:00:00-03:00');
  const end = new Date(currentStep.date);
  
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.floor((saoPauloNow - start) / (1000 * 60 * 60 * 24));

  const progress = (elapsedDays / totalDays) * 100;

  console.log('Current step:', currentStep.label);
  console.log('Start date:', start);
  console.log('End date:', end);
  console.log('Now:', saoPauloNow);
  console.log('Total days:', totalDays);
  console.log('Elapsed days:', elapsedDays);
  console.log('Progress:', progress);

  return Math.min(100, Math.max(0, progress));
};

  const drivefolders = [
    { name: 'Documentos dos Proprietários', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
    { name: 'Documentos das Incorporadoras', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
    { name: 'Documentos do Terreno', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
    { name: 'Contratos e Memorial Descritivo', url: 'https://drive.google.com/drive/u/0/folders/1-6_LoqGLj7Emgrt843Nx23YlT_yUgVOr' },
  ];

  const timelineSteps = [
    { emoji: '📤', date: contractData.contractSentDate, label: 'Envio do Contrato', days: 0 },
    { emoji: '✍️', date: contractData.signatureDate, label: 'Assinatura do Contrato', days: timeIntervals.signature },
    { emoji: '📄', date: contractData.certidoesNegativas, label: 'Envio de CNDs', days: timeIntervals.certidoesNegativas },
    { emoji: '✅', date: contractData.viabilityConfirmation, label: 'Confirmação da Viabilidade', days: timeIntervals.viabilityConfirmation },
    { emoji: '💰', date: contractData.commissionPayment, label: 'Pagamento da Comissão', days: 5 },
    { emoji: '📋', date: contractData.projectSubmission, label: 'Protocolo do Projeto na PBH', days: timeIntervals.projectSubmission },
    { emoji: '🏛️', date: contractData.projectApproval, label: 'Aprovação do Projeto', months: 6, estimate: true },
    { emoji: '💰', date: contractData.landPayment, label: 'Pagamento do Terreno', days: timeIntervals.landPayment},
    { emoji: '📑', date: contractData.incorporationSubmission, label: 'Protocolo da Incorporação', days: timeIntervals.incorporationSubmission },
    { emoji: '🎨', date: contractData.finishingMaterialsDeadline, label: 'Formalização de Troca de Revestimentos', days: timeIntervals.finishingMaterialsDeadline },
    { emoji: '🏗️', date: contractData.incorporationRegistration, label: 'Registro da Incorporação e Início das Obras', months: 2, estimate: true },
    { emoji: '📦', date: contractData.materialQuantityDelivery, label: 'Entrega do Quantitativo de Materiais', days: timeIntervals.materialQuantityDelivery },
    { emoji: '🏢', date: contractData.constructionEnd, label: 'Conclusão das Obras', months: timeIntervals.constructionEndMonths, estimate: true },
  ];

  const getNextStepName = () => {
    const currentStepIndex = getCurrentStep();
    return timelineSteps[currentStepIndex]?.label || '';
  };
 
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
  

  const currentStep = getCurrentStep();

  // Function to calculate milliseconds until next midnight in São Paulo
  const getMillisToNextMidnight = () => {
    const now = new Date();
    const saoPaulo = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const tomorrow = new Date(saoPaulo);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow - saoPaulo;
  };

  const [, setUpdate] = useState(0);

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
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Linha do Tempo</h2>
        <ul className="space-y-4">
          {timelineSteps.map((item, index) => (
            <li key={index} className={`flex items-center ${getCurrentStep() === index ? 'font-bold' : ''}`}>
              <span className="mr-3 text-xl">{item.emoji}</span>
              <div className="flex-grow">
                <span className={`text-gray-700 ${index < getCurrentStep() ? 'line-through' : ''}`}>{item.label}: </span> 
                <span className={`text-gray-900 ${index < getCurrentStep() ? 'line-through' : ''}`}>{formatDate(item.date)}</span>
                <span className="ml-2 text-gray-500 text-sm">
                  ({item.months ? `${item.months} meses` : `${item.days} dias`}{item.estimate ? ' - Estimativa' : ''})
                </span>
                {getCurrentStep() === index && <span className="ml-2 text-green-500 text-sm">(Etapa Atual)</span>}
              </div>
              {index < getCurrentStep() && (
                <CheckCircle className="text-green-500 ml-2" size={20} />
              )}
            </li>
          ))}
        </ul>
      </div>
      
      
      {/* Progress Bar */}
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2 text-gray-700">Progresso até Próxima Etapa - {getNextStepName()}</h3>
        <ProgressBar value={calculateProgress()} />
        <p className="text-right text-gray-600 mt-2">
        <p className="text-right text-gray-600">
        {calculateDaysRemaining()} {calculateDaysRemaining() === 1 ? 'dia' : 'dias'} até término do prazo     
        </p>
        </p>
        {/* Debug information */}
        {/* <p className="text-sm text-gray-500 mt-2">
          Debug: Progress = {calculateProgress().toFixed(2)}%, Current Step: {getCurrentStep()}
        </p> */}
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
      
      {/* WhatsApp Contacts
      <div className="mb-6 bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Contatos Relevantes</h2>
          <div className="flex flex-wrap justify-start gap-2">
            {[
              { name: 'Athos - Intermediador', phone: '+5531988598058' },
              { name: 'Henrique - Argon Engenharia', phone: '+5531996885771' },
              { name: 'Fernando - Dacosta Incorporadora', phone: '+5531997090500' },
              { name: 'Ricardo - Proprietário', phone: '+5531985271381' },
            ].map((contact, index) => (
              <a
                key={index}
                href={`https://wa.me/${contact.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-1 px-3 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                <Phone size={16} className="mr-1" />
                {contact.name}
              </a>
            ))}
          </div>
        </div> */}

        {/* Material Contacts Section */}
        <MaterialContactsSection />
      </div>
    </ErrorBoundary>
  );
};

export default ContractDashboard;